import { TransactionScannerOptionEnum } from "@/@types/transactions";
import { subUint8ArrayToHex } from "@common/utils/unitArray";
import { decodeIcrcAccount } from "@dfinity/ledger-icrc";
import QRscanner from "@pages/components/QRscanner";
import { setReceiverNewContactAction, setScannerActiveOptionAction } from "@redux/transaction/TransactionActions";
import logger from "@/common/utils/logger";

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
          setReceiverNewContactAction(scannedContact);
        } catch (error) {
          logger.debug(error);
        }
      }}
    />
  );

  function onGoBack() {
    setScannerActiveOptionAction(TransactionScannerOptionEnum.Values.none);
  }
}
