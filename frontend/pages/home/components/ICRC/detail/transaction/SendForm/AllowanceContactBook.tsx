import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAppSelector } from "@redux/Store";
import SearchIcon from "@assets/svg/files/icon-search.svg";
import { useMemo, useState } from "react";
import { AvatarEmpty } from "@components/avatar";
import { ReactComponent as DropIcon } from "@assets/svg/files/chevron-right-icon.svg";
import { getIconSrc } from "@/utils/icons";
import { CustomInput } from "@components/Input";
import { AllowanceContactSubAccount, SenderState, SetSenderAllowanceContact } from "@/@types/transactions";

interface SenderAllowanceContactProps {
  sender: SenderState;
  setSenderAllowanceContact: SetSenderAllowanceContact;
}

export function AllowanceContactBook(props: SenderAllowanceContactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { contacts } = useAppSelector((state) => state.contacts);
  const [searchSubAccountValue, setSearchSubAccountValue] = useState<string | null>(null);
  const { sender, setSenderAllowanceContact } = props;

  const options = useMemo(() => {
    if (!contacts || !contacts.length) return [];
    const allowanceContacts: AllowanceContactSubAccount[] = [];

    for (let contactIndex = 0; contactIndex < contacts.length; contactIndex++) {
      const currentContact = contacts[contactIndex];
      const currentContactAsset = currentContact?.assets?.find(
        (asset) => asset?.tokenSymbol === sender?.asset?.tokenSymbol,
      );

      const subAccountsWithAllowances = currentContactAsset?.subaccounts?.filter((subAccount) => {
        return subAccount?.allowance?.allowance;
      });

      subAccountsWithAllowances?.forEach((subAccount) => {
        const allowanceContact = {
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

        allowanceContacts.push(allowanceContact);
      });
    }

    if (!searchSubAccountValue) return allowanceContacts;
    const cleanSearchValue = searchSubAccountValue.toLocaleLowerCase().trim();

    return allowanceContacts.filter((contact) => {
      return (
        contact.contactName.toLocaleLowerCase().includes(cleanSearchValue) ||
        contact.assetName?.toLocaleLowerCase().includes(cleanSearchValue) ||
        contact.subAccountName?.toLocaleLowerCase().includes(cleanSearchValue)
      );
    });
  }, [contacts, sender, searchSubAccountValue]);

  return (
    <DropdownMenu.Root modal={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger
        asChild
        className="flex items-center justify-between p-2 px-4 mt-2 border rounded-md cursor-pointer bg-ThemeColorSelectorLight dark:bg-SecondaryColor h-14"
      >
        <div className="flex items-center justify-center">
          <div className="mr-2">
            {sender?.allowanceContactSubAccount?.assetName && (
              <div className="flex items-center justify-between ">
                <AvatarEmpty title="H" size="large" />
                <div className="ml-2">
                  <p className="text-left">
                    {sender?.allowanceContactSubAccount?.contactName}{" "}
                    {`[${sender?.allowanceContactSubAccount?.subAccountName}]`}
                  </p>
                  <span className="flex">
                    <img
                      className="w-5 h-5 mr-2"
                      src={getIconSrc(
                        sender?.allowanceContactSubAccount?.assetLogo,
                        sender?.allowanceContactSubAccount?.assetSymbol,
                      )}
                      alt={sender?.allowanceContactSubAccount?.assetSymbol}
                    />
                    <p className="">
                      {sender?.allowanceContactSubAccount?.subAccountAllowance?.allowance}{" "}
                      {sender?.allowanceContactSubAccount?.assetSymbol}
                    </p>
                  </span>
                </div>
              </div>
            )}
            {!sender?.allowanceContactSubAccount?.assetName && <p>Select An Option</p>}
          </div>
          <DropIcon className={isOpen ? "-rotate-90" : ""} />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-[24rem] z-50 mt-2 bg-ThemeColorSelectorLight dark:bg-ThemeColorBack rounded-md border border-RadioCheckColor">
        <DropdownMenu.Group className="p-2">
          <CustomInput
            prefix={<img src={SearchIcon} className="mx-2" alt="search-icon" />}
            onChange={onSearchChange}
            placeholder="Search"
            className="dark:bg-SideColor bg-PrimaryColorLight"
          />
        </DropdownMenu.Group>
        <DropdownMenu.Group>
          {options.map((contact) => {
            const { contactName, assetLogo, assetSymbol, subAccountAllowance, subAccountName } = contact;

            return (
              <DropdownMenu.Item
                onSelect={() => onSelect(contact)}
                key={contact.contactPrincipal}
                className="flex items-center justify-start px-2 py-2 bg-opacity-50 cursor-pointer hover:bg-RadioCheckColor"
              >
                <div className="flex items-center justify-between mr-2">
                  <AvatarEmpty title={contactName} size="large" />
                  <div className="ml-2">
                    <p className="text-left">
                      {contactName} {`[${subAccountName}]`}
                    </p>
                    <span className="flex">
                      <img className="w-5 h-5 mr-2" src={getIconSrc(assetLogo, assetSymbol)} alt={assetSymbol} />
                      <p className="">
                        {subAccountAllowance?.allowance} {assetSymbol}
                      </p>
                    </span>
                  </div>
                </div>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );

  function onSelect(contact: AllowanceContactSubAccount) {
    setSenderAllowanceContact(contact);
  }

  function onSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newSearchValue = event.target.value.replace(/\s/g, "");
    setSearchSubAccountValue(newSearchValue);
  }

  function onOpenChange(open: boolean) {
    setIsOpen(open);
    setSearchSubAccountValue(null);
  }
}
