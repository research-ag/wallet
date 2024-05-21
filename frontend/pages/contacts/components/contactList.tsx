// svgs
import { ReactComponent as ChevIcon } from "@assets/svg/files/chev-icon.svg";
import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { ChangeEvent, Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
import { useAppSelector } from "@redux/Store";
import { CustomCopy } from "@components/tooltip";
import { shortAddress } from "@common/utils/icrc";
import { CustomInput } from "@components/input";
import { Contact } from "@redux/models/ContactsModels";
import { getInitialFromName } from "@common/utils/strings";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import DeleteContactModal from "./ICRC/DeleteContactModal";
import logger from "@common/utils/logger";
import clsx from "clsx";

interface ContactListProps {
  contactSearchKey: string;
  assetFilter: string[];
}

// QUESTION: Should we pass the contactSearchKey and assetFilter as context state?
const ContactList = ({ assetFilter, contactSearchKey }: ContactListProps) => {
  // const [deleteModal, setDeleteModal] = useState(false);
  // const [deleteType, setDeleteType] = useState<DeleteContactTypeEnum>(DeleteContactTypeEnum.Enum.ASSET);
  // const [openSubaccToken, setOpenSubaccToken] = useState("");
  // const [subaccEditedErr, setSubaccEditedErr] = useState<SubAccountContactErr>({
  //   name: false,
  //   subaccount_index: false,
  // });
  // const [deleteObject, setDeleteObject] = useState<NewContactSubAccount>({
  //   principal: "",
  //   name: "",
  //   tokenSymbol: "",
  //   symbol: "",
  //   subaccIdx: "",
  //   subaccName: "",
  //   totalAssets: 0,
  //   TotalSub: 0,
  // });
  // const [subaccEdited, setSubaccEdited] = useState<SubAccountContact>({
  //   name: "",
  //   subaccount_index: "",
  //   sub_account_id: "",
  //   allowance: { allowance: "", expires_at: "" },
  // });

  // ---------------------- CONTACT EDITING ----------------------
  const { contacts } = useAppSelector((state) => state.contacts);
  const { t } = useTranslation();

  const [contactDropdown, setContactDropdown] = useState<Contact | null>(null);
  const [contactEdited, setContactEdited] = useState<Contact | null>(null);
  const [contactNameInvalid, setContactNameInvalid] = useState(false);

  // ---------------------------------------------

  return (
    <Fragment>
      <div className="flex flex-col w-full h-full mt-3 scroll-y-light max-h-[calc(100vh-12rem)]">
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
            {getFilteredContacts().map((contact, idx) => {

              const hasContactAllowance = contact?.assets.some((asset) =>
                asset.subaccounts.some((subaccount) => subaccount?.allowance?.allowance),
              );

              const isCurrentContactDropdownOpen = contactDropdown?.principal === contact.principal;
              const isCurrentContactEdited = contactEdited?.principal === contact.principal;

              return (
                <Fragment key={contact.principal}>
                  <tr className={getRowStyles(contact)}>
                    <td>
                      <div className="relative flex flex-row items-center justify-start w-full gap-2 px-4 min-h-14">

                        {(isCurrentContactDropdownOpen
                          // isCurrentContactEdited ||
                          // contact.principal === openAssetsPrin 
                          // isCurrentContactEditedAddAsst
                        ) && (
                            <div className="absolute left-0 w-1 h-14 bg-SelectRowColor"></div>
                          )}

                        {isCurrentContactEdited ? (
                          <CustomInput
                            intent={"primary"}
                            border={contactNameInvalid ? "error" : "selected"}
                            sizeComp={"xLarge"}
                            sizeInput="small"
                            onChange={onContactNameChange}
                            value={contactEdited?.name || ""}
                          />
                        ) : null}

                        {!isCurrentContactEdited ? (
                          <div className="flex flex-row items-center justify-start w-full gap-2">
                            <div className={`flex justify-center items-center !min-w-[2rem] w-8 h-8 rounded-md ${getContactColor(idx)}`}>
                              <p className="text-PrimaryTextColor">{getInitialFromName(contact.name, 2)}</p>
                            </div>
                            <p className="text-left opacity-70 break-words max-w-[14rem]" onDoubleClick={() => onEditContact(contact)}>{contact.name}</p>
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

                        {isCurrentContactEdited && (
                          <CheckIcon
                            onClick={() => onSaveContact(contact)}
                            className="w-4 h-4 opacity-50 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
                          />
                        )}

                        {isCurrentContactEdited ? (
                          <CloseIcon
                            onClick={onCancelContactEdit}
                            className="w-5 h-5 opacity-50 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
                          />
                        ) : (
                          <DeleteContactModal contact={contact} />
                        )}

                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex flex-row items-start justify-center w-full gap-2">
                        <ChevIcon
                          onClick={() => onOpenDropdown(contact)}
                          className={`w-8 h-8 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor stroke-0  cursor-pointer ${contactDropdown?.principal === contact.principal ? "" : "rotate-90"
                            }`}
                        />
                      </div>
                    </td>
                  </tr>
                  {isCurrentContactDropdownOpen && (
                    <tr className="bg-SecondaryColorLight dark:bg-SecondaryColor">
                      <td colSpan={4} className="w-full h-4 border-BorderColorTwoLight dark:border-BorderColorTwo">
                        <div>Dropdown</div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Fragment>
  );

  function getRowStyles(contact: Contact) {
    return clsx({
      ["border-b border-BorderColorTwoLight dark:border-BorderColorTwo"]: true,
      ["bg-SecondaryColorLight dark:bg-SecondaryColor"]: contactDropdown?.principal === contact.principal && contactEdited?.principal !== contact.principal,
      ["bg-SelectRowColor/10"]: contactEdited?.principal === contact.principal
    });
  }

  function onOpenDropdown(contact: Contact) {
    const isSelectedDifferent = contactDropdown?.principal !== contact.principal;
    if (contactDropdown && !isSelectedDifferent) setContactDropdown(null);
    else setContactDropdown(contact);
  }

  function onCancelContactEdit() {
    setContactEdited(null);
    setContactNameInvalid(false);
  }

  function onSaveContact(contact: Contact) {
    if (!contactEdited) return;

    const isNameInValid = contactEdited.name.trim() === "";
    setContactNameInvalid(isNameInValid);
    if (isNameInValid) return;

    try {
      const accountIdentifier = AccountIdentifier.fromPrincipal({ principal: Principal.fromText(contactEdited.principal) }).toHex();
      // QUESTION: Should we spred the contact and update the assets?
      // const updatedContact = {
      //   ...contactEdited,
      //   assets: contact.assets,
      //   accountIdentifier,
      // };
      console.log({ ...contact, ...contactEdited, accountIdentifier });
      // updateContact(updatedContact, contact.principal);
    } catch (error) {
      logger.debug("Error saving contact", error);
    };
  }

  function onEditContact(contact: Contact) {
    setContactEdited(contact);
    setContactNameInvalid(false);
  }

  function getContactColor(idx: number) {
    if (idx % 3 === 0) return "bg-ContactColor1";
    else if (idx % 3 === 1) return "bg-ContactColor2";
    else return "bg-ContactColor3";
  }

  function onContactNameChange(e: ChangeEvent<HTMLInputElement>) {
    setContactEdited((prev: any) => {
      return { ...prev, name: e.target.value };
    });

    setContactNameInvalid(false);
  }

  function getFilteredContacts() {
    const searchTerm = contactSearchKey.trim().toLowerCase();

    const filtedContacts = contacts.filter((currentContact) => {
      const nameMatch = currentContact.name.toLowerCase().includes(searchTerm);
      const principalMatch = currentContact.principal.toLowerCase().includes(searchTerm);

      const subAccountNameMatch = currentContact.assets.some((asset) => {
        return asset.subaccounts.some((subaccount) => {
          return subaccount.name.toLowerCase().includes(searchTerm);
        });
      });

      const assetFilterMatch = assetFilter.length === 0 || currentContact.assets.some((asset) => {
        return assetFilter.includes(asset.symbol);
      });

      return nameMatch || principalMatch || subAccountNameMatch || assetFilterMatch;
    });

    return filtedContacts;
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
};

export default ContactList;
