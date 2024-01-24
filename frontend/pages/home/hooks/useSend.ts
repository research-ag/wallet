import { toFullDecimal } from "@/utils";
import { useAppSelector } from "@redux/Store";
import { useMemo } from "react";

export default function useSend() {
  const { userPrincipal } = useAppSelector((state) => state.auth);
  const { sender, receiver, amount } = useAppSelector((state) => state.transaction);

  function getReceiverPrincipal() {
    if (receiver?.thirdContactSubAccount?.contactPrincipal) return receiver?.thirdContactSubAccount?.contactPrincipal;
    if (receiver?.thirdNewContact?.principal) return receiver?.thirdNewContact?.principal;
    if (receiver?.ownSubAccount?.sub_account_id) return receiver?.ownSubAccount?.sub_account_id;
    return "";
  }

  function getReceiverSubAccount() {
    if (receiver?.thirdContactSubAccount?.subAccountId) return receiver?.thirdContactSubAccount?.subAccountId;
    if (receiver?.thirdNewContact?.subAccountId) return receiver?.thirdNewContact?.subAccountId;
    if (receiver?.ownSubAccount?.sub_account_id) return receiver?.ownSubAccount?.sub_account_id;
    return "";
  }

  function getAmount() {
    return amount ? toFullDecimal(amount, Number(sender?.asset?.decimal) || 0) : "";
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

  const isSender = useMemo(
    () => Boolean(getSenderPrincipal() && getSenderSubAccount() && sender?.asset?.tokenSymbol),
    [sender],
  );
  const isReceiver = useMemo(() => Boolean(getReceiverPrincipal() && getReceiverSubAccount()), [receiver]);

  const enableSend = useMemo(
    () =>
      Boolean(
        sender?.asset?.address &&
          sender?.asset?.decimal &&
          getSenderSubAccount() &&
          getSenderPrincipal() &&
          getAmount() &&
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
    amount: getAmount(),
    enableSend,
    isSender,
    isReceiver,
  };
}
