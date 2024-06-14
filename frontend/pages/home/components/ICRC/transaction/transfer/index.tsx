import TransferWrapper from "@pages/home/wrappers/TransferWrapper";
import TransferForm from "./TransferForm";
import { TransferView, useTransferView } from "@pages/home/contexts/TransferViewProvider";
import ReceiverQRScanner from "./ReceiverQRScanner";
import TransferDetailsConfirmation from "./TransferDetailsConfirmation";
import SenderAllowanceQRScanner from "./SenderAllowanceQRScanner";

function Transfer() {
  const { view } = useTransferView();

  return (
    <div className="">
      {view === TransferView.SEND_FORM && <TransferForm />}
      {view === TransferView.CONFIRM_DETAIL && <TransferDetailsConfirmation />}
      {view === TransferView.SENDER_QR_SCANNER && <SenderAllowanceQRScanner />}
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
