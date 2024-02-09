import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { TErrorValidation } from "@/@types/common";
import { TAllowance } from "@/@types/allowance";
import { submitAllowanceApproval, createApproveAllowanceParams, getSubAccountBalance } from "@/pages/home/helpers/icrc";
import { validatePrincipal } from "@/utils/identity";
import useAllowanceDrawer from "./useAllowanceDrawer";

import { throttle } from "lodash";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { initialAllowanceState, setAllowances, setFullAllowanceErrors } from "@redux/allowance/AllowanceReducer";
import { postAllowance } from "../services/allowance";
import { allowanceValidationSchema, validateCreateAllowance, validationMessage } from "../validators/allowance";
import { SupportedStandardEnum } from "@/@types/icrc";
import { updateSubAccountBalance } from "@redux/assets/AssetReducer";

export default function useCreateAllowance() {
  const dispatch = useAppDispatch();
  const { onCloseCreateAllowanceDrawer } = useAllowanceDrawer();
  const { allowances } = useAppSelector((state) => state.allowance);

  const { selectedAsset, selectedAccount } = useAppSelector(({ asset }) => asset);
  const [validationErrors, setErrors] = useState<TErrorValidation[]>([]);

  const initial = useMemo(() => {
    const supported = selectedAsset?.supportedStandards?.includes(SupportedStandardEnum.Values["ICRC-2"]);
    if (!supported) return initialAllowanceState;

    return {
      ...initialAllowanceState,
      asset: supported ? selectedAsset : undefined,
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
      dispatch(setFullAllowanceErrors([]));
      validateCreateAllowance(fullAllowance);
      // const params = createApproveAllowanceParams(fullAllowance);
      // await submitAllowanceApproval(params, allowance.asset.address);
      // const savedAllowances = await postAllowance(fullAllowance);
      // dispatch(setAllowances(savedAllowances));
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }, [allowance]);

  const onSuccess = async () => {
    // const refreshParams = {
    //   subAccount: allowance.subAccount.sub_account_id,
    //   assetAddress: allowance.asset.address,
    // };
    // const amount = await getSubAccountBalance(refreshParams);
    // const balance = amount ? amount.toString() : "0";
    // dispatch(updateSubAccountBalance(allowance.asset.tokenSymbol, allowance.subAccount.sub_account_id, balance));
    // onCloseCreateAllowanceDrawer();
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

  return {
    allowance,
    isPending,
    isError,
    error,
    validationErrors,
    isSuccess,
    createAllowance: throttle(mutate, 1000),
    setAllowanceState,
  };
}
