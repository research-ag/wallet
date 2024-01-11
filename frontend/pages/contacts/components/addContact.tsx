// svg
import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useContacts } from "../hooks/contactsHook";
import { CustomButton } from "@components/Button";
import ContactAssetPop from "./contactAssetPop";
import { GeneralHook } from "@pages/home/hooks/generalHook";
import { AssetContact, Contact, SubAccountContact } from "@redux/models/ContactsModels";
import { useAppDispatch } from "@redux/Store";
import { addContact } from "@redux/contacts/ContactsReducer";
import { AssetToAdd } from "@redux/models/AccountModels";
import { Principal } from "@dfinity/principal";
import NameFormItem from "./AddContact/NameFormItem";
import PrincipalFormItem from "./AddContact/PrincipalFormItem";
import SubAccountFormItem from "./AddContact/SubAccountFormItem";
import { removeLeadingZeros } from "@/utils";

interface AddContactProps {
  setAddOpen(value: boolean): void;
}

const AddContact = ({ setAddOpen }: AddContactProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { assets, getAssetIcon, asciiHex } = GeneralHook();

  const {
    newContact,
    setNewContact,
    selAstContact,
    setSelAstContact,
    newSubAccounts,
    setNewSubaccounts,
    newContactErr,
    setNewContactErr,
    newContactNameErr,
    setNewContactNameErr,
    newContactPrinErr,
    setNewContactPrinErr,
    newContactSubNameErr,
    setNewContactSubNameErr,
    newContactSubIdErr,
    setNewContactSubIdErr,
    checkPrincipalValid,
  } = useContacts();

  return (
    <Fragment>
      <div className="relative flex flex-col items-start justify-start w-full gap-4 text-md">
        <CloseIcon
          className="absolute cursor-pointer top-5 right-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={() => {
            setAddOpen(false);
          }}
        />
        <p>{t("add.contact")}</p>
        <div className="flex flex-row items-start justify-start w-full gap-3">
          <NameFormItem newContactNameErr={newContactNameErr} newContact={newContact} onNameChange={onNameChange} />
          <PrincipalFormItem
            newContactPrinErr={newContactPrinErr}
            newContact={newContact}
            onPrincipalChange={onPrincipalChange}
          />
        </div>

        <div className="flex flex-row items-center justify-center w-full gap-3 rounded-sm h-72 bg-ThirdColorLight dark:bg-ThirdColor">
          {newContact.assets.length === 0 ? (
            <ContactAssetPop
              assets={assets}
              getAssetIcon={getAssetIcon}
              onAdd={(data) => {
                assetToAddEmpty(data);
              }}
            />
          ) : (
            <SubAccountFormItem
              assets={assets}
              newContact={newContact}
              selAstContact={selAstContact}
              isValidSubacc={isValidSubacc}
              newSubAccounts={newSubAccounts}
              setNewSubaccounts={setNewSubaccounts}
              newContactSubNameErr={newContactSubNameErr}
              newContactSubIdErr={newContactSubIdErr}
              setNewContact={setNewContact}
              setNewContactSubNameErr={setNewContactSubNameErr}
              setNewContactErr={setNewContactErr}
              setNewContactSubIdErr={setNewContactSubIdErr}
              asciiHex={asciiHex}
            />
          )}
        </div>

        <div className="flex flex-row items-center justify-end w-full gap-3">
          <p className="text-TextErrorColor">{t(newContactErr)}</p>
          <CustomButton className="bg-BorderSuccessColor min-w-[5rem] flex justify-between items-center">
            <MoneyHandIcon className="fill-PrimaryColorLight" /> {t("test")}
          </CustomButton>
          <CustomButton className="min-w-[5rem]" onClick={onAddContact}>
            <p>{t("add.contact")}</p>
          </CustomButton>
        </div>
      </div>
    </Fragment>
  );

  function assetToAddEmpty(data: AssetToAdd[]) {
    let auxConatct: Contact = {
      name: "",
      principal: "",
      assets: [],
    };
    setNewContact((prev) => {
      auxConatct = {
        ...prev,
        assets: data.map((ata) => {
          return {
            symbol: ata.symbol,
            subaccounts: [],
            tokenSymbol: ata.tokenSymbol,
            logo: ata.logo,
          };
        }),
      };
      return auxConatct;
    });
    if (data[0]) {
      setSelAstContact(data[0].tokenSymbol);
      const auxAsset = auxConatct.assets.find((ast) => ast.tokenSymbol === data[0].tokenSymbol);
      if (auxAsset)
        setNewSubaccounts(
          auxAsset.subaccounts.length === 0 ? [{ name: "", subaccount_index: "" }] : auxAsset.subaccounts,
        );
    }
  }

  function onPrincipalChange(value: string) {
    setNewContact((prev) => {
      return { ...prev, principal: value };
    });
    setNewContactErr("");
    if (value.trim() !== "")
      try {
        Principal.fromText(value);
        setNewContactPrinErr(false);
      } catch {
        setNewContactPrinErr(true);
      }
    else setNewContactPrinErr(false);
  }

  function onNameChange(value: string) {
    setNewContact((prev) => {
      return { ...prev, name: value };
    });
    setNewContactErr("");
    setNewContactNameErr(false);
  }

  // ----------------------------- here ------------------------------------

  function isValidSubacc(from: string, validContact: boolean, contAst?: AssetContact) {
    const auxNewSub: SubAccountContact[] = [];
    const errName: number[] = [];
    const errId: number[] = [];
    let validSubaccounts = true;
    const ids: string[] = [];
    newSubAccounts.map((newSa, j) => {
      let subacc = newSa.subaccount_index.trim();
      // Check if string contains prefix "0x" and remove it if is the case
      if (subacc.slice(0, 2).toLowerCase() === "0x") subacc = subacc.substring(2);
      // Check if subaccount have data
      if (newSa.name.trim() !== "" || newSa.subaccount_index.trim() !== "") {
        // Removing zeros and check if subaccount index is not empty
        if (removeLeadingZeros(subacc) === "") {
          if (newSa.subaccount_index.length !== 0) subacc = "0";
        } else subacc = removeLeadingZeros(subacc);
        let valid = true;
        // Pushing position index of subaccounts that contains errors in the name (empty)
        if (newSa.name.trim() === "") {
          errName.push(j);
          valid = false;
          validSubaccounts = false;
        }
        // Pushing position index of sub
        if (subacc === "" || newSa.subaccount_index.trim().toLowerCase() === "0x" || ids.includes(subacc)) {
          errId.push(j);
          valid = false;
          validSubaccounts = false;
        } else {
          ids.push(subacc);
        }
        // Adding SubAccountContact to the new contact
        if (valid) auxNewSub.push({ name: newSa.name.trim(), subaccount_index: subacc });
      }
    });
    // Check if valid Subaccounts and Valid prev contact info
    if (validSubaccounts && validContact) {
      const auxContact = { ...newContact };
      let editKey = 0;
      // Setting subaccount to the selected asset
      for (let index = 0; index < auxContact.assets.length; index++) {
        if (auxContact.assets[index].tokenSymbol === selAstContact) {
          editKey = index;
          break;
        }
      }
      if (auxContact.assets.length > 0) auxContact.assets[editKey].subaccounts = auxNewSub;
      // Verify if is an asset change or Add Contact action
      if (from === "change" && contAst) {
        setNewContact(auxContact);
        setSelAstContact(contAst.tokenSymbol);
        setNewSubaccounts(
          contAst.subaccounts.length === 0 ? [{ name: "", subaccount_index: "" }] : contAst.subaccounts,
        );
      } else {
        dispatch(addContact(auxContact));
        setAddOpen(false);
      }
      setNewContactSubNameErr([]);
      setNewContactSubIdErr([]);
      setNewContactErr("");
    } else {
      // Set errors and error message
      setNewContactSubNameErr(errName);
      setNewContactSubIdErr(errId);
      if (errName.length > 0 || errId.length > 0) setNewContactErr("check.add.contact.subacc.err");
    }
    return { validSubaccounts, auxNewSub, errName, errId };
  }

  function onAddContact() {
    let validContact = true;
    let err = { msg: "", name: false, prin: false };
    if (newContact.name.trim() === "" && newContact.principal.trim() === "") {
      validContact = false;
      err = { msg: "check.add.contact.both.err", name: true, prin: true };
    } else {
      if (newContact.name.trim() === "") {
        validContact = false;
        err = { ...err, msg: "check.add.contact.name.err", name: true };
      }
      if (newContact.principal.trim() === "") {
        validContact = false;
        err = { ...err, msg: "check.add.contact.prin.empty.err", prin: true };
      } else if (!checkPrincipalValid(newContact.principal)) {
        validContact = false;
        err = { ...err, msg: "check.add.contact.prin.err", prin: true };
      }
    }
    setNewContactErr(err.msg);
    setNewContactNameErr(err.name);
    setNewContactPrinErr(err.prin);
    isValidSubacc("add", validContact);
  }
};

export default AddContact;
