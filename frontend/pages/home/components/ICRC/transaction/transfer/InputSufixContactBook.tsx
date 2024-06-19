// svg
import { ReactComponent as SendUserIcon } from "@assets/svg/files/send-user-icon.svg";
//
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAppSelector } from "@redux/Store";
import { ContactSubAccount } from "@/@types/transactions";
import { middleTruncation } from "@common/utils/strings";
import { AvatarEmpty } from "@components/avatar";
import { Asset } from "@redux/models/AccountModels";
import { TransferFromTypeEnum, TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";

export default function InputSufixContactBook() {
  const { setTransferState, transferState } = useTransfer();
  const assets = useAppSelector((state) => state.asset.list.assets);
  const { sender } = useAppSelector((state) => state.transaction);
  const { contacts } = useAppSelector((state) => state.contacts);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-0 m-0">
          <SendUserIcon className="cursor-pointer" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="absolute w-[21rem] max-h-[24vh] bg-secondary-color-1-light dark:bg-level-1-color border border-primary-color  z-[1000] -right-12 mt-4 scroll-y-light rounded-lg  shadow-sm">
          {getContactOptions().map((contact, index) => {
            const { contactName, subAccountName } = contact;
            return (
              <DropdownMenu.Item
                className="flex items-center justify-start px-2 py-2 bg-opacity-50 cursor-pointer hover:bg-primary-color"
                key={`${contact.contactPrincipal}-${index}`}
                onSelect={() => onSelectContact(contact)}
              >
                <div className="flex items-center justify-between mr-2">
                  <AvatarEmpty title={contactName} size="large" />
                  <div className="ml-2">
                    <p className="text-left text-md text-black-color dark:text-white">
                      {contactName} {`[${subAccountName}]`}
                    </p>
                    <p className="text-left opacity-50 text-md text-black-color dark:text-white">
                      {contact.subAccountId.length > 20
                        ? middleTruncation(contact.subAccountId, 10, 10)
                        : contact.subAccountId}
                    </p>
                  </div>
                </div>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  function getContactOptions() {
    if (!contacts || !contacts.length) return [];
    const allowanceContacts: ContactSubAccount[] = [];
    const filteredContacts = contacts.map((contact) => {
      const accounts = contact.accounts.filter((account) => account.tokenSymbol === transferState.tokenSymbol);

      return { ...contact, accounts };
    });

    for (let contactIndex = 0; contactIndex < filteredContacts.length; contactIndex++) {
      const currentContact = filteredContacts[contactIndex];

      const contactSubAccounts: (ContactSubAccount | null)[] = currentContact.accounts.map((account) => {
        const sameSenderAndReceiver = transferState.fromPrincipal === currentContact.principal && transferState.fromSubAccount === account?.subaccountId;
        const currentAsset = assets.find((asset) => asset.tokenSymbol === sender?.asset?.tokenSymbol) as Asset;

        const data: ContactSubAccount = {
          contactName: currentContact.name,
          contactPrincipal: currentContact.principal,
          contactAccountIdentifier: currentContact.accountIdentifier,
          assetLogo: currentAsset?.logo,
          assetSymbol: currentAsset?.symbol,
          assetTokenSymbol: currentAsset?.tokenSymbol,
          assetAddress: currentAsset?.address,
          assetDecimal: currentAsset?.decimal,
          assetShortDecimal: currentAsset?.shortDecimal,
          assetName: currentAsset?.symbol,
          subAccountIndex: account.subaccount,
          subAccountId: account.subaccountId,
          subAccountAllowance: account.allowance,
          subAccountName: account.name,
        };


        if (transferState.fromType === TransferFromTypeEnum.allowanceContactBook || transferState.fromType === TransferFromTypeEnum.allowanceManual) {
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
  }

  function onSelectContact(contact: ContactSubAccount) {
    setTransferState((prev) => ({
      ...prev,
      toPrincipal: contact.contactPrincipal,
      toSubAccount: contact.subAccountId,
      toType: TransferToTypeEnum.thirdPartyContact,
    }));
  }
}
