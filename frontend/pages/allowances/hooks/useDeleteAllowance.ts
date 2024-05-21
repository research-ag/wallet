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
import { createApproveAllowanceParams, submitAllowanceApproval } from "@common/libs/icrcledger/icrcAllowance";
import ICRC1BalanceOf from "@common/libs/icrcledger/ICRC1BalanceOf";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import logger from "@/common/utils/logger";

export default function useDeleteAllowance() {
  const dispatch = useAppDispatch();
  const { selectedAllowance } = useAppSelector((state) => state.allowance);
  const { userAgent, userPrincipal } = useAppSelector((state) => state.auth);
  const { assets } = useAppSelector((state) => state.asset.list);
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

      const amount = await ICRC1BalanceOf({
        canisterId: selectedAllowance.asset.address,
        agent: userAgent,
        owner: userPrincipal,
        subaccount: [hexToUint8Array(selectedAllowance.subAccountId)],
      });

      const balance = amount ? amount.toString() : "0";
      dispatch(updateSubAccountBalance(selectedAllowance.asset.tokenSymbol, selectedAllowance.subAccountId, balance));

      setSelectedAllowanceAction(initialAllowanceState);
      setFullAllowanceErrorsAction([]);
      setIsDeleteAllowanceAction(false);
    } catch (error) {
      logger.debug(error);
      if (error === AllowanceValidationErrorsEnum.Values["error.not.enough.balance"])
        return setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.not.enough.balance"]);
    } finally {
      setIsPending(false);
    }
  }

  return { deleteAllowance, isPending };
}
