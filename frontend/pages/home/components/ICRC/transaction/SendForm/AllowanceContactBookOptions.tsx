import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ContactSubAccount } from "@/@types/transactions";
import { useAppSelector } from "@redux/Store";
import { Dispatch, SetStateAction, useMemo } from "react";
import { setSenderContactAction } from "@redux/transaction/TransactionActions";
import { getIconSrc } from "@/common/utils/icons";
import { AvatarEmpty } from "@components/avatar";
import SearchIcon from "@assets/svg/files/icon-search.svg";
import { CustomInput } from "@components/input";

interface AllowanceContactBookOptionsProps {
  searchSubAccountValue: string | null;
  setSearchSubAccountValue: Dispatch<SetStateAction<string | null>>;
}

export default function AllowanceContactBookOptions(props: AllowanceContactBookOptionsProps) {
  const { searchSubAccountValue, setSearchSubAccountValue } = props;
  const { sender } = useAppSelector((state) => state.transaction);
  const { contacts } = useAppSelector((state) => state.contacts);

  const options = useMemo(() => {
    if (!contacts || !contacts.length) return [];
    const allowanceContacts: ContactSubAccount[] = [];

    for (let contactIndex = 0; contactIndex < contacts.length; contactIndex++) {
      const currentContact = contacts[contactIndex];
      console.log({ currentContact })
      // const currentContactAsset = currentContact?.assets?.find(
      //   (asset) => asset?.tokenSymbol === sender?.asset?.tokenSymbol,
      // );

      // const subAccountsWithAllowances = currentContactAsset?.subaccounts?.filter((subAccount) => {
      //   return subAccount?.allowance?.allowance;
      // });

      // subAccountsWithAllowances?.forEach((subAccount) => {
      //   const allowanceContact = {
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

      //   allowanceContacts.push(allowanceContact);
      // });
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
    <DropdownMenu.Content className="w-[23rem] z-50 mt-2 bg-ThemeColorSelectorLight dark:bg-ThemeColorBack rounded-md border border-RadioCheckColor">
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
  );

  function onSelect(contact: ContactSubAccount) {
    setSenderContactAction(contact);
  }

  function onSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newSearchValue = event.target.value.replace(/\s/g, "");
    setSearchSubAccountValue(newSearchValue);
  }
}
