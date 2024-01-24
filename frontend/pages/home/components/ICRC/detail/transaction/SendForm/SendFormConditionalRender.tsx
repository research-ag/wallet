import useSend from "@pages/home/hooks/useSend";
import { useAppSelector } from "@redux/Store";
import { Dispatch, SetStateAction, useMemo } from "react";
import ConfirmDetail from "./ConfirmDetail";
import { TransactionScannerOptionEnum } from "@/@types/transactions";
import SenderQRScanner from "./SenderQRScanner";
import ReceiverQRScanner from "./ReceiverQRScanner";

interface SendFormConditionalRenderProps {
  showConfirmationModal: Dispatch<SetStateAction<boolean>>;
  children: JSX.Element;
}

export default function SendFormConditionalRender({ children, showConfirmationModal }: SendFormConditionalRenderProps) {
  const { isSender, isReceiver } = useSend();
  const { scannerActiveOption, isInspectTransference } = useAppSelector((state) => state.transaction);

  const showInspectDetail = useMemo(
    () => isInspectTransference && isSender && isReceiver,
    [isInspectTransference, isSender, isReceiver],
  );

  if (showInspectDetail) return <ConfirmDetail showConfirmationModal={showConfirmationModal} />;
  if (scannerActiveOption == TransactionScannerOptionEnum.Values.sender) return <SenderQRScanner />;
  if (scannerActiveOption == TransactionScannerOptionEnum.Values.receiver) return <ReceiverQRScanner />;

  return children;
}
