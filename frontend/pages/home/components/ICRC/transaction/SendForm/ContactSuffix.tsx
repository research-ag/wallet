import { ContactSubAccount, TransactionScannerOptionEnum } from "@/@types/transactions";
import { ReactComponent as QRScanIcon } from "@assets/svg/files/qr.svg";
import { ReactComponent as SendUserIcon } from "@assets/svg/files/send-user-icon.svg";
import { useAppSelector } from "@redux/Store";
import { setReceiverContactAction, setScannerActiveOptionAction } from "@redux/transaction/TransactionActions";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useMemo } from "react";
import { AvatarEmpty } from "@components/avatar";
import useSend from "@pages/home/hooks/useSend";
import { middleTruncation } from "@/common/utils/strings";
import { Asset } from "@redux/models/AccountModels";

export default function ContactSuffix() {
  const { senderPrincipal, senderSubAccount, isSenderAllowance } = useSend();
  const assets = useAppSelector((state) => state.asset.list.assets);
  const { sender } = useAppSelector((state) => state.transaction);
  const { contacts } = useAppSelector((state) => state.contacts);

  const filteredContacts = useMemo(() => {
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

  return (
    <div className="relative flex flex-row items-center justify-center gap-2">
      {filteredContacts.length > 0 && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-0 m-0">
              <SendUserIcon className="cursor-pointer" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="absolute w-[21rem] max-h-[24vh] bg-secondary-color-1-light dark:bg-level-1-color border border-primary-color  z-[1000] -right-12 mt-4 scroll-y-light rounded-lg  shadow-sm ">
              {filteredContacts.map((contact, index) => {
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
      )}
      <QRScanIcon onClick={onSenderScannerShow} className="cursor-pointer" />
    </div>
  );

  function onSenderScannerShow() {
    setScannerActiveOptionAction(TransactionScannerOptionEnum.Values.receiver);
  }

  function onSelectContact(contact: ContactSubAccount) {
    setReceiverContactAction(contact);
  }
}
