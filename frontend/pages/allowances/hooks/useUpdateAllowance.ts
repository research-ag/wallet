import { AllowanceValidationErrorsEnum, TAllowance } from "@/@types/allowance";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import useAllowanceDrawer from "./useAllowanceDrawer";
import { validateUpdateAllowance } from "../helpers/validators";
import { updateSubAccountBalance } from "@redux/assets/AssetReducer";
import {
  removeAllowanceErrorAction,
  setAllowanceErrorAction,
  setFullAllowanceErrorsAction,
  setIsLoadingAllowanceAction,
} from "@redux/allowance/AllowanceActions";
import { Asset } from "@redux/models/AccountModels";
import dayjs from "dayjs";
import { refreshAllowance } from "../helpers/refresh";
// eslint-disable-next-line import/named
import { throttle } from "lodash";
import { removeZeroesFromAmount, toFullDecimal, toHoleBigInt } from "@common/utils/amount";
import { createApproveAllowanceParams, submitAllowanceApproval } from "@common/libs/icrcledger/icrcAllowance";
import ICRC1BalanceOf from "@common/libs/icrcledger/ICRC1BalanceOf";
import { hexToUint8Array } from "@common/utils/hexadecimal";

export function useUpdateAllowance() {
  const dispatch = useAppDispatch();
  const { onCloseUpdateAllowanceDrawer } = useAllowanceDrawer();
  const { allowances } = useAppSelector((state) => state.allowance.list);
  const { userAgent, userPrincipal } = useAppSelector((state) => state.auth);
  const { selectedAllowance } = useAppSelector((state) => state.allowance);
  const { assets } = useAppSelector((state) => state.asset.list);
  const [allowance, setAllowance] = useState<TAllowance>(selectedAllowance);

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

    const fullAllowance: TAllowance = {
      ...allowance,
      amount: removeZeroesFromAmount(allowance.amount || "0"),
    };

    const existingAllowance = allowances.find(
      (currentAllowance) =>
        currentAllowance.spender === fullAllowance.spender &&
        currentAllowance.subAccountId === fullAllowance.subAccountId &&
        currentAllowance.asset.tokenSymbol === fullAllowance.asset.tokenSymbol,
    );

    if (existingAllowance) {
      if (
        !dayjs(fullAllowance.expiration).isSame(dayjs(existingAllowance.expiration)) ||
        fullAllowance.amount !== existingAllowance.amount
      ) {
        await validateUpdateAllowance(fullAllowance, asset);

        const amountWithoutZeros = removeZeroesFromAmount(allowance.amount || "0");
        const amountBigint = toHoleBigInt(amountWithoutZeros, Number(asset.decimal));
        const formattedAmount = toFullDecimal(amountBigint, Number(asset.decimal));

        const formatted = { ...fullAllowance, amount: formattedAmount };

        const params = createApproveAllowanceParams(formatted);
        await submitAllowanceApproval(params, formatted.asset.address);
        await refreshAllowance(formatted);
      }
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
    onCloseUpdateAllowanceDrawer();
  };

  const onError = (error: string) => {
    setIsLoadingAllowanceAction(false);
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
