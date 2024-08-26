import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { AllowanceValidationErrorsEnum, TAllowance } from "@/@types/allowance";
import { submitAllowanceApproval, createApproveAllowanceParams } from "@/common/libs/icrcledger/icrcAllowance";
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
import ICRC1BalanceOf from "@common/libs/icrcledger/ICRC1BalanceOf";
import { hexToUint8Array } from "@common/utils/hexadecimal";

export enum CreateResult {
  SUCCESS = "success",
  ERROR = "error",
}

export default function useCreateAllowance() {
  const [result, setResult] = useState<CreateResult | null>(null);
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);
  const { assets } = useAppSelector((state) => state.asset.list);
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset.helper);
  const { isFromService, selectedAllowance } = useAppSelector((state) => state.allowance);
  const { userAgent, userPrincipal } = useAppSelector((state) => state.auth);

  const initial = useMemo(() => {
    const supported = selectedAsset?.supportedStandards?.includes(SupportedStandardEnum.Values["ICRC-2"]);

    if (!supported) return initialAllowanceState;
    if (!selectedAsset) return initialAllowanceState;

    const asset = getAllowanceAsset(selectedAsset);

    if (isFromService) {
      return {
        ...initialAllowanceState,
        asset: supported ? asset : initialAllowanceState.asset,
        subAccountId: "0x0",
        spender: selectedAllowance.spender,
        spenderSubaccount: selectedAllowance.spenderSubaccount,
      };
    }

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
    setResult(null);
    setFullAllowanceErrorsAction([]);

    const asset = assets.find((asset) => asset.tokenSymbol === allowance.asset.tokenSymbol) as Asset;

    const fullAllowance = {
      ...allowance,
      id: db().generateAllowancePrimaryKey(allowance),
      amount: removeZeroesFromAmount(allowance.amount || "0"),
    };

    await validateCreateAllowance(fullAllowance, asset);

    const amountWithoutZeros = removeZeroesFromAmount(allowance.amount || "0");
    const amountBigint = toHoleBigInt(amountWithoutZeros, Number(asset.decimal));
    const formattedAmount = toFullDecimal(amountBigint, Number(asset.decimal));
    const formatted = { ...fullAllowance, amount: formattedAmount };
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

    const amount = await ICRC1BalanceOf({
      canisterId: allowance.asset.address,
      agent: userAgent,
      owner: userPrincipal,
      subaccount: [hexToUint8Array(allowance.subAccountId)],
    });

    const balance = amount ? amount.toString() : "0";
    dispatch(updateSubAccountBalance(allowance.asset.tokenSymbol, allowance.subAccountId, balance));
    setResult(CreateResult.SUCCESS);
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

    if (error === AllowanceValidationErrorsEnum.Values["error.invalid.spender.beneficiary"])
      return setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.spender.beneficiary"]);
    removeAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.spender.beneficiary"]);

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

    setResult(CreateResult.ERROR);
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
    result,
    setResult,
  };
}
