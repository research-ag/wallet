// svgs
import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
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
}

export default function ContactList(props: ContactListProps) {
  console.log(props);
  const { t } = useTranslation();
  const [contactDropdown, setContactDropdown] = useState<Contact | null>(null);
  const [contactEdited, setContactEdited] = useState<Contact | null>(null);
  const [contactNameInvalid, setContactNameInvalid] = useState(false);

  return (
    <div className="w-full h-full scroll-y-light max-h-[calc(100vh-12rem)]">
      <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
        <thead className="sticky top-0 border-b border-BorderColorTwoLight dark:border-BorderColorTwo text-PrimaryTextColor/70 z-[1]">
          <tr className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            <th className="p-2 text-left w-[30%] bg-PrimaryColorLight dark:bg-PrimaryColor ">
              <p>{t("name")}</p>
            </th>
            <th className="p-2 text-left w-[55%] bg-PrimaryColorLight dark:bg-PrimaryColor">
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
                          {hasContactAllowance && (
                            <MoneyHandIcon className="relative w-5 h-5 cursor-pointer fill-RadioCheckColor" />
                          )}
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
                    <div className="flex items-center justify-center pl-2 rounded-md cursor-pointer bg-gray-color-2">
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

  // ---------------------- Sub Account Edit ----------------------
  // function changeSubIdx(e: string) {
  //   if (checkHexString(e)) {
  //     setSubaccEdited((prev) => {
  //       return { ...prev, subaccount_index: e.trim(), sub_account_id: `0x${e.trim()}` };
  //     });
  //     setSubaccEditedErr((prev) => {
  //       return {
  //         name: prev.name,
  //         subaccount_index: false,
  //       };
  //     });
  //   }
  // }

  // function changeName(e: string) {
  //   setSubaccEdited((prev) => {
  //     const newSubAccount = { ...prev, name: e };
  //     return newSubAccount;
  //   });
  //   setSubaccEditedErr((prev) => {
  //     return {
  //       name: false,
  //       subaccount_index: prev.subaccount_index,
  //     };
  //   });
  // }
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
    name: "Leonard",
    principal: "ce6m3-3hfxb-sgpbh-xapbw-orgea-yigrb-brph5-zwlbb-cloez-dqe2i-5ae",
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
        name: "credit",
        subaccount: "3",
        subaccountId: "0x3",
      },
      {
        tokenSymbol: "ICP",
        name: "loan",
        subaccount: "4",
        subaccountId: "0x4",
      },
      {
        tokenSymbol: "ICP",
        name: "mortgage",
        subaccount: "5",
        subaccountId: "0x5",
      },
      {
        tokenSymbol: "ICP",
        name: "investment",
        subaccount: "6",
        subaccountId: "0x6",
      },
      {
        tokenSymbol: "ICP",
        name: "retirement",
        subaccount: "7",
        subaccountId: "0x7",
      },
      {
        tokenSymbol: "ICP",
        name: "college",
        subaccount: "8",
        subaccountId: "0x8",
      },
      {
        tokenSymbol: "ICP",
        name: "health",
        subaccount: "9",
        subaccountId: "0x9",
      },
      {
        tokenSymbol: "ICP",
        name: "insurance",
        subaccount: "10",
        subaccountId: "0xa",
      },
      {
        tokenSymbol: "ICP",
        name: "tax",
        subaccount: "11",
        subaccountId: "0xb",
      },
      {
        tokenSymbol: "ICP",
        name: "payroll",
        subaccount: "12",
        subaccountId: "0xc",
      },
      {
        tokenSymbol: "ICP",
        name: "expense",
        subaccount: "13",
        subaccountId: "0xd",
      },
      {
        tokenSymbol: "ICP",
        name: "income",
        subaccount: "14",
        subaccountId: "0xe",
      },
      {
        tokenSymbol: "ICP",
        name: "equity",
        subaccount: "15",
        subaccountId: "0xf",
      },
    ],
  },
];
