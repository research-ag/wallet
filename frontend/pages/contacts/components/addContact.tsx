// svg
import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateContact } from "../hooks/useCreateContact";
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
import usePrincipalValidator from "../hooks/usePrincipalValidator";
import { hasSubAccountAllowances, hasSubAccountAssetAllowances } from "@/helpers/icrc";
import LoadingLoader from "@components/Loader";
import { formatSubAccountIds } from "@/utils/checkers";

interface AddContactProps {
  setAddOpen(value: boolean): void;
}

const AddContact = ({ setAddOpen }: AddContactProps) => {
  const [isAllowancesChecking, setIsAllowancesChecking] = useState<boolean>(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { assets, getAssetIcon, asciiHex } = GeneralHook();
  const { checkPrincipalValid } = usePrincipalValidator();

  const {
    isCreating,
    setIsCreating,
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
  } = useCreateContact();

  async function onAllowanceNewContactCheck() {
    try {
      setIsAllowancesChecking(true);
      if (newContact.assets.length === 0 || !newContact.principal) return;

      const { address, decimal } = assets.filter((asset) => asset.tokenSymbol === selAstContact)[0];

      if (!address || !decimal) return;

      const { formattedSubAccounts, subAccountNamesErrors, subAccountIdsErrors } = formatSubAccountIds(newSubAccounts);

      if (formattedSubAccounts.length === 0 || subAccountNamesErrors.length > 0 || subAccountIdsErrors.length > 0)
        return;
      const fullSubAccounts = await hasSubAccountAllowances(
        newContact.principal,
        formattedSubAccounts,
        address,
        decimal,
      );
      setNewSubaccounts(fullSubAccounts);
    } catch (error) {
      console.log(error);
    } finally {
      setIsAllowancesChecking(false);
    }
  }

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
          {isAllowancesChecking && <LoadingLoader />}
          <CustomButton
            className="bg-BorderSuccessColor min-w-[5rem] flex justify-between items-center"
            onClick={onAllowanceNewContactCheck}
            disabled={isAllowancesChecking || isCreating}
          >
            <MoneyHandIcon className="fill-PrimaryColorLight" /> {t("test")}
          </CustomButton>
          <CustomButton className="min-w-[5rem]" onClick={onAddContact} disabled={isCreating}>
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
            tokenSymbol: ata.tokenSymbol,
            subaccounts: [],
            logo: ata.logo,
            address: ata.address,
            decimal: ata.decimal,
            shortDecimal: ata.shortDecimal,
            hasAllowance: ata.hasAllowance,
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
          auxAsset.subaccounts.length === 0
            ? [{ name: "", subaccount_index: "", sub_account_id: "" }]
            : auxAsset.subaccounts,
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

  function validateSubaccounts(newSubAccounts: SubAccountContact[]) {
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
        if (valid) auxNewSub.push({ name: newSa.name.trim(), subaccount_index: subacc, sub_account_id: newSa.sub_account_id, allowance: newSa.allowance });
      }
    });

    return { auxNewSub, errName, errId, validSubaccounts };
  }

  async function isValidSubacc(from: string, validContact: boolean, contAst?: AssetContact) {
    const { auxNewSub, errName, errId, validSubaccounts } = validateSubaccounts(newSubAccounts);
    console.log("BUTE", newContact.assets);

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
      if (from === "change" && contAst) {
        // INFO: change asset tab
        setNewContact(auxContact);
        setSelAstContact(contAst.tokenSymbol);
        setNewSubaccounts(
          contAst.subaccounts.length === 0
          ? [{ name: "", subaccount_index: "", sub_account_id: "" }]
          : contAst.subaccounts,
          );
        } else {
        // INFO: create contact into redux and local storage
        setIsCreating(true);
        const result = await hasSubAccountAssetAllowances(newContact.principal, newContact.assets);
        const toStoreContact = {
          ...auxContact,
          assets: result,
        };
        dispatch(addContact(toStoreContact));
        setIsCreating(false);
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
