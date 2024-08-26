// svgs
import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";
//
import { Contact } from "@redux/models/ContactsModels";
import { CustomInput } from "@components/input";
import { clsx } from "clsx";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import logger from "@/common/utils/logger";
import { getInitialFromName, removeExtraSpaces } from "@common/utils/strings";
import { shortAddress } from "@common/utils/icrc";
import { CustomCopy } from "@components/tooltip";
import { ChevronDownIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import SubAccountTable from "./ICRC/SubAccountTable";
import ContactAction from "./ICRC/ContactAction";
import { useAppSelector } from "@redux/Store";
import { isContactNameValid } from "../helpers/validators";
import { db } from "@/database/db";
import {
  filterContactAccountByAllowances,
  filterContactAccountsByAssets,
  filterContactsByAllowances,
  filterContactsByAssets,
  filterContactsBySearchKey,
} from "../helpers/filters";

interface ContactListProps {
  contactSearchKey: string;
  assetFilter: string[];
  allowanceOnly: boolean;
}

enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}

export default function ContactList({ allowanceOnly, assetFilter, contactSearchKey }: ContactListProps) {
  const { t } = useTranslation();
  const [contactDropdown, setContactDropdown] = useState<Contact | null>(null);
  const [contactEdited, setContactEdited] = useState<Contact | null>(null);
  const [contactNameInvalid, setContactNameInvalid] = useState(false);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.Asc);
  const contacts = useAppSelector((state) => state.contacts.contacts);

  return (
    <div className="w-full h-full scroll-y-light max-h-[calc(100vh-12rem)]">
      <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
        <thead className="sticky top-0 border-b border-BorderColorTwoLight dark:border-BorderColorTwo text-PrimaryTextColor/70 z-[1]">
          <tr className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            <th className="p-2 text-left w-[40%] bg-PrimaryColorLight dark:bg-PrimaryColor flex items-center ">
              <p>{t("contact.name")}</p>
              <SortIcon
                className="w-3 h-3 ml-1 cursor-pointer dark:fill-gray-color-6 fill-black-color"
                onClick={toggleSortDirection}
              />
            </th>
            <th className="p-2 text-left w-[45%] bg-PrimaryColorLight dark:bg-PrimaryColor">
              <p>{"Principal"}</p>
            </th>
            <th className="pr-2 py-2 w-[12%] bg-PrimaryColorLight dark:bg-PrimaryColor">
              <p>{t("action")}</p>
            </th>
            <th className="w-[3%] bg-PrimaryColorLight dark:bg-PrimaryColor"></th>
          </tr>
        </thead>

        <tbody>
          {getFilteredContacts(contacts).map((contact, index) => {
            const isContactExpanded = contactDropdown?.principal === contact.principal;
            const isContactEditable = contactEdited?.principal === contact.principal;
            const hasContactAllowance = contact.accounts.some((account) => account.allowance?.amount);

            return (
              <Fragment key={`${contact.principal}-${index}`}>
                <tr className={getBodyRowStyles(isContactExpanded, isContactEditable)}>
                  <td>
                    <div className="relative flex flex-row items-center justify-start w-full gap-2 px-4 min-h-14">
                      {isContactExpanded && <div className="absolute left-0 w-1 h-14 bg-primary-color" />}

                      {isContactEditable ? (
                        <div className="flex items-center justify-between w-full gap-2">
                          <CustomInput
                            intent={"primary"}
                            border={contactNameInvalid ? "error" : "selected"}
                            sizeComp={"xLarge"}
                            sizeInput="small"
                            onChange={onContactNameChange}
                            value={contactEdited?.name || ""}
                            className="h-[2.2rem] dark:bg-level-2-color bg-white rounded-lg border-[2px] text-left"
                            inputClass="h-[1.5rem]"
                            autoFocus
                          />

                          {isContactEditable && (
                            <CheckIcon
                              onClick={onSaveContact}
                              className="w-4 h-4 opacity-50 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
                            />
                          )}

                          {isContactEditable && (
                            <CloseIcon
                              onClick={onCancelContactEdit}
                              className="w-5 h-5 opacity-50 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
                            />
                          )}
                        </div>
                      ) : null}

                      {!isContactEditable ? (
                        <div
                          className="flex flex-row items-center justify-start w-full gap-2"
                          onDoubleClick={() => {
                            onEditContact(contact);
                          }}
                        >
                          <div className={getContactColor(index)}>
                            <p className="text-PrimaryTextColor">{getInitialFromName(contact.name, 2)}</p>
                          </div>
                          <p
                            data-popover-target="popover-default"
                            className="text-left opacity-70 break-words max-w-[17rem] truncate"
                            data-toggle="popover"
                            data-trigger="hover"
                            title={contact.name}
                          >
                            {contact.name.length > 32 ? `${contact.name.slice(0, 26)}...` : contact.name}
                          </p>
                          {hasContactAllowance && <MoneyHandIcon className="relative w-6 h-6 fill-primary-color" />}
                        </div>
                      ) : null}
                    </div>
                  </td>

                  <td className="py-2">
                    <div className="flex flex-row items-center justify-start gap-2 px-2 opacity-70">
                      <p>{shortAddress(contact.principal, 12, 9)}</p>
                      <CustomCopy size={"xSmall"} className="p-0" copyText={contact.principal} />
                    </div>
                  </td>

                  <td className="py-2">
                    <div className="flex flex-row items-start justify-center w-full gap-4">
                      <ContactAction contact={contact} />
                    </div>
                  </td>

                  <td className="p-2">
                    <div
                      className="flex items-center justify-center px-2.5 py-1 rounded-md cursor-pointer dark:bg-gray-color-2 bg-gray-color-7"
                      onClick={() => onOpenDropdown(contact)}
                    >
                      <span className="text-md">{contact.accounts.length}</span>
                      {isContactExpanded ? (
                        <ChevronDownIcon className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronLeftIcon className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </td>
                </tr>
                {isContactExpanded && <SubAccountTable contact={contact} />}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  function getFilteredContacts(contacts: Contact[]) {
    const sortedContacts = getSortedContacts(contacts, sortDirection);

    // filter by allowance
    const contactsByAllowance = allowanceOnly ? filterContactsByAllowances(sortedContacts) : sortedContacts;

    const contactAccountByAllowance = allowanceOnly
      ? contactsByAllowance.map(filterContactAccountByAllowances)
      : contactsByAllowance;

    // filter by asset
    const isAssetFilterEmpty = assetFilter.length === 0;

    const contactsByAsset = isAssetFilterEmpty
      ? contactAccountByAllowance
      : filterContactsByAssets(contactAccountByAllowance, assetFilter);

    const contactsAccountFiltered = isAssetFilterEmpty
      ? contactsByAsset
      : contactsByAsset.map((contact) => filterContactAccountsByAssets(contact, assetFilter));

    // filter by search key (subaccount name and subaccount id)
    const isSearchKeyEmpty = contactSearchKey.trim().length === 0;

    const filteredContacts = isSearchKeyEmpty
      ? contactsAccountFiltered
      : filterContactsBySearchKey(contactsAccountFiltered, contactSearchKey);

    return filteredContacts;
  }

  function getSortedContacts(contacts: Contact[], sortDirection: SortDirection): Contact[] {
    return [...contacts].sort((a, b) => {
      if (sortDirection === SortDirection.Asc) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }

  function toggleSortDirection() {
    if (sortDirection === SortDirection.Asc) setSortDirection(SortDirection.Desc);
    else setSortDirection(SortDirection.Asc);
  }

  function onContactNameChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length <= 32)
      setContactEdited((prev: any) => {
        return { ...prev, name: removeExtraSpaces(e.target.value) };
      });
  }

  async function onSaveContact() {
    try {
      if (!contactEdited) return;
      setContactNameInvalid(false);

      if (!isContactNameValid(contactEdited.name)) {
        setContactNameInvalid(true);
        return;
      }

      await db().updateContact(contactEdited.principal, contactEdited, { sync: true });
      setContactEdited(null);
    } catch (error) {
      logger.debug("Error saving contact", error);
    }
  }

  function onCancelContactEdit() {
    setContactEdited(null);
    setContactNameInvalid(false);
  }

  function onEditContact(contact: Contact) {
    setContactEdited(contact);
    setContactNameInvalid(false);
  }

  function onOpenDropdown(contact: Contact) {
    const isSelectedDifferent = contactDropdown?.principal !== contact.principal;
    if (contactDropdown && !isSelectedDifferent) setContactDropdown(null);
    else setContactDropdown(contact);
  }
}

const getBodyRowStyles = (isContactExpanded: boolean, isContactEditable: boolean) => {
  return clsx({
    ["border-b border-BorderColorTwoLight dark:border-BorderColorTwo"]: true,
    ["bg-SecondaryColorLight dark:bg-SecondaryColor"]: isContactExpanded && !isContactEditable,
    ["bg-primary-color/20 dark:bg-primary-color/20"]: isContactEditable,
  });
};

const getContactColor = (index: number) => {
  return clsx({
    ["flex justify-center items-center !min-w-[2rem] w-8 h-8 rounded-md"]: true,
    ["bg-ContactColor1"]: index % 3 === 0,
    ["bg-ContactColor2"]: index % 3 === 1,
    ["bg-ContactColor3"]: index % 3 === 2,
  });
};
