import { ScannerOption } from "@/@types/transactions";
import QRscanner from "@pages/components/QRscanner";
import { setReceiverICRCScannerContactAction, setScannerActiveOptionAction } from "@redux/transaction/TransactionActions";

export default function ReceiverQRScanner() {
  return (
    <QRscanner
      setQRview={onGoBack}
      qrView={true}
      onSuccess={(value: string) => {
        setReceiverICRCScannerContactAction(value);
          // onGoBack();
        //   navigator.clipboard.writeText(value);
      }}
    />

    //   {/* <button onClick={onGoBack}>Back</button> */}
  );
  function onGoBack() {
    setScannerActiveOptionAction(ScannerOption.none);
  }
}
