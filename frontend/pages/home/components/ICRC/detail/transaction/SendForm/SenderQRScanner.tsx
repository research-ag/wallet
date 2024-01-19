import { ScannerOption } from "@/@types/transactions";
import QRscanner from "@pages/components/QRscanner";
import { setScannerActiveOptionAction, setSenderICRCScannerContactAction } from "@redux/transaction/TransactionActions";

export default function SenderQRScanner() {
  return (
    <QRscanner
      setQRview={onGoBack}
      qrView={true}
      onSuccess={(value: string) => {
        setSenderICRCScannerContactAction(value);
        // onGoBack();
        //   navigator.clipboard.writeText(value);
      }}
    />
  );

  function onGoBack() {
    setScannerActiveOptionAction(ScannerOption.none);
  }
}
