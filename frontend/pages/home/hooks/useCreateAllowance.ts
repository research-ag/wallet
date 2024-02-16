import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { AllowanceValidationErrorsEnum, TAllowance } from "@/@types/allowance";
import { submitAllowanceApproval, createApproveAllowanceParams, getSubAccountBalance } from "@/pages/home/helpers/icrc";
import useAllowanceDrawer from "./useAllowanceDrawer";

import { throttle } from "lodash";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { v4 as uuidv4 } from "uuid";
import { initialAllowanceState } from "@redux/allowance/AllowanceReducer";
import { postAllowance } from "../services/allowance";
import { validateCreateAllowance } from "../validators/allowance";
import { SupportedStandardEnum } from "@/@types/icrc";
import { updateSubAccountBalance } from "@redux/assets/AssetReducer";
import {
  removeAllowanceErrorAction,
  setAllowanceErrorAction,
  setAllowancesAction,
  setFullAllowanceErrorsAction,
} from "@redux/allowance/AllowanceActions";

export default function useCreateAllowance() {
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);
  const { onCloseCreateAllowanceDrawer } = useAllowanceDrawer();

  const { selectedAsset, selectedAccount } = useAppSelector(({ asset }) => asset);

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
    const fullAllowance = { ...allowance, id: uuidv4() };
    setFullAllowanceErrorsAction([]);
    validateCreateAllowance(fullAllowance);

    // TODO: call if function isDuplicatedAllowance to check if exist by (sub account, spender and asset)
    // // TODO: if so, check if expiration and amount same. if so close the drawer and not update
    // // TODO: if not, perform a ledger update and update the allowance list

    const params = createApproveAllowanceParams(fullAllowance);
    await submitAllowanceApproval(params, allowance.asset.address);
    const savedAllowances = await postAllowance(fullAllowance);
    setAllowancesAction(savedAllowances);
  }, [allowance]);

  const onSuccess = async () => {
    const refreshParams = {
      subAccount: allowance.subAccount.sub_account_id,
      assetAddress: allowance.asset.address,
    };
    const amount = await getSubAccountBalance(refreshParams);
    const balance = amount ? amount.toString() : "0";
    dispatch(updateSubAccountBalance(allowance.asset.tokenSymbol, allowance.subAccount.sub_account_id, balance));
    onCloseCreateAllowanceDrawer();
  };

  const onError = (error: string) => {
    if (error === AllowanceValidationErrorsEnum.Values["error.invalid.asset"])
      return setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.asset"]);
    removeAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.asset"]);

    if (error === AllowanceValidationErrorsEnum.Values["error.invalid.subaccount"])
      return setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.subaccount"]);
    removeAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.subaccount"]);

    if (error === AllowanceValidationErrorsEnum.Values["error.invalid.spender.principal"])
      return setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.spender.principal"]);
    removeAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.spender.principal"]);

    if (error === AllowanceValidationErrorsEnum.Values["error.self.allowance"])
      return setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.self.allowance"]);
    removeAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.self.allowance"]);

    if (error === AllowanceValidationErrorsEnum.Values["error.allowance.duplicated"])
      return setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.allowance.duplicated"]);
    removeAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.allowance.duplicated"]);

    if (error === AllowanceValidationErrorsEnum.Values["error.invalid.amount"])
      return setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.amount"]);
    removeAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.amount"]);

    if (error === AllowanceValidationErrorsEnum.Values["error.not.enough.balance"])
      return setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.not.enough.balance"]);
    removeAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.not.enough.balance"]);

    if (error === AllowanceValidationErrorsEnum.Values["error.before.present.expiration"])
      return setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.before.present.expiration"]);
    removeAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.before.present.expiration"]);
  };

  const { mutate, isPending, isError, error, isSuccess } = useMutation({ onSuccess, onError, mutationFn });

  return {
    isLoading,
    setLoading,
    allowance,
    isPending,
    isError,
    error,
    isSuccess,
    createAllowance: throttle(mutate, 1000),
    setAllowanceState,
  };
}
