import { useEffect } from "react";
import TransferForm from "@/pages/home/components/ICRC/transaction/transfer/TransferForm";
import TransferViewProvider, { TransferView, useTransferView } from "@pages/home/contexts/TransferViewProvider";
import ReceiverQRScanner from "@/pages/home/components/ICRC/transaction/transfer/ReceiverQRScanner";
import TransferDetailsConfirmation from "@/pages/home/components/ICRC/transaction/transfer/TransferDetailsConfirmation";
import SenderAllowanceQRScanner from "@/pages/home/components/ICRC/transaction/transfer/SenderAllowanceQRScanner";
import TransferStatusModal from "@/pages/home/components/ICRC/transaction/transfer/TransferStatusModal";
import { useAppSelector } from "@redux/Store";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import logger from "@/common/utils/logger";
import TransferStatusProvider from "@pages/home/contexts/TransferStatusProvider";

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
  const { userPrincipal } = useAppSelector((state) => state.auth);
  const { selectedAccount, selectedAsset } = useAppSelector((state) => state.asset.helper);
  const { setTransferState, transferState } = useTransfer();

  useEffect(() => {
    if (!selectedAccount || !selectedAsset) {
      logger.debug("TransferIntializer: selectedAccount or selectedAsset is null");
      return;
    }

    const isSenderEmpty = transferState.fromPrincipal === "";
    const isReceiverEmpty = transferState.toPrincipal === "";

    if (isSenderEmpty && isReceiverEmpty) {
      setTransferState((prev) => ({
        ...prev,
        tokenSymbol: selectedAsset.tokenSymbol,
        fromSubAccount: selectedAccount.sub_account_id,
        fromPrincipal: userPrincipal.toString(),
      }));
    }
  }, []);

  return (
    <TransferStatusProvider>
      <TransferViewProvider>
        <Transfer />
      </TransferViewProvider>
    </TransferStatusProvider>
  );
}
