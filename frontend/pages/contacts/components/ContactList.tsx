// svgs
import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";
// import DeleteContactModal from "./ICRC/DeleteContactModal";
//
import { Contact } from "@/@types/contacts";
import { CustomInput } from "@components/input";
import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import logger from "@/common/utils/logger";
import { getInitialFromName } from "@common/utils/strings";
import { shortAddress } from "@common/utils/icrc";
import { CustomCopy } from "@components/tooltip";
import { ChevronDownIcon, ChevronLeftIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import SubAccountTable from "./ICRC/SubAccountTable";

interface ContactListProps {
  contactSearchKey: string;
  assetFilter: string[];
  allowanceOnly: boolean;
}

export default function ContactList({ allowanceOnly, assetFilter, contactSearchKey }: ContactListProps) {
  const { t } = useTranslation();
  const [contactDropdown, setContactDropdown] = useState<Contact | null>(null);
  const [contactEdited, setContactEdited] = useState<Contact | null>(null);
  const [contactNameInvalid, setContactNameInvalid] = useState(false);

  return (
    <div className="w-full h-full scroll-y-light max-h-[calc(100vh-12rem)]">
      <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
        <thead className="sticky top-0 border-b border-BorderColorTwoLight dark:border-BorderColorTwo text-PrimaryTextColor/70 z-[1]">
          <tr className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            <th className="p-2 text-left w-[40%] bg-PrimaryColorLight dark:bg-PrimaryColor flex items-center ">
              <p>{t("contact.name")}</p>
              <SortIcon
                className="w-3 h-3 ml-1 cursor-pointer dark:fill-gray-color-6 fill-black-color"
                onClick={console.log}
              />
            </th>
            <th className="p-2 text-left w-[45%] bg-PrimaryColorLight dark:bg-PrimaryColor">
              <p>{"Principal"}</p>
            </th>
            <th className="p-2 w-[12%] bg-PrimaryColorLight dark:bg-PrimaryColor">
              <p>{t("action")}</p>
            </th>
            <th className="w-[3%] bg-PrimaryColorLight dark:bg-PrimaryColor"></th>
          </tr>
        </thead>

        <tbody>
          {data.map((contact, index) => {
            const isContactExpanded = contactDropdown?.principal === contact.principal;
            const isContactEditable = contactEdited?.principal === contact.principal;
            const hasContactAllowance = contact.accounts.some((account) => account.allowance);

            // --- filters ---
            if (allowanceOnly && !hasContactAllowance) return null;

            const include = contact.accounts
              .map((account) => account.tokenSymbol)
              .some((symbol) => assetFilter.includes(symbol));
            if (!include && assetFilter.length > 0) return null;

            const subAccountNames = contact.accounts.map((account) => account.name);
            const subAccountIds = contact.accounts.map((account) => account.subaccountId);

            if (contactSearchKey.trim() !== "") {
              const searchTerm = contactSearchKey.trim().toLowerCase();
              const nameMatch = contact.name.toLowerCase().includes(searchTerm);
              const principalMatch = contact.principal.toLowerCase().includes(searchTerm);
              const subAccountNameMatch = subAccountNames.some((name) => name.toLowerCase().includes(searchTerm));
              const subAccountIdMatch = subAccountIds.some((id) => id.toLowerCase().includes(searchTerm));

              if (!nameMatch && !principalMatch && !subAccountNameMatch && !subAccountIdMatch) return null;
            }

            return (
              <Fragment key={`${contact.principal}-${index}`}>
                <tr className={getBodyRowStyles(isContactExpanded, isContactEditable)}>
                  <td>
                    <div className="relative flex flex-row items-center justify-start w-full gap-2 px-4 min-h-14">
                      {isContactExpanded && <div className="absolute left-0 w-1 h-14 bg-SelectRowColor" />}

                      {isContactEditable ? (
                        <div className="flex items-center justify-between w-full gap-2">
                          <CustomInput
                            intent={"primary"}
                            border={contactNameInvalid ? "error" : "selected"}
                            sizeComp={"xLarge"}
                            sizeInput="small"
                            onChange={onContactNameChange}
                            value={contactEdited?.name || ""}
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
                        <div className="flex flex-row items-center justify-start w-full gap-2">
                          <div className={getContactColor(index)}>
                            <p className="text-PrimaryTextColor">{getInitialFromName(contact.name, 2)}</p>
                          </div>
                          <p
                            className="text-left opacity-70 break-words max-w-[14rem]"
                            onDoubleClick={() => onEditContact(contact)}
                          >
                            {contact.name}
                          </p>
                          {hasContactAllowance && <MoneyHandIcon className="relative w-5 h-5 fill-RadioCheckColor" />}
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
                      {/* <DeleteContactModal contact={contact} /> */}
                      <DotsHorizontalIcon
                        className="w-5 h-5 opacity-50 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
                        onClick={onContactAction}
                      />
                    </div>
                  </td>

                  <td className="p-2">
                    <div className="flex items-center justify-center px-2.5 py-1 rounded-md cursor-pointer bg-gray-color-2">
                      <span className="text-md">{contact.accounts.length}</span>
                      {isContactExpanded ? (
                        <ChevronDownIcon className="w-4 h-4 ml-1" onClick={() => onOpenDropdown(contact)} />
                      ) : (
                        <ChevronLeftIcon className="w-4 h-4 ml-1" onClick={() => onOpenDropdown(contact)} />
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

  function onContactNameChange(e: ChangeEvent<HTMLInputElement>) {
    setContactEdited((prev: any) => {
      return { ...prev, name: e.target.value };
    });

    setContactNameInvalid(false);
  }

  function onSaveContact() {
    if (!contactEdited) return;
    // TODO: validate name which is the only editable field
    const isNameInValid = contactEdited.name.trim() === "";
    setContactNameInvalid(isNameInValid);
    if (isNameInValid) return;

    try {
      // const accountIdentifier = AccountIdentifier.fromPrincipal({
      //   principal: Principal.fromText(contactEdited.principal),
      // }).toHex();
      // const updatedContact = { ...contactEdited };
      // updateContact(updatedContact, contact.principal);
    } catch (error) {
      logger.debug("Error saving contact", error);
    } finally {
      setContactEdited(null);
    }
  }

  // function getFilteredContacts() {
  // const searchTerm = contactSearchKey.trim().toLowerCase();

  // const filtedContacts = contacts.filter((currentContact) => {
  //   const nameMatch = currentContact.name.toLowerCase().includes(searchTerm);
  //   const principalMatch = currentContact.principal.toLowerCase().includes(searchTerm);

  //   const subAccountNameMatch = currentContact.assets.some((asset) => {
  //     return asset.subaccounts.some((subaccount) => {
  //       return subaccount.name.toLowerCase().includes(searchTerm);
  //     });
  //   });

  //   const assetFilterMatch =
  //     assetFilter.length === 0 ||
  //     currentContact.assets.some((asset) => {
  //       return assetFilter.includes(asset.symbol);
  //     });

  //   return nameMatch || principalMatch || subAccountNameMatch || assetFilterMatch;
  // });

  // return filtedContacts;
  // }

  function onCancelContactEdit() {
    setContactEdited(null);
    setContactNameInvalid(false);
  }

  function onEditContact(contact: Contact) {
    setContactEdited(contact);
    setContactNameInvalid(false);
  }

  function onContactAction() {
    console.log("Contact Action");
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

const data: Contact[] = [
  {
    name: "Alex",
    principal: "r4jkc-ykktj-k5y7l-fqule-ypybt-h2m5n-nzvlk-xov2a-ipgn7-wb5hx-yae",
    accountIdentifier: "a922b4a0423f4f0bf08f0bc6966e640288588c3427f29fb9b67f580fbdbe091e",
    accounts: [
      {
        tokenSymbol: "ICP",
        name: "main",
        subaccount: "0",
        subaccountId: "0x3",
        allowance: {
          amount: "100000000",
          expiration: "",
        },
      },
      {
        tokenSymbol: "ICP",
        name: "savings",
        subaccount: "1",
        subaccountId: "0x1",
      },
    ],
  },
  {
    name: "Jair",
    principal: "jf4a3-wwwya-wnnvk-wiztu-tgafi-qn4is-swdmy-hrr4y-mrewg-2x5bl-hae",
    accountIdentifier: "a922b4a0423f4f0bf08f0bc6966e640288588c3427f29fb9b67f580fbdbe091e",
    accounts: [
      {
        tokenSymbol: "ICP",
        name: "main",
        subaccount: "0",
        subaccountId: "0x0",
      },
      {
        tokenSymbol: "ICP",
        name: "savings",
        subaccount: "1",
        subaccountId: "0x1",
      },
      {
        tokenSymbol: "ICP",
        name: "checking",
        subaccount: "2",
        subaccountId: "0x2",
      },
      {
        tokenSymbol: "ICP",
        name: "investment",
        subaccount: "3",
        subaccountId: "0x3",
      },
      {
        tokenSymbol: "ICP",
        name: "retirement",
        subaccount: "4",
        subaccountId: "0x4",
      },
    ],
  },
  {
    name: "Will",
    principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
    accountIdentifier: "a922b4a0423f4f0bf08f0bc6966e640288588c3427f29fb9b67f580fbdbe091e",
    accounts: [
      {
        tokenSymbol: "ICP",
        name: "main",
        subaccount: "0",
        subaccountId: "0x0",
      },
      {
        tokenSymbol: "ICP",
        name: "savings",
        subaccount: "1",
        subaccountId: "0x1",
      },
      {
        tokenSymbol: "ICP",
        name: "checking",
        subaccount: "2",
        subaccountId: "0x2",
      },
      {
        tokenSymbol: "ICP",
        name: "investment",
        subaccount: "3",
        subaccountId: "0x3",
      },
      {
        tokenSymbol: "ICP",
        name: "retirement",
        subaccount: "4",
        subaccountId: "0x4",
      },
    ],
  },
  {
    name: "Marcus",
    principal: "fu2m3-wba2s-but7a-nh2mf-w6suf-f5wgs-66ypw-lk3sq-wmtwi-mulho-eqe",
    accountIdentifier: "a922b4a0423f4f0bf08f0bc6966e640288588c3427f29fb9b67f580fbdbe091e",
    accounts: [
      {
        tokenSymbol: "ICP",
        name: "main",
        subaccount: "0",
        subaccountId: "0x0",
      },
      {
        tokenSymbol: "ICP",
        name: "savings",
        subaccount: "1",
        subaccountId: "0x1",
      },
      {
        tokenSymbol: "ICP",
        name: "checking",
        subaccount: "2",
        subaccountId: "0x2",
      },
      {
        tokenSymbol: "ICP",
        name: "investment",
        subaccount: "3",
        subaccountId: "0x3",
      },
    ],
  },
];
