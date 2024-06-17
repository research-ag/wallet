import { useTransfer } from "@/pages/home/contexts/TransferProvider";

export default function useReceiver() {
  const { transferState } = useTransfer();
  // consts
  const toType = transferState.toType;
  const isToFilled = transferState.toPrincipal.length > 0 && transferState.toSubAccount.length > 0;
  //

  return {
    toType,
    isToFilled,
  };
}
