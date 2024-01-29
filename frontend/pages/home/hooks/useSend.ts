import { toFullDecimal } from "@/utils";
import { useAppSelector } from "@redux/Store";
import { useMemo } from "react";
import { checkAllowanceExist } from "../helpers/icrc";

export default function useSend() {
  const { userPrincipal } = useAppSelector((state) => state.auth);
  const { sender, receiver, amount } = useAppSelector((state) => state.transaction);

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

  async function getSenderBalance() {
    try {
      if (sender?.subAccount?.sub_account_id) {
        return toFullDecimal(sender?.subAccount?.amount || "0", Number(sender?.asset?.decimal));
      }

      const principal = getSenderPrincipal();
      const subAccount = getSenderSubAccount();
      const assetAddress = sender?.asset?.address;
      const decimal = sender?.asset?.decimal;

      if (!principal || !subAccount || !assetAddress || !decimal) return;

      const response = await checkAllowanceExist({
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
    if (!sender?.asset?.subAccounts[0]?.transaction_fee) {
      return toFullDecimal("0", Number(0));
    }

    return toFullDecimal(sender.asset.subAccounts[0].transaction_fee, Number(sender.asset.decimal));
  };

  const isSender = useMemo(
    () => Boolean(getSenderPrincipal() && getSenderSubAccount() && sender?.asset?.tokenSymbol),
    [sender],
  );
  const isReceiver = useMemo(() => Boolean(getReceiverPrincipal() && getReceiverSubAccount()), [receiver]);

  function isSenderAllowance() {
    return Boolean(
      sender?.newAllowanceContact?.principal ||
        sender?.allowanceContactSubAccount?.contactPrincipal ||
        !sender?.subAccount?.sub_account_id,
    );
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
    getSenderBalance,
    isSenderAllowance,
    isSenderSameAsReceiver,
    isSenderAllowanceOwn,
    amount,
    enableSend,
    isSender,
    isReceiver,
  };
}
