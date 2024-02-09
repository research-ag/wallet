import { AllowanceValidationErrorsEnum, TAllowance } from "@/@types/allowance";
import { submitAllowanceApproval, createApproveAllowanceParams, getSubAccountBalance } from "@/pages/home/helpers/icrc";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { useMutation } from "@tanstack/react-query";
import { throttle } from "lodash";
import { useCallback, useState } from "react";
import useAllowanceDrawer from "./useAllowanceDrawer";
import {
  removeAllowanceError,
  setAllowanceError,
  setAllowances,
  setFullAllowanceErrors,
} from "@redux/allowance/AllowanceReducer";
import { updateAllowanceRequest } from "../services/allowance";
import { validateUpdateAllowance } from "../validators/allowance";
import { updateSubAccountBalance } from "@redux/assets/AssetReducer";

export function useUpdateAllowance() {
  const dispatch = useAppDispatch();
  const { onCloseUpdateAllowanceDrawer } = useAllowanceDrawer();
  const { selectedAllowance } = useAppSelector((state) => state.allowance);
  const [allowance, setAllowance] = useState<TAllowance>(selectedAllowance);

  const setAllowanceState = (allowanceData: Partial<TAllowance>) => {
    setAllowance({
      ...allowance,
      ...allowanceData,
    });
  };

  const mutationFn = useCallback(async () => {
    dispatch(setFullAllowanceErrors([]));
    validateUpdateAllowance(allowance);
    const params = createApproveAllowanceParams(allowance);
    await submitAllowanceApproval(params, allowance.asset.address);
    const updatedAllowances = await updateAllowanceRequest(allowance);
    dispatch(setAllowances(updatedAllowances));
  }, [allowance]);

  const onSuccess = async () => {
    const refreshParams = {
      subAccount: allowance.subAccount.sub_account_id,
      assetAddress: allowance.asset.address,
    };
    const amount = await getSubAccountBalance(refreshParams);
    const balance = amount ? amount.toString() : "0";
    dispatch(updateSubAccountBalance(allowance.asset.tokenSymbol, allowance.subAccount.sub_account_id, balance));
    onCloseUpdateAllowanceDrawer();
  };

  const onError = (error: string) => {
    console.log(error);
    if (error === AllowanceValidationErrorsEnum.Values["error.invalid.amount"])
      return dispatch(setAllowanceError(AllowanceValidationErrorsEnum.Values["error.invalid.amount"]));
    dispatch(removeAllowanceError(AllowanceValidationErrorsEnum.Values["error.invalid.amount"]));

    if (error === AllowanceValidationErrorsEnum.Values["error.not.enough.balance"])
      return dispatch(setAllowanceError(AllowanceValidationErrorsEnum.Values["error.not.enough.balance"]));
    dispatch(removeAllowanceError(AllowanceValidationErrorsEnum.Values["error.not.enough.balance"]));

    if (error === AllowanceValidationErrorsEnum.Values["error.before.present.expiration"])
      return dispatch(setAllowanceError(AllowanceValidationErrorsEnum.Values["error.before.present.expiration"]));
    dispatch(removeAllowanceError(AllowanceValidationErrorsEnum.Values["error.before.present.expiration"]));
  };

  const { mutate, isPending, isError, error, isSuccess } = useMutation({ mutationFn, onError, onSuccess });

  return {
    isPending,
    isError,
    error,
    isSuccess,
    allowance,
    updateAllowance: throttle(mutate, 1000),
    setAllowanceState,
  };
}
