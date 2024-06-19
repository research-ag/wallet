// svg
import { ReactComponent as QRScanIcon } from "@assets/svg/files/qr.svg";
//
import { useAppSelector } from "@redux/Store";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { TransferView, useTransferView } from "@pages/home/contexts/TransferViewProvider";
import InputSufixContactBook from "@/pages/home/components/ICRC/transaction/transfer/InputSufixContactBook";
import InputSufixServiceBook from "@/pages/home/components/ICRC/transaction/transfer/InputSufixServiceBook";

export default function ThidInputSufix() {
  const { transferState } = useTransfer();
  const contacts = useAppSelector((state) => state.contacts.contacts);
  const services = useAppSelector((state) => state.services.services);
  const assets = useAppSelector((state) => state.asset.list.assets);

  //
  const hasContactsAccounts = contacts.some((contact) =>
    contact.accounts.some((account) => account.tokenSymbol === transferState.tokenSymbol),
  );

  //
  const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol);

  const hasServicesAssets = services.some((service) =>
    service.assets.some((asset) => {
      return asset.principal === currentAsset?.address;
    }),
  );

  return (
    <div className="relative flex items-center justify-center gap-2">
      {hasServicesAssets && <InputSufixServiceBook />}
      {hasContactsAccounts && <InputSufixContactBook />}
      <InputSufixScanner />
    </div>
  );
}

function InputSufixScanner() {
  const { setView } = useTransferView();
  const { setTransferState } = useTransfer();

  return <QRScanIcon onClick={onReceiverScannerShow} className="cursor-pointer" />;

  function onReceiverScannerShow() {
    setView(TransferView.RECEIVER_QR_SCANNER);
    setTransferState((prev) => ({ ...prev, toPrincipal: "", toSubAccount: "" }));
  }
}
