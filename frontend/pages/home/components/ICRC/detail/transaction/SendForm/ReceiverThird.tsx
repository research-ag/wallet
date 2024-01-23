import { useAppSelector } from "@redux/Store";
import ReceiverContactBook from "./ReceiverContactBook";
import ReceiverManual from "./ReceiverManual";
import { Select } from "@components/select";
import { useMemo, useState } from "react";
import { ContactSubAccount } from "@/@types/transactions";
import { AvatarEmpty } from "@components/avatar";
import { SelectOption } from "@/@types/components";
import { setReceiverContactAction } from "@redux/transaction/TransactionActions";

export default function ReceiverThird() {
  const { receiver } = useAppSelector((state) => state.transaction);
  if (receiver?.thirdContactSubAccount?.subAccountId) return <ContactBookReceiver />;
  if (receiver.isManual) return <ReceiverManual />;
  return <ReceiverContactBook />;
}

function ContactBookReceiver() {
  const [searchSubAccountValue, setSearchSubAccountValue] = useState<string | null>(null);
  const { sender, receiver } = useAppSelector((state) => state.transaction);
  const { contacts } = useAppSelector((state) => state.contacts);

  const filteredContacts: ContactSubAccount[] = useMemo(() => {
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

  const formattedContacts = useMemo(() => {
    if (!searchSubAccountValue) return filteredContacts.map(formatContact);
    return filteredContacts
      .filter((contact) => {
        return (
          contact.contactName.includes(searchSubAccountValue) || contact.subAccountName.includes(searchSubAccountValue)
        );
      })
      .map(formatContact);
  }, [filteredContacts, searchSubAccountValue]);

  // TODO: show error on no selected allowance
  return (
    <Select
      onSelect={onSelect}
      options={formattedContacts}
      initialValue={receiver?.thirdContactSubAccount?.subAccountId}
      currentValue={receiver?.thirdContactSubAccount?.subAccountId}
      //   disabled={isLoading}
      //   border={error ? "error" : undefined}
      onSearch={onSearchChange}
      onOpenChange={onOpenChange}
    />
  );

  function formatContact(contact: ContactSubAccount) {
    return {
      value: contact.subAccountId,
      label: `${contact.contactName} [${contact.subAccountName}]`,
      subLabel: contact.subAccountId,
      icon: <AvatarEmpty title={contact.contactName} size="medium" className="mr-4" />,
    };
  }
  function onSelect(option: SelectOption) {
    setSearchSubAccountValue(null);
    const fullContact = filteredContacts?.find((contact) => contact.subAccountId === option.value);
    if (fullContact) setReceiverContactAction(fullContact);
  }
  function onSearchChange(searchValue: string) {
    setSearchSubAccountValue(searchValue);
  }
  function onOpenChange() {
    setSearchSubAccountValue(null);
  }
}
