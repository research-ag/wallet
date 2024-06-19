// svg
import { ReactComponent as QRScanIcon } from "@assets/svg/files/qr.svg";
//
import { useAppSelector } from "@redux/Store";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { TransferView, useTransferView } from "@pages/home/contexts/TransferViewProvider";
import InputSufixContactBook from "@/pages/home/components/ICRC/transaction/transfer/InputSufixContactBook";
import InputSufixServiceBook from "@/pages/home/components/ICRC/transaction/transfer/InputSufixServiceBook";
import { useMemo } from "react";
import { ContactAccount } from "@redux/models/ContactsModels";
import { ServiceAsset } from "@redux/models/ServiceModels";

export default function ThidInputSufix() {
  const contacts = useAppSelector((state) => state.contacts.contacts);
  const services = useAppSelector((state) => state.services.services);
  const { transferState } = useTransfer();

  const hasContactsAccounts = useMemo(() => {
    const assetAccounts: ContactAccount[] = [];
    contacts.map((contact) => {
      const accounts = contact.accounts.filter((account) => account.tokenSymbol === transferState.tokenSymbol);

      assetAccounts.push(...accounts);
    });
    if (assetAccounts.length > 0) return true;
    else return false;
  }, [transferState.tokenSymbol]);

  const hasServicesAssets = useMemo(() => {
    const assetAccounts: ServiceAsset[] = [];
    services.map((service) => {
      const accounts = service.assets.filter(
        (account) => account.tokenSymbol === transferState.tokenSymbol && account.visible,
      );

      assetAccounts.push(...accounts);
    });
    if (assetAccounts.length > 0) return true;
    else return false;
  }, [transferState.tokenSymbol]);

  //
  const hasContacts = contacts.length > 0;
  const displayContact = hasContacts && hasContactsAccounts;

  //
  const hasServices = services.length > 0;
  const displayService = hasServices && hasServicesAssets;

  return (
    <div className="relative flex items-center justify-center gap-2">
      {displayService && <InputSufixServiceBook hasContacts={displayContact} />}
      {displayContact && <InputSufixContactBook />}
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
