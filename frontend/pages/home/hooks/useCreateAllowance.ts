import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { TErrorValidation } from "@/@types/common";
import { TAllowance } from "@/@types/allowance";
import { allowanceValidationSchema } from "@/helpers/schemas/allowance";
import { ICRCApprove, generateApproveAllowance } from "@/helpers/icrc";
import { postAllowance } from "@/services/allowance";
import { validatePrincipal } from "@/utils/identity";
import useAllowanceDrawer from "./useAllowanceDrawer";

import { throttle } from "lodash";
import { useAppSelector } from "@redux/Store";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { initialAllowanceState } from "@redux/allowance/AllowanceReducer";
import { allowanceFullReload } from "../helpers/allowanceCache";

export default function useCreateAllowance() {
  const { onCloseCreateAllowanceDrawer } = useAllowanceDrawer();
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
      const valid = allowanceValidationSchema.safeParse(fullAllowance);
      if (!valid.success) return Promise.reject(valid.error);
      const params = generateApproveAllowance(fullAllowance);
      await ICRCApprove(params, allowance.asset.address);
      await postAllowance(fullAllowance);
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }, [allowance]);

  const onSuccess = async () => {
    await allowanceFullReload();
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
