// svg
import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { useCreateContact } from "@pages/contacts/hooks/useCreateContact";
import usePrincipalValidator from "@pages/contacts/hooks/usePrincipalValidator";
import { GeneralHook } from "@pages/home/hooks/generalHook";
import { useAppDispatch } from "@redux/Store";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ContactMainDetails from "./ContactMainDetails";
import ContactAssetDetails from "./ContactAssetDetails";
import LoadingLoader from "@components/Loader";
import { CustomButton } from "@components/Button";
import { retrieveSubAccountsWithAllowance, retrieveAssetsWithAllowance } from "@/pages/home/helpers/icrc";
import { addContact } from "@redux/contacts/ContactsReducer";
import { AssetContact } from "@redux/models/ContactsModels";
import { isHexadecimalValid, validateSubaccounts } from "@/utils/checkers";
import clsx from "clsx";
import { validatePrincipal } from "@/utils/identity";
import { SupportedStandardEnum } from "@/@types/icrc";

interface AddContactProps {
  setAddOpen(value: boolean): void;
}

export default function AddContact({ setAddOpen }: AddContactProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [isAllowancesChecking, setIsAllowancesChecking] = useState<boolean>(false);
  const { assets, asciiHex } = GeneralHook();
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

  const isAssetICRC2Supported = useMemo(() => {
    const fullAsset = assets.find((asset) => asset.tokenSymbol === selAstContact);
    return fullAsset?.supportedStandards?.includes(SupportedStandardEnum.Values["ICRC-2"]);
  }, [assets, selAstContact]);

  return (
    <div className="relative flex flex-col items-start justify-start w-full gap-4 text-md">
      <CloseIcon
        className={getCloseIconStyles(isCreating)}
        onClick={() => {
          setAddOpen(false);
        }}
      />
      <p>{t("add.contact")}</p>

      <ContactMainDetails
        newContact={newContact}
        setNewContact={setNewContact}
        setNewContactErr={setNewContactErr}
        newContactNameErr={newContactNameErr}
        setNewContactNameErr={setNewContactNameErr}
        newContactPrinErr={newContactPrinErr}
        setNewContactPrinErr={setNewContactPrinErr}
      />

      <ContactAssetDetails
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
        setSelAstContact={setSelAstContact}
      />
      {/* TODO: test adding an no supported asset */}
      <div className="flex flex-row items-center justify-end w-full gap-3">
        <p className="text-TextErrorColor">{newContactErr ? t(newContactErr) : ""}</p>
        {(isAllowancesChecking || isCreating) && <LoadingLoader />}
        {isAssetICRC2Supported && (
          <CustomButton
            className="bg-BorderSuccessColor min-w-[5rem] flex justify-between items-center"
            onClick={onAllowanceNewContactCheck}
            disabled={isAllowancesChecking || isCreating}
          >
            <MoneyHandIcon className="fill-PrimaryColorLight" /> {t("test")}
          </CustomButton>
        )}
        <CustomButton className="min-w-[5rem]" onClick={onAddContact} disabled={isCreating || isAllowancesChecking}>
          <p>{t("add.contact")}</p>
        </CustomButton>
      </div>
    </div>
  );

  async function onAllowanceNewContactCheck() {
    // TODO: if current asset not support, jump this case
    try {
      setIsAllowancesChecking(true);

      if (!validatePrincipal(newContact.principal)) {
        setNewContactPrinErr(true);
        return;
      }
      setNewContactPrinErr(false);

      for (let index = 0; index < newSubAccounts.length; index++) {
        const subAccount = newSubAccounts[index];

        const isSubAccountDuplicated =
          newSubAccounts.filter((currentSubAccount) => subAccount.sub_account_id === currentSubAccount.sub_account_id)
            .length > 1;
        //
        if (subAccount.name.trim().length === 0) {
          setNewContactSubNameErr([index]);
          return;
        }

        if (!isHexadecimalValid(subAccount.sub_account_id) || isSubAccountDuplicated) {
          setNewContactSubIdErr([index]);
          return;
        }
      }
      setNewContactSubNameErr([]);
      setNewContactSubIdErr([]);

      const { address, decimal } = assets.filter((asset) => asset.tokenSymbol === selAstContact)[0];
      if (!address || !decimal) return;

      const fullSubAccounts = await retrieveSubAccountsWithAllowance({
        accountPrincipal: newContact.principal,
        subAccounts: newSubAccounts,
        assetAddress: address,
        assetDecimal: decimal,
      });

      setNewSubaccounts(fullSubAccounts);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAllowancesChecking(false);
    }
  }

  async function isValidSubacc(from: string, validContact: boolean, contAst?: AssetContact) {
    const { auxNewSub, errName, errId, validSubaccounts } = validateSubaccounts(newSubAccounts);
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
        const result = await retrieveAssetsWithAllowance({
          accountPrincipal: newContact.principal,
          assets: newContact.assets,
        });

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
}

function getCloseIconStyles(isCreating: boolean) {
  return clsx(
    "absolute cursor-pointer top-5 right-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor",
    isCreating && "opacity-50 pointer-events-none",
  );
}
