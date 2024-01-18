import { ScannerOption } from "@/@types/transactions";
import { setScannerActiveOptionAction } from "@redux/transaction/TransactionActions";

export default function ReceiverQRScanner() {
  return (
    <div>
      <p>QR Scanner Receiver</p>
      <button onClick={onGoBack}>Back</button>
    </div>
  );
  function onGoBack() {
    setScannerActiveOptionAction(ScannerOption.none);
  }
}
