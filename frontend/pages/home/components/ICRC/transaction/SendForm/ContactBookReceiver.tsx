import { BasicSelect } from "@components/select";
import { useMemo, useState } from "react";
import { ContactSubAccount } from "@/@types/transactions";
import { AvatarEmpty } from "@components/avatar";
import { SelectOption } from "@/@types/components";
import { setReceiverContactAction } from "@redux/transaction/TransactionActions";
import { useAppSelector } from "@redux/Store";
import useSend from "@pages/home/hooks/useSend";
import { middleTruncation } from "@/common/utils/strings";

export default function ContactBookReceiver() {
  const [searchSubAccountValue, setSearchSubAccountValue] = useState<string | null>(null);
  const { sender, receiver } = useAppSelector((state) => state.transaction);
  const { contacts } = useAppSelector((state) => state.contacts);
  const { senderPrincipal, senderSubAccount, isSenderAllowance } = useSend();

  const filteredContacts: ContactSubAccount[] = useMemo(() => {
    if (!contacts || !contacts.length) return [];
    const allowanceContacts: ContactSubAccount[] = [];

    for (let contactIndex = 0; contactIndex < contacts.length; contactIndex++) {
      const currentContact = contacts[contactIndex];
      console.log({ senderPrincipal, senderSubAccount, isSenderAllowance, currentContact });
      // TODO: asset info removed from contacts

      // const currentContactAsset = currentContact?.assets?.find(
      //   (asset) => asset?.tokenSymbol === sender?.asset?.tokenSymbol,
      // );

      // currentContactAsset?.subaccounts?.forEach((subAccount) => {
      //   const receiverContact = {
      //     contactName: currentContact.name,
      //     contactPrincipal: currentContact.principal,
      //     contactAccountIdentifier: currentContact.accountIdentifier,
      //     assetLogo: currentContactAsset?.logo,
      //     assetSymbol: currentContactAsset?.symbol,
      //     assetTokenSymbol: currentContactAsset?.tokenSymbol,
      //     assetAddress: currentContactAsset?.address,
      //     assetDecimal: currentContactAsset?.decimal,
      //     assetShortDecimal: currentContactAsset?.shortDecimal,
      //     assetName: currentContactAsset?.symbol,
      //     subAccountIndex: subAccount?.subaccount_index,
      //     subAccountId: subAccount?.sub_account_id,
      //     subAccountAllowance: subAccount?.allowance,
      //     subAccountName: subAccount?.name,
      //   };

      //   if (isSenderAllowance()) {
      //     const sameSenderAndReceiver =
      //       senderPrincipal === currentContact.principal && senderSubAccount === subAccount?.sub_account_id;

      //     if (!sameSenderAndReceiver) {
      //       allowanceContacts.push(receiverContact);
      //     }
      //   } else {
      //     allowanceContacts.push(receiverContact);
      //   }
      // });
    }
    return allowanceContacts;
  }, [sender, contacts]);

  const formattedContacts = useMemo(() => {
    if (!searchSubAccountValue) return filteredContacts.map(formatContact);
    return filteredContacts
      .filter((contact) => {
        return (
          contact.contactName.toLocaleLowerCase().includes(searchSubAccountValue) ||
          contact.subAccountName.toLocaleLowerCase().includes(searchSubAccountValue)
        );
      })
      .map(formatContact);
  }, [filteredContacts, searchSubAccountValue]);

  return (
    <div className="mx-4">
      <BasicSelect
        onSelect={onSelect}
        options={formattedContacts}
        initialValue={receiver?.thirdContactSubAccount?.subAccountId}
        currentValue={receiver?.thirdContactSubAccount?.subAccountId}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
        componentWidth="21rem"
      />
    </div>
  );

  function formatContact(contact: ContactSubAccount) {
    return {
      value: contact.subAccountId,
      label: `${contact.contactName} [${contact.subAccountName}]`,
      subLabel:
        contact.subAccountId.length > 20 ? middleTruncation(contact.subAccountId, 10, 10) : contact.subAccountId,
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
