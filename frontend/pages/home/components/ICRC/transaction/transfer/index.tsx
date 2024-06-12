import TransferWrapper from "@pages/home/wrappers/TransferWrapper";
import { useState } from "react";
import TransferForm from "./TransferForm";

interface TransferProps { }

enum TransferView {
  SEND_FORM,
  CONFIRM_DETAIL,
  SENDER_QR_SCANNER,
  RECEIVER_QR_SCANNER,
}

function Transfer(props: TransferProps) {
  const [view, setView] = useState<TransferView>(TransferView.SEND_FORM);

  return (
    // <div className="scroll-y-light">
    <div className="">
      {view === TransferView.SEND_FORM && <TransferForm />}
      {view === TransferView.CONFIRM_DETAIL && <div>Confirm Detail</div>}
      {view === TransferView.SENDER_QR_SCANNER && <div>Sender QR Scanner</div>}
      {view === TransferView.RECEIVER_QR_SCANNER && <div>Receiver QR Scanner</div>}
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
