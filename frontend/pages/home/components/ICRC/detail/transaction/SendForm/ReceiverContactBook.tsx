import { CustomInput } from "@components/Input";
import { ReactComponent as SearchIcon } from "@assets/svg/files/icon-search.svg";
import { ReactComponent as QRIcon } from "@assets/svg/files/qr.svg";
import { ReactComponent as SendUserIcon } from "@assets/svg/files/send-user-icon.svg";
import { useAppSelector } from "@redux/Store";
import { useMemo } from "react";
import { ContactSubAccount, SenderState, SetReceiverThirdContactSubAccount } from "@/@types/transactions";

interface ReceiverContactBookProps {
  sender: SenderState;
  setReceiverThirdContactSubAccount: SetReceiverThirdContactSubAccount;
}

export default function ReceiverContactBook(props: ReceiverContactBookProps) {
  const { sender, setReceiverThirdContactSubAccount } = props;
  return (
    <CustomInput
      prefix={<SearchIcon className="mx-2" />}
      sufix={<ContactSuffix sender={sender} setReceiverThirdContactSubAccount={setReceiverThirdContactSubAccount} />}
    />
  );
}

function ContactSuffix(props: ReceiverContactBookProps) {
  const { sender, setReceiverThirdContactSubAccount } = props;
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

  function onSelectContact() {}

  return (
    <div className="flex flex-row items-center justify-center gap-2 mx-2">
      <SendUserIcon className="cursor-pointer" />
      <QRIcon onClick={() => console.log("Change to qr view")} />
    </div>
  );
}
