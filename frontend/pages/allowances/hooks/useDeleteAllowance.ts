import { submitAllowanceApproval, createApproveAllowanceParams, getSubAccountBalance } from "@/pages/home/helpers/icrc";
import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { updateSubAccountBalance } from "@redux/assets/AssetReducer";
import {
  setAllowanceErrorAction,
  setFullAllowanceErrorsAction,
  setIsDeleteAllowanceAction,
  setSelectedAllowanceAction,
} from "@redux/allowance/AllowanceActions";
import { AllowanceValidationErrorsEnum } from "@/@types/allowance";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { refreshAllowance } from "../helpers/refresh";
import { initialAllowanceState } from "@redux/allowance/AllowanceReducer";

export default function useDeleteAllowance() {
  const dispatch = useAppDispatch();
  const { selectedAllowance } = useAppSelector((state) => state.allowance);
  const { assets } = useAppSelector((state) => state.asset);
  const [isPending, setIsPending] = useState(false);

  const asset = useMemo(() => {
    return assets.find((asset) => asset.tokenSymbol === selectedAllowance?.asset.tokenSymbol);
  }, [selectedAllowance, assets]) as Asset;

  async function deleteAllowance() {
    try {
      setIsPending(true);
      const subAccount = asset.subAccounts.find(
        (subAccount) => subAccount.sub_account_id === selectedAllowance.subAccountId,
      ) as SubAccount;

      const bigintFee = BigInt(subAccount.transaction_fee);
      const bigintAmount = BigInt(subAccount.amount);
      if (bigintFee > bigintAmount) throw AllowanceValidationErrorsEnum.Values["error.not.enough.balance"];

      const params = createApproveAllowanceParams({ ...selectedAllowance, amount: "0", expiration: undefined });
      await submitAllowanceApproval(params, selectedAllowance.asset.address);
      await refreshAllowance(selectedAllowance, true);

      const refreshParams = {
        subAccount: selectedAllowance.subAccountId,
        assetAddress: selectedAllowance.asset.address,
      };
      const amount = await getSubAccountBalance(refreshParams);
      const balance = amount ? amount.toString() : "0";
      dispatch(updateSubAccountBalance(selectedAllowance.asset.tokenSymbol, selectedAllowance.subAccountId, balance));

      setSelectedAllowanceAction(initialAllowanceState);
      setFullAllowanceErrorsAction([]);
      setIsDeleteAllowanceAction(false);
    } catch (error) {
      console.log(error);
      if (error === AllowanceValidationErrorsEnum.Values["error.not.enough.balance"])
        return setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.not.enough.balance"]);
    } finally {
      setIsPending(false);
    }
  }

  return { deleteAllowance, isPending };
}
