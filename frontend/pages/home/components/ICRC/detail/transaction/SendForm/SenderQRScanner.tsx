import { ScannerOption } from "@/@types/transactions";
import QRscanner from "@pages/components/QRscanner";
import { setScannerActiveOptionAction } from "@redux/transaction/TransactionActions";

export default function SenderQRScanner() {
  return (
    <QRscanner
      setQRview={onGoBack}
      qrView={true}
      onSuccess={(value: string) => {
        console.log(value);
        //   setNewAccount(value);
        //   onGoBack();
        //   navigator.clipboard.writeText(value);
      }}
    />
  );

  function onGoBack() {
    setScannerActiveOptionAction(ScannerOption.none);
  }
}
