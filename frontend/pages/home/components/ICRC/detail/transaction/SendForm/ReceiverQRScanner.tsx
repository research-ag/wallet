import { ScannerOption } from "@/@types/transactions";
import { subUint8ArrayToHex } from "@/utils";
import { decodeIcrcAccount } from "@dfinity/ledger";
import QRscanner from "@pages/components/QRscanner";
import { setScannerActiveOptionAction } from "@redux/transaction/TransactionActions";

export default function ReceiverQRScanner() {
  return (
    <QRscanner
      setQRview={onGoBack}
      qrView={true}
      onSuccess={(value: string) => {
        try {
          const decoded = decodeIcrcAccount(value);
          const scannedContact = {
            principal: decoded.owner.toText(),
            subAccountId: `0x${subUint8ArrayToHex(decoded.subaccount)}`,
          };

          onGoBack();
          // TODO: what is used for the clipboard
          //   navigator.clipboard.writeText(value);
        } catch (error) {
          console.error(error);
        }
      }}
    />
  );

  function onGoBack() {
    setScannerActiveOptionAction(ScannerOption.none);
  }
}
