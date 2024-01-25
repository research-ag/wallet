import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { TErrorValidation } from "@/@types/common";
import { TAllowance } from "@/@types/allowance";
import { ICRCApprove, generateApproveAllowance } from "@/pages/home/helpers/icrc";
import { validatePrincipal } from "@/utils/identity";
import useAllowanceDrawer from "./useAllowanceDrawer";

import { throttle } from "lodash";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { initialAllowanceState, setAllowances } from "@redux/allowance/AllowanceReducer";
import { postAllowance } from "../services/allowance";
import { allowanceValidationSchema, validationMessage } from "../validators/allowance";

export default function useCreateAllowance() {
  const dispatch = useAppDispatch();
  const { onCloseCreateAllowanceDrawer } = useAllowanceDrawer();
  const { allowances } = useAppSelector((state) => state.allowance);

  const { selectedAsset, selectedAccount } = useAppSelector(({ asset }) => asset);
  const [validationErrors, setErrors] = useState<TErrorValidation[]>([]);
  const [isPrincipalValid, setIsPrincipalValid] = useState(true);

  const initial = useMemo(() => {
    return {
      ...initialAllowanceState,
      asset: selectedAsset,
      subAccount: selectedAccount,
    };
  }, [selectedAsset]) as TAllowance;

  const [allowance, setAllowance] = useState<TAllowance>(initial);

  const setAllowanceState = (allowanceData: Partial<TAllowance>) => {
    setAllowance({
      ...allowance,
      ...allowanceData,
    });
  };

  const mutationFn = useCallback(async () => {
    try {
      const fullAllowance = { ...allowance, id: uuidv4() };
      const allowanceExists = allowances.find(
        (allowance) =>
          allowance.subAccount.sub_account_id === fullAllowance.subAccount.sub_account_id &&
          allowance.spender.principal === fullAllowance.spender.principal,
      );

      if (allowanceExists) return Promise.reject(validationMessage.duplicatedAllowance);

      const valid = allowanceValidationSchema.safeParse(fullAllowance);
      if (!valid.success) return Promise.reject(valid.error);
      const params = generateApproveAllowance(fullAllowance);
      await ICRCApprove(params, allowance.asset.address);
      const savedAllowances = await postAllowance(fullAllowance);
      dispatch(setAllowances(savedAllowances));
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }, [allowance]);

  const onSuccess = async () => {
    onCloseCreateAllowanceDrawer();
  };

  const onError = (error: any) => {
    if (error instanceof z.ZodError) {
      const validationErrors = error.issues.map((issue) => ({
        message: issue.message,
        field: String(issue.path[0]),
        code: issue.code,
      }));

      setErrors(validationErrors);
      return;
    }

    if (error === validationMessage.duplicatedAllowance) {
      setErrors([{ message: error, field: "", code: "duplicated" }]);
      return;
    }
  };

  const { mutate, isPending, isError, error, isSuccess } = useMutation({ onSuccess, onError, mutationFn });

  useEffect(() => {
    if (allowance?.spender?.principal) {
      const isValid = validatePrincipal(allowance?.spender?.principal);
      setIsPrincipalValid(isValid);
    }
  }, [allowance?.spender?.principal]);

  return {
    allowance,
    isPending,
    isError,
    error,
    validationErrors,
    isSuccess,
    isPrincipalValid,
    createAllowance: throttle(mutate, 1000),
    setAllowanceState,
  };
}
