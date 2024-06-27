import { subUint8ArrayToHex } from "@common/utils/unitArray";
import { decodeIcrcAccount } from "@dfinity/ledger-icrc";
import QRscanner from "@pages/components/QRscanner";
import logger from "@/common/utils/logger";
import { TransferView, useTransferView } from "@pages/home/contexts/TransferViewProvider";
import { TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";

export default function ReceiverQRScanner() {
  const { setView } = useTransferView();
  const { setTransferState } = useTransfer();

  return (
    <div className="w-[22rem] mx-auto mt-[2rem]">

    <QRscanner
      setQRview={onGoBack}
      qrView={true}
      onSuccess={(value: string) => {
        try {
          const decoded = decodeIcrcAccount(value);
          const toPrincipal = decoded.owner.toText();
          const toSubAccount = `0x${subUint8ArrayToHex(decoded.subaccount)}`;

          setTransferState((prev) => ({
            ...prev,
            toPrincipal,
            toSubAccount,
            toType: TransferToTypeEnum.thidPartyScanner,
          }));

          onGoBack();
        } catch (error) {
          logger.debug(error);
        }
      }}
    />
    </div>
  );

  function onGoBack() {
    setView(TransferView.SEND_FORM);
  }
}
