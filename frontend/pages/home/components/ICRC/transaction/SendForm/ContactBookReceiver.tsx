import { BasicSelect } from "@components/select";
import { useMemo, useState } from "react";
import { ContactSubAccount } from "@/@types/transactions";
import { AvatarEmpty } from "@components/avatar";
import { SelectOption } from "@/@types/components";
import { setReceiverContactAction } from "@redux/transaction/TransactionActions";
import { useAppSelector } from "@redux/Store";
import useSend from "@pages/home/hooks/useSend";
import { middleTruncation } from "@/common/utils/strings";
import { Asset } from "@redux/models/AccountModels";

export default function ContactBookReceiver() {
  const [searchSubAccountValue, setSearchSubAccountValue] = useState<string | null>(null);
  const { sender, receiver } = useAppSelector((state) => state.transaction);
  const { contacts } = useAppSelector((state) => state.contacts);
  const assets = useAppSelector((state) => state.asset.list.assets);
  const { senderPrincipal, senderSubAccount, isSenderAllowance } = useSend();

  const filteredContacts: ContactSubAccount[] = useMemo(() => {
    if (!contacts || !contacts.length) return [];
    const allowanceContacts: ContactSubAccount[] = [];

    for (let contactIndex = 0; contactIndex < contacts.length; contactIndex++) {
      const currentContact = contacts[contactIndex];

      const contactSubAccounts: (ContactSubAccount | null)[] = currentContact.accounts.map((account) => {
        const sameSenderAndReceiver =
          senderPrincipal === currentContact.principal && senderSubAccount === account?.subaccountId;
        const currentAsset = assets.find((asset) => asset.tokenSymbol === sender?.asset?.tokenSymbol) as Asset;

        const data: ContactSubAccount = {
          contactName: currentContact.name,
          contactPrincipal: currentContact.principal,
          contactAccountIdentifier: currentContact.accountIdentifier,
          assetLogo: currentAsset.logo,
          assetSymbol: currentAsset.symbol,
          assetTokenSymbol: currentAsset.tokenSymbol,
          assetAddress: currentAsset.address,
          assetDecimal: currentAsset.decimal,
          assetShortDecimal: currentAsset?.shortDecimal,
          assetName: currentAsset.symbol,
          subAccountIndex: account.subaccount,
          subAccountId: account.subaccountId,
          subAccountAllowance: account.allowance,
          subAccountName: account.name,
        };

        if (isSenderAllowance()) {
          if (!sameSenderAndReceiver) return data;
        } else {
          return data;
        }

        return null;
      });

      const noNullSubAccounts = contactSubAccounts.filter((subAccount) => subAccount !== null) as ContactSubAccount[];
      allowanceContacts.push(...noNullSubAccounts);
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
        initialValue={`${receiver.thirdContactSubAccount.contactPrincipal}-${receiver?.thirdContactSubAccount?.subAccountId}`}
        currentValue={`${receiver.thirdContactSubAccount.contactPrincipal}-${receiver?.thirdContactSubAccount?.subAccountId}`}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
        componentWidth="21rem"
      />
    </div>
  );

  function formatContact(contact: ContactSubAccount) {
    return {
      value: `${contact.contactPrincipal}-${contact.subAccountId}`,
      label: `${contact.contactName} [${contact.subAccountName}]`,
      subLabel:
        contact.subAccountId.length > 20 ? middleTruncation(contact.subAccountId, 10, 10) : contact.subAccountId,
      icon: <AvatarEmpty title={contact.contactName} size="medium" className="mr-4" />,
    };
  }
  function onSelect(option: SelectOption) {
    setSearchSubAccountValue(null);
    const fullContact = filteredContacts?.find(
      (contact) => `${contact.contactPrincipal}-${contact.subAccountId}` === option.value,
    );
    if (fullContact) setReceiverContactAction(fullContact);
  }
  function onSearchChange(searchValue: string) {
    setSearchSubAccountValue(searchValue);
  }
  function onOpenChange() {
    setSearchSubAccountValue(null);
  }
}
