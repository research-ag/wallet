import { toFullDecimal } from "@/utils";
import { useAppSelector } from "@redux/Store";
import { useMemo } from "react";
import { getAllowanceDetails } from "../helpers/icrc";
import { TransactionSenderOptionEnum } from "@/@types/transactions";
import { validatePrincipal } from "@/utils/identity";
import { isHexadecimalValid } from "@/utils/checkers";

export default function useSend() {
  const { userPrincipal } = useAppSelector((state) => state.auth);
  const { assets } = useAppSelector((state) => state.asset);
  const { sender, receiver, amount, sendingStatus, errors, initTime, endTime } = useAppSelector(
    (state) => state.transaction,
  );

  const updateAsset = useMemo(
    () => assets.find((asset) => asset.tokenSymbol === sender.asset.tokenSymbol),
    [assets, sender],
  );

  const updateSubAccount = useMemo(
    () => updateAsset?.subAccounts.find((subAccount) => subAccount.sub_account_id === sender.subAccount.sub_account_id),
    [updateAsset, sender],
  );

  function getReceiverPrincipal() {
    if (receiver?.thirdContactSubAccount?.contactPrincipal) return receiver?.thirdContactSubAccount?.contactPrincipal;
    if (receiver?.thirdNewContact?.principal) return receiver?.thirdNewContact?.principal;
    if (receiver?.ownSubAccount?.sub_account_id) return userPrincipal.toText();
    return "";
  }

  function getReceiverSubAccount() {
    if (receiver?.thirdContactSubAccount?.subAccountId) return receiver?.thirdContactSubAccount?.subAccountId;
    if (receiver?.thirdNewContact?.subAccountId) return receiver?.thirdNewContact?.subAccountId;
    if (receiver?.ownSubAccount?.sub_account_id) return receiver?.ownSubAccount?.sub_account_id;
    return "";
  }

  function getSenderPrincipal() {
    if (sender?.newAllowanceContact?.principal) return sender?.newAllowanceContact?.principal;
    if (sender?.allowanceContactSubAccount?.contactPrincipal)
      return sender?.allowanceContactSubAccount?.contactPrincipal;
    if (sender?.subAccount?.sub_account_id) return userPrincipal.toText();
    return "";
  }

  function getSenderSubAccount() {
    if (sender?.newAllowanceContact?.subAccountId) return sender?.newAllowanceContact?.subAccountId;
    if (sender?.allowanceContactSubAccount?.subAccountId) return sender?.allowanceContactSubAccount?.subAccountId;
    if (sender?.subAccount?.sub_account_id) return sender?.subAccount?.sub_account_id;
    return "";
  }

  function getSenderValid(): boolean {
    const principal = getSenderPrincipal();
    if (!validatePrincipal(principal)) return false;

    const subaccount = getSenderSubAccount();
    if (!isHexadecimalValid(subaccount)) return false;

    return true;
  }

  function getReceiverValid(): boolean {
    const principal = getReceiverPrincipal();
    if (!validatePrincipal(principal)) return false;

    const subaccount = getReceiverSubAccount();
    if (!isHexadecimalValid(subaccount)) return false;

    return true;
  }

  async function getSenderBalance() {
    try {
      if (sender?.senderOption === TransactionSenderOptionEnum.Values.own) {
        return toFullDecimal(updateSubAccount?.amount || "0", Number(updateAsset?.decimal));
      }

      const principal = getSenderPrincipal();
      const subAccount = getSenderSubAccount();
      const assetAddress = sender?.asset?.address;
      const decimal = sender?.asset?.decimal;

      const response = await getAllowanceDetails({
        spenderSubaccount: subAccount,
        accountPrincipal: principal,
        assetAddress,
        assetDecimal: decimal,
      });

      return response?.allowance || "0";
    } catch (error) {
      console.log(error);
    }
  }

  const getTransactionFee = () => {
    if (!updateSubAccount?.transaction_fee) {
      return toFullDecimal("0", Number(0));
    }
    return toFullDecimal(updateSubAccount.transaction_fee, Number(updateAsset?.decimal));
  };

  const isSender = useMemo(
    () => Boolean(getSenderPrincipal() && getSenderSubAccount() && sender?.asset?.tokenSymbol),
    [sender],
  );
  const isReceiver = useMemo(() => Boolean(getReceiverPrincipal() && getReceiverSubAccount()), [receiver]);

  function isSenderAllowance() {
    return sender?.senderOption === TransactionSenderOptionEnum.Values.allowance;
  }

  function isSenderSameAsReceiver() {
    const senderPrincipal = getSenderPrincipal();
    const senderSubAccount = getSenderSubAccount();
    const receiverPrincipal = getReceiverPrincipal();
    const receiverSubAccount = getReceiverSubAccount();
    return senderPrincipal === receiverPrincipal && senderSubAccount === receiverSubAccount;
  }

  function isSenderAllowanceOwn() {
    const senderPrincipal = getSenderPrincipal();
    const ownerPrincipal = userPrincipal.toText();
    const isAllowance = isSenderAllowance();
    return senderPrincipal === ownerPrincipal && isAllowance;
  }

  const enableSend = useMemo(
    () =>
      Boolean(
        sender?.asset?.address &&
          sender?.asset?.decimal &&
          amount &&
          getSenderSubAccount() &&
          getSenderPrincipal() &&
          getReceiverPrincipal() &&
          getReceiverSubAccount(),
      ),
    [sender, receiver, amount],
  );

  return {
    receiverPrincipal: getReceiverPrincipal(),
    receiverSubAccount: getReceiverSubAccount(),
    senderPrincipal: getSenderPrincipal(),
    senderSubAccount: getSenderSubAccount(),
    transactionFee: getTransactionFee(),
    isSenderValid: getSenderValid(),
    isReceiverValid: getReceiverValid(),
    getSenderBalance,
    isSenderAllowance,
    isSenderSameAsReceiver,
    isSenderAllowanceOwn,
    sender,
    amount,
    enableSend,
    isSender,
    isReceiver,
    sendingStatus,
    errors,
    initTime,
    endTime,
  };
}
