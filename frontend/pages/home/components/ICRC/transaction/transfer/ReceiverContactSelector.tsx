import { BasicSelect } from "@components/select";
import { useState } from "react";
import { ContactSubAccount } from "@/@types/transactions";
import { AvatarEmpty } from "@components/avatar";
import { SelectOption } from "@/@types/components";
import { useAppSelector } from "@redux/Store";
import { middleTruncation } from "@/common/utils/strings";
import { Asset } from "@redux/models/AccountModels";
import { TransferFromTypeEnum, TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import logger from "@/common/utils/logger";

export default function ReceiverContactSelector() {
  const { transferState, setTransferState } = useTransfer();
  const [searchSubAccountValue, setSearchSubAccountValue] = useState<string | null>(null);
  const { contacts } = useAppSelector((state) => state.contacts);
  const assets = useAppSelector((state) => state.asset.list.assets);

  const filteredContacts: ContactSubAccount[] = (() => {
    if (!contacts || !contacts.length) return [];
    const allowanceContacts: ContactSubAccount[] = [];

    for (let contactIndex = 0; contactIndex < contacts.length; contactIndex++) {
      const currentContact = contacts[contactIndex];

      const contactSubAccounts: (ContactSubAccount | null)[] = currentContact.accounts.map((account) => {
        if (account.tokenSymbol !== transferState.tokenSymbol) return null;

        const sameSenderAndReceiver =
          transferState.fromPrincipal === currentContact.principal &&
          transferState.fromSubAccount === account?.subaccountId;

        const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol) as Asset;

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

        if (
          transferState.fromType === TransferFromTypeEnum.allowanceContactBook ||
          transferState.fromType === TransferFromTypeEnum.allowanceManual
        ) {
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
  })();

  const formattedContacts = (() => {
    if (!searchSubAccountValue) return filteredContacts.map(formatContact);
    return filteredContacts
      .filter((contact) => {
        return (
          contact.contactName.toLocaleLowerCase().includes(searchSubAccountValue) ||
          contact.subAccountName.toLocaleLowerCase().includes(searchSubAccountValue)
        );
      })
      .map(formatContact);
  })();

  return (
    <div className="mx-4">
      <BasicSelect
        onSelect={onSelect}
        options={formattedContacts}
        initialValue={`${transferState.toPrincipal}-${transferState.toSubAccount}`}
        currentValue={`${transferState.toPrincipal}-${transferState.toSubAccount}`}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
        componentWidth="21rem"
      />
    </div>
  );

  function formatContact(contact: ContactSubAccount) {
    return {
      value: `${contact.contactPrincipal}-${contact.subAccountId}`,
      label: `${contact.contactName}`,
      subLabel: `[${contact.subAccountName}] ${
        contact.subAccountId.length > 20 ? middleTruncation(contact.subAccountId, 10, 10) : contact.subAccountId
      }`,
      icon: <AvatarEmpty title={contact.contactName} size="medium" className="mr-4" />,
    };
  }

  function onSelect(option: SelectOption) {
    setSearchSubAccountValue(null);
    const contact = filteredContacts.find(
      (contact) => `${contact.contactPrincipal}-${contact.subAccountId}` === option.value,
    );

    if (!contact) {
      logger.debug("ReceiverContactSelector: onSelect: contact not found");
      return;
    }

    const fullContact = contacts.find((c) => c.principal === contact.contactPrincipal);
    if (!fullContact) {
      logger.debug("ReceiverContactSelector: onSelect: fullContact not found");
      return;
    }

    const subAccount = fullContact.accounts.find(
      (account) => account.subaccountId === contact.subAccountId && account.tokenSymbol === transferState.tokenSymbol,
    );

    if (!subAccount) {
      logger.debug("ReceiverContactSelector: onSelect: subAccount not found");
      return;
    }

    setTransferState((prev) => ({
      ...prev,
      toPrincipal: fullContact.principal,
      toSubAccount: subAccount.subaccountId,
      toType: TransferToTypeEnum.thirdPartyContact,
    }));
  }

  function onSearchChange(searchValue: string) {
    setSearchSubAccountValue(searchValue);
  }

  function onOpenChange() {
    setSearchSubAccountValue(null);
  }
}
