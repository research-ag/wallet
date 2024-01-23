import { ContactSubAccount, ScannerOption } from "@/@types/transactions";
import { ReactComponent as QRScanIcon } from "@assets/svg/files/qr.svg";
import { ReactComponent as SendUserIcon } from "@assets/svg/files/send-user-icon.svg";
import { useAppSelector } from "@redux/Store";
import { setScannerActiveOptionAction } from "@redux/transaction/TransactionActions";
import { useMemo } from "react";

export default function ContactSuffix() {
  const { sender } = useAppSelector((state) => state.transaction);
  const { contacts } = useAppSelector((state) => state.contacts);

  const filteredContacts = useMemo(() => {
    if (!contacts || !contacts.length) return [];
    const allowanceContacts: ContactSubAccount[] = [];

    for (let contactIndex = 0; contactIndex < contacts.length; contactIndex++) {
      const currentContact = contacts[contactIndex];

      const currentContactAsset = currentContact?.assets?.find(
        (asset) => asset?.tokenSymbol === sender?.asset?.tokenSymbol,
      );

      currentContactAsset?.subaccounts?.forEach((subAccount) => {
        const receiverContact = {
          contactName: currentContact.name,
          contactPrincipal: currentContact.principal,
          contactAccountIdentifier: currentContact.accountIdentier,
          assetLogo: currentContactAsset?.logo,
          assetSymbol: currentContactAsset?.symbol,
          assetTokenSymbol: currentContactAsset?.tokenSymbol,
          assetAddress: currentContactAsset?.address,
          assetDecimal: currentContactAsset?.decimal,
          assetShortDecimal: currentContactAsset?.shortDecimal,
          assetName: currentContactAsset?.symbol,
          subAccountIndex: subAccount?.subaccount_index,
          subAccountId: subAccount?.sub_account_id,
          subAccountAllowance: subAccount?.allowance,
          subAccountName: subAccount?.name,
        };

        allowanceContacts.push(receiverContact);
      });
    }

    return allowanceContacts;
  }, [sender, contacts]);

  // function onSelectContact() {}

  return (
    <div className="flex flex-row items-center justify-center gap-2 mx-2">
      <SendUserIcon className="cursor-pointer" />
      <QRScanIcon onClick={onSenderScannerShow} className="cursor-pointer" />
    </div>
  );

  function onSenderScannerShow() {
    setScannerActiveOptionAction(ScannerOption.receiver);
  }
}
