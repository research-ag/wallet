import TransferWrapper from "@pages/home/wrappers/TransferWrapper";
import TransferForm from "./TransferForm";
import { TransferView, useTransferView } from "@pages/home/contexts/TransferViewProvider";
import SenderQRScanner from "./SenderQRScanner";
import ReceiverQRScanner from "./ReceiverQRScanner";

function Transfer() {
  const { view } = useTransferView();

  return (
    <div className="">
      {view === TransferView.SEND_FORM && <TransferForm />}
      {view === TransferView.CONFIRM_DETAIL && <div>Confirm Detail</div>}
      {view === TransferView.SENDER_QR_SCANNER && <SenderQRScanner />}
      {view === TransferView.RECEIVER_QR_SCANNER && <ReceiverQRScanner />}
    </div>
  );
}

export default function Wrapper() {
  return (
    <TransferWrapper>
      <Transfer />
    </TransferWrapper>
  );
}
