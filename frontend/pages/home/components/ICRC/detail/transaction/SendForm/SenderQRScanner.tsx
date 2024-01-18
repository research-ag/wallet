import { ScannerOption } from "@/@types/transactions";
import { setScannerActiveOptionAction } from "@redux/transaction/TransactionActions";

export default function SenderQRScanner() {
  return (
    <div>
      <p>QR Scanner Sender</p>
      <button onClick={onGoBack}>Back</button>
    </div>
  );

  function onGoBack() {
    setScannerActiveOptionAction(ScannerOption.none);
  }
}
