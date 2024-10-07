import { decodeIcrcAccount } from "@dfinity/ledger-icrc";
import QRscanner from "@pages/components/QRscanner";
import logger from "@/common/utils/logger";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { TransferView, useTransferView } from "@pages/home/contexts/TransferViewProvider";

export default function SenderAllowanceQRScanner() {
  const { setView } = useTransferView();
  const { setTransferState } = useTransfer();

  return (
    <div className="w-[22rem] mx-auto mt-[2rem]">
      <QRscanner
        setQRview={onGoBack}
        qrView={true}
        onSuccess={(value: string) => {
          try {
            decodeIcrcAccount(value);

            setTransferState((prev) => ({
              ...prev,
              fromPrincipal: value,
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
