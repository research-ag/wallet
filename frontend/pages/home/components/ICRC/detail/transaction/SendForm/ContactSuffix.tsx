import { ContactSubAccount, TransactionScannerOptionEnum } from "@/@types/transactions";
import { ReactComponent as QRScanIcon } from "@assets/svg/files/qr.svg";
import { ReactComponent as SendUserIcon } from "@assets/svg/files/send-user-icon.svg";
import { useAppSelector } from "@redux/Store";
import { setReceiverContactAction, setScannerActiveOptionAction } from "@redux/transaction/TransactionActions";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useMemo } from "react";
import { AvatarEmpty } from "@components/avatar";

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

  return (
    <div className="relative flex flex-row items-center justify-center gap-2 mx-2">
      {filteredContacts.length > 0 && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-0 m-0">
              <SendUserIcon className="cursor-pointer" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="absolute w-[20rem] bg-level-1-color border border-primary-color  z-[1000] -right-16  scroll-y-light rounded-lg  shadow-sm ">
              {filteredContacts.map((contact, index) => {
                const { contactName, subAccountName } = contact;
                return (
                  <DropdownMenu.Item
                    className="flex items-center justify-start px-2 py-2 bg-opacity-50 cursor-pointer hover:bg-RadioCheckColor"
                    key={`${contact.contactPrincipal}-${index}`}
                    onSelect={() => onSelectContact(contact)}
                  >
                    <div className="flex items-center justify-between mr-2">
                      <AvatarEmpty title={contactName} size="large" />
                      <div className="ml-2">
                        <p className="text-left">
                          {contactName} {`[${subAccountName}]`}
                        </p>
                        <p>{contact.subAccountId}</p>
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
