import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { AllowanceValidationErrorsEnum, TAllowance } from "@/@types/allowance";
import { submitAllowanceApproval, createApproveAllowanceParams, getSubAccountBalance } from "@/common/libs/icrc";
import useAllowanceDrawer from "./useAllowanceDrawer";
// eslint-disable-next-line import/named
import { throttle } from "lodash";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { initialAllowanceState } from "@redux/allowance/AllowanceReducer";
import { getDuplicatedAllowance, validateCreateAllowance } from "../helpers/validators";
import { SupportedStandardEnum } from "@/@types/icrc";
import { updateSubAccountBalance } from "@redux/assets/AssetReducer";
import {
  removeAllowanceErrorAction,
  setAllowanceErrorAction,
  setFullAllowanceErrorsAction,
  setIsLoadingAllowanceAction,
} from "@redux/allowance/AllowanceActions";
import { Asset } from "@redux/models/AccountModels";
import { getAllowanceAsset } from "../helpers/mappers";
import { refreshAllowance } from "../helpers/refresh";
import { db } from "@/database/db";
import { removeZeroesFromAmount, toFullDecimal, toHoleBigInt } from "@common/utils/amount";

export default function useCreateAllowance() {
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);
  const { onCloseCreateAllowanceDrawer } = useAllowanceDrawer();
  const { assets } = useAppSelector(({ asset }) => asset);
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset.helper);

  const initial = useMemo(() => {
    const supported = selectedAsset?.supportedStandards?.includes(SupportedStandardEnum.Values["ICRC-2"]);

    if (!supported) return initialAllowanceState;
    if (!selectedAsset) return initialAllowanceState;

    const asset = getAllowanceAsset(selectedAsset);

    return {
      ...initialAllowanceState,
      asset: supported ? asset : initialAllowanceState.asset,
      subAccountId: selectedAccount?.sub_account_id || "",
    };
  }, [selectedAsset]);

  const [allowance, setAllowance] = useState<TAllowance>(initial);
  const setAllowanceState = (allowanceData: Partial<TAllowance>) => {
    setAllowance({
      ...allowance,
      ...allowanceData,
    });
  };

  const mutationFn = useCallback(async () => {
    setIsLoadingAllowanceAction(true);
    setFullAllowanceErrorsAction([]);

    const asset = assets.find((asset) => asset.tokenSymbol === allowance.asset.tokenSymbol) as Asset;

    const fullAllowance = {
      ...allowance,
      id: db().generateAllowancePrimaryKey(allowance),
      amount: removeZeroesFromAmount(allowance.amount || "0"),
    };

    validateCreateAllowance(fullAllowance, asset);

    const amountWithoutZeros = removeZeroesFromAmount(allowance.amount || "0");
    const amountBigint = toHoleBigInt(amountWithoutZeros, Number(asset.decimal));
    const formattedAmount = toFullDecimal(amountBigint, Number(asset.decimal));

    const formatted = { ...fullAllowance, amount: formattedAmount };

    const params = createApproveAllowanceParams(formatted);
    await submitAllowanceApproval(params, formatted.asset.address);
    await refreshAllowance(formatted);

    const duplicated = await getDuplicatedAllowance(formatted);

    if (duplicated) {
      const isExpirationSame = formatted.expiration === duplicated.expiration;
      const isAmountSame = formatted.amount === duplicated.amount;

      if (!isExpirationSame || !isAmountSame) {
        const params = createApproveAllowanceParams(formatted);
        await submitAllowanceApproval(params, formatted.asset.address);
        await refreshAllowance(formatted);
      }
    } else {
      const params = createApproveAllowanceParams(formatted);
      await submitAllowanceApproval(params, formatted.asset.address);
      await refreshAllowance(formatted);
    }
  }, [allowance]);

  const onSuccess = async () => {
    setIsLoadingAllowanceAction(false);
    const refreshParams = {
      subAccount: allowance.subAccountId,
      assetAddress: allowance.asset.address,
    };
    const amount = await getSubAccountBalance(refreshParams);
    const balance = amount ? amount.toString() : "0";
    dispatch(updateSubAccountBalance(allowance.asset.tokenSymbol, allowance.subAccountId, balance));
    onCloseCreateAllowanceDrawer();
  };

  const onError = (error: string) => {
    setIsLoadingAllowanceAction(false);
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
