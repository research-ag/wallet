import TransferWrapper from "@pages/home/wrappers/TransferWrapper";
import TransferForm from "@/pages/home/components/ICRC/transaction/transfer/TransferForm";
import { TransferView, useTransferView } from "@pages/home/contexts/TransferViewProvider";
import ReceiverQRScanner from "@/pages/home/components/ICRC/transaction/transfer/ReceiverQRScanner";
import TransferDetailsConfirmation from "@/pages/home/components/ICRC/transaction/transfer/TransferDetailsConfirmation";
import SenderAllowanceQRScanner from "@/pages/home/components/ICRC/transaction/transfer/SenderAllowanceQRScanner";
import TransferStatusModal from "@/pages/home/components/ICRC/transaction/transfer/TransferStatusModal";

function Transfer() {
  const { view } = useTransferView();

  return (
    <div>
      {view === TransferView.SEND_FORM && <TransferForm />}
      {view === TransferView.CONFIRM_DETAIL && <TransferDetailsConfirmation />}
      {view === TransferView.SENDER_QR_SCANNER && <SenderAllowanceQRScanner />}
      {view === TransferView.RECEIVER_QR_SCANNER && <ReceiverQRScanner />}
      <TransferStatusModal />
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
