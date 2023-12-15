import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import SearchIcon from "@assets/svg/files/icon-search.svg";
import { useState } from "react";
import { ReactComponent as DropIcon } from "@assets/svg/files/chevron-right-icon.svg";
import { CustomInput } from "@components/input";
import { ContactSubAccount } from "@/@types/transactions";
import { useAppSelector } from "@redux/Store";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import logger from "@/common/utils/logger";
import { AvatarEmpty } from "@components/avatar";
import { useTranslation } from "react-i18next";

export default function AllowanceSenderContactBook() {
  const { t } = useTranslation();
  const contacts = useAppSelector((state) => state.contacts.contacts);
  const assets = useAppSelector((state) => state.asset.list.assets);
  const { transferState, setTransferState } = useTransfer();
  const [isOpen, setIsOpen] = useState(false);
  const [searchKey, setSearchKey] = useState<string | null>(null);

  return (
    <div className="max-w-[21rem] mx-auto">
      <DropdownMenu.Root modal={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenu.Trigger
          asChild
          className="flex w-[21rem] items-center justify-between h-12 p-2 px-1 mt-2 border border-BorderColorLight dark:border-BorderColor rounded-md cursor-pointer bg-ThemeColorSelectorLight dark:bg-SecondaryColor"
        >
          <div className="flex items-center justify-center">
            <div>
              {transferState.fromSubAccount && (
                <div className="flex items-center justify-between ">
                  <AvatarEmpty title="H" size="medium" />
                  <div className="ml-2">
                    <p className="text-left text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                      {getContactName()} {`[${getContactAccountName()}]`}
                    </p>
                    <span className="flex">
                      <p className="opacity-50 text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                        {getContactAllowanceAmount()} {transferState.tokenSymbol}
                      </p>
                    </span>
                  </div>
                </div>
              )}
              {!transferState.fromSubAccount && (
                <p className="ml-2 text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                  {t("select.option")}
                </p>
              )}
            </div>
            <DropIcon className={`fill-gray-color-4 mr-2 ${isOpen ? "-rotate-90" : ""}`} />
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-[21rem] z-50 mt-1 bg-ThemeColorSelectorLight dark:bg-ThemeColorBack rounded-md border border-RadioCheckColor">
          <div className="p-2">
            <CustomInput
              prefix={<img src={SearchIcon} className="mx-2" alt="search-icon" />}
              onChange={onSearchChange}
              placeholder="Search"
              className="dark:bg-SideColor bg-PrimaryColorLight"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          <div>
            {getOptions().map((contact) => {
              const { contactName, assetSymbol, subAccountAllowance, subAccountName } = contact;

              return (
                <DropdownMenu.Item
                  onSelect={() => onSelect(contact)}
                  key={`${contact.contactPrincipal}-${contact.subAccountIndex}`}
                  className="flex items-center justify-start px-2 py-2 bg-opacity-50 cursor-pointer hover:bg-RadioCheckColor"
                >
                  <div className="flex items-center justify-between mr-2">
                    <AvatarEmpty title={contactName} size="medium" />
                    <div className="ml-2">
                      <p className="text-left text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                        {contactName} {`[${subAccountName}]`}
                      </p>
                      <span className="flex">
                        <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor opacity-50">
                          {subAccountAllowance?.amount} {assetSymbol}
                        </p>
                      </span>
                    </div>
                  </div>
                </DropdownMenu.Item>
              );
            })}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );

  // ------------ DATA DISPLAY ------------

  function getOptions() {
    if (!contacts || !contacts.length) return [];
    const allowanceContacts: ContactSubAccount[] = [];

    for (let contactIndex = 0; contactIndex < contacts.length; contactIndex++) {
      const currentContact = contacts[contactIndex];

      const contactSubAccounts: (ContactSubAccount | null)[] = currentContact.accounts
        .map((account) => {
          const isAccountIdSelected = account.subaccountId === transferState.fromSubAccount;
          const isPrincipalSelected = currentContact.principal === transferState.fromPrincipal;

          if (isAccountIdSelected && isPrincipalSelected) return null;

          const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState?.tokenSymbol);

          if (!currentAsset) {
            logger.error("AllowanceSenderContactBook: Asset not found");
            return null;
          }

          if (account.tokenSymbol !== transferState.tokenSymbol) return null;

          return {
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
        })
        .filter((subAccount) => Boolean(subAccount?.subAccountAllowance?.amount));

      const clean: ContactSubAccount[] = contactSubAccounts.filter(
        (subAccount) => subAccount !== null && subAccount !== undefined,
      ) as ContactSubAccount[];
      allowanceContacts.push(...clean);
    }

    if (!searchKey) return allowanceContacts;
    const cleanSearchValue = searchKey.toLocaleLowerCase().trim();

    return allowanceContacts.filter((contact) => {
      return (
        contact.contactName.toLocaleLowerCase().includes(cleanSearchValue) ||
        contact.assetName?.toLocaleLowerCase().includes(cleanSearchValue) ||
        contact.subAccountName?.toLocaleLowerCase().includes(cleanSearchValue)
      );
    });
  }

  function getContactName() {
    const contact = contacts.find((contact) => contact.principal === transferState.fromPrincipal);

    if (!contact) {
      logger.error("getContactName: Contact not found");
      return "";
    }

    return contact.name;
  }

  function getContactAccountName() {
    const contact = contacts.find((contact) => contact.principal === transferState.fromPrincipal);

    if (!contact) {
      logger.error("getContactAccountName: Contact not found");
      return "";
    }

    const account = contact.accounts.find((account) => {
      const isTokenSymbolMatch = account.tokenSymbol === transferState.tokenSymbol;
      const isSubAccountIdMatch = account.subaccountId === transferState.fromSubAccount;
      return isTokenSymbolMatch && isSubAccountIdMatch;
    });

    if (!account) {
      logger.error("getContactAccountName: Account not found");
      return "";
    }

    return account.name;
  }

  function getContactAllowanceAmount() {
    // WARNING: Will display the last updated allowance amount not the real-time allowance amount
    const contact = contacts.find((contact) => contact.principal === transferState.fromPrincipal);

    if (!contact) {
      logger.error("getContactAllowanceAmount: Contact not found");
      return "";
    }

    const account = contact.accounts.find((account) => {
      const isTokenSymbolMatch = account.tokenSymbol === transferState.tokenSymbol;
      const isSubAccountIdMatch = account.subaccountId === transferState.fromSubAccount;
      return isTokenSymbolMatch && isSubAccountIdMatch;
    });

    if (!account) {
      logger.error("getContactAllowanceAmount: Account not found");
      return "";
    }

    if (!account?.allowance?.amount) {
      logger.error("getContactAllowanceAmount: Allowance amount not found");
      return "0";
    }

    return account.allowance.amount;
  }

  // ------------ USER EVENTS ------------

  function onSelect(contact: ContactSubAccount) {
    setTransferState((prev) => ({
      ...prev,
      fromSubAccount: contact.subAccountId,
      fromPrincipal: contact.contactPrincipal,
    }));

    setSearchKey(null);
  }

  function onSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newSearchValue = event.target.value.replace(/\s/g, "");
    setSearchKey(newSearchValue);
  }

  function onOpenChange(open: boolean) {
    setIsOpen(open);
    setSearchKey(null);
  }
}
