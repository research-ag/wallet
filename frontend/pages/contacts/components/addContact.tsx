// svg
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-empty.svg";
//
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CustomInput } from "@components/Input";
import { useContacts } from "../hooks/contactsHook";
import { CustomButton } from "@components/Button";
import ContactAssetPop from "./contactAssetPop";
import { GeneralHook } from "@pages/home/hooks/generalHook";
import { AssetContact, Contact, SubAccountContact } from "@redux/models/ContactsModels";
import { useAppDispatch } from "@redux/Store";
import { addContact } from "@redux/contacts/ContactsReducer";
import { checkHexString, removeLeadingZeros } from "@/utils";
import ContactAssetElement from "./contactAssetElement";
import { AssetToAdd } from "@redux/models/AccountModels";
import { Principal } from "@dfinity/principal";

interface AddContactProps {
  setAddOpen(value: boolean): void;
}

const AddContact = ({ setAddOpen }: AddContactProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
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
  const { assets, getAssetIcon, asciiHex } = GeneralHook();

  return (
    <Fragment>
      <div className="reative flex flex-col justify-start items-start w-full gap-4 text-md">
        <CloseIcon
          className="absolute top-5 right-5 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={() => {
            setAddOpen(false);
          }}
        />
        <p>{t("add.contact")}</p>
        <div className="flex flex-row justify-start items-start w-full gap-3">
          <div className="flex flex-col justify-start items-start w-[50%]">
            <p>{t("name")}</p>
            <CustomInput
              sizeInput={"medium"}
              placeholder={""}
              border={newContactNameErr ? "error" : undefined}
              value={newContact.name}
              onChange={(e) => {
                onNameChange(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col justify-start items-start w-full">
            <p>{"Principal"}</p>
            <CustomInput
              sizeInput={"medium"}
              placeholder={""}
              border={newContactPrinErr ? "error" : undefined}
              value={newContact.principal}
              onChange={(e) => {
                onPrincipalChange(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex flex-row justify-center items-center w-full h-72 rounded-sm bg-ThirdColorLight dark:bg-ThirdColor gap-3">
          {newContact.assets.length === 0 ? (
            <ContactAssetPop
              assets={assets}
              getAssetIcon={getAssetIcon}
              onAdd={(data) => {
                assetToAddEmpty(data);
              }}
            />
          ) : (
            <div className="flex flex-row justify-start items-start w-full h-full">
              <div className="flex flex-col justify-start items-start w-[70%] h-full">
                <div className="flex flex-row justify-between items-center w-full p-3">
                  <p className="whitespace-nowrap">{t("add.assets")}</p>
                  {assets.filter((ast) => {
                    let isIncluded = false;
                    for (let index = 0; index < newContact.assets.length; index++) {
                      if (newContact.assets[index].tokenSymbol === ast.tokenSymbol) {
                        isIncluded = true;
                        break;
                      }
                    }
                    return !isIncluded;
                  }).length != 0 && (
                    <ContactAssetPop
                      assets={assets.filter((ast) => {
                        let isIncluded = false;
                        newContact.assets.map((contAst) => {
                          if (ast.tokenSymbol === contAst.tokenSymbol) isIncluded = true;
                        });
                        return !isIncluded;
                      })}
                      compClass="flex flex-row justify-end items-center w-full"
                      getAssetIcon={getAssetIcon}
                      onAdd={(data) => {
                        assetToAdd(data);
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-col w-full h-full scroll-y-light">
                  {newContact.assets.map((contAst, k) => {
                    return (
                      <ContactAssetElement
                        key={k}
                        contAst={contAst}
                        k={k}
                        selAstContact={selAstContact}
                        isValidSubacc={() => {
                          isValidSubacc("change", true, contAst);
                        }}
                        isAvailableAddContact={isAvailableAddContact}
                        newSubAccounts={newSubAccounts}
                        setNewSubaccounts={setNewSubaccounts}
                      ></ContactAssetElement>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col justify-start items-start w-full h-full p-3 bg-SecondaryColorLight dark:bg-SecondaryColor gap-4">
                <p>{`${t("sub-acc")} (${newSubAccounts.length})`}</p>
                <div className="flex flex-row justify-start items-start w-full gap-2 max-h-[15rem] scroll-y-light">
                  <div className="flex flex-col justify-start items-start w-full gap-2">
                    <p className="opacity-60">{t("name.sub.account")}</p>
                    {newSubAccounts.map((newSA, k) => {
                      return (
                        <CustomInput
                          key={k}
                          sizeInput={"small"}
                          sizeComp={"small"}
                          intent={"primary"}
                          border={newContactSubNameErr.includes(k) ? "error" : undefined}
                          placeholder={t("name")}
                          value={newSA.name}
                          onChange={(e) => {
                            onChangeSubName(e.target.value, k);
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="flex flex-col justify-start items-start w-[40%] gap-2">
                    <p className="opacity-60">{t("sub-acc")}</p>
                    {newSubAccounts.map((newSA, k) => {
                      return (
                        <div key={k} className="flex flex-row justify-start items-center w-full gap-2">
                          <CustomInput
                            sizeInput={"small"}
                            sizeComp={"small"}
                            intent={"primary"}
                            border={newContactSubIdErr.includes(k) ? "error" : undefined}
                            placeholder={"Hex"}
                            value={newSA.subaccount_index}
                            onChange={(e) => {
                              onchangeSubIdx(e.target.value, k);
                            }}
                            onKeyDown={(e) => {
                              onKeyPressSubIdx(e, newSA);
                            }}
                          />
                          <TrashIcon
                            onClick={() => {
                              onDeleteSubAccount(k);
                            }}
                            className="w-5 h-5 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-end items-center w-full gap-3">
          <p className="text-TextErrorColor">{t(newContactErr)}</p>
          <CustomButton className="min-w-[5rem]" onClick={onAddContact}>
            <p>{t("add.contact")}</p>
          </CustomButton>
        </div>
      </div>
    </Fragment>
  );

  function isAvailableAddContact() {
    let isAvailable = true;
    const ids: string[] = [];

    for (let index = 0; index < newSubAccounts.length; index++) {
      const newSa = newSubAccounts[index];
      let subAccIdx = "";
      if (removeLeadingZeros(newSa.subaccount_index.trim()) === "") {
        if (newSa.subaccount_index.length !== 0) subAccIdx = "0";
      } else subAccIdx = removeLeadingZeros(newSa.subaccount_index.trim());

      if (newSa.name.trim() === "") {
        isAvailable = false;
        break;
      }

      if (subAccIdx === "" || ids.includes(subAccIdx)) {
        isAvailable = false;
        break;
      } else {
        ids.push(subAccIdx);
      }
    }
    return isAvailable;
  }

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

  function onNameChange(value: string) {
    setNewContact((prev) => {
      return { ...prev, name: value };
    });
    setNewContactErr("");
    setNewContactNameErr(false);
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

  function assetToAdd(data: AssetToAdd[]) {
    setNewContact((prev) => {
      return {
        ...prev,
        assets: [
          ...prev.assets,
          ...data.map((ata) => {
            return {
              symbol: ata.symbol,
              subaccounts: [],
              tokenSymbol: ata.tokenSymbol,
              logo: ata.logo,
            };
          }),
        ],
      };
    });
  }

  function onChangeSubName(value: string, k: number) {
    const auxSubs = [...newSubAccounts];
    auxSubs[k].name = value;
    setNewSubaccounts(auxSubs);
    setNewContactSubNameErr([...newContactSubNameErr].filter((num) => num !== k));
    setNewContactErr("");
  }

  function onchangeSubIdx(value: string, k: number) {
    if (checkHexString(value)) {
      const auxSubs = [...newSubAccounts];
      auxSubs[k].subaccount_index = value.trim();
      setNewSubaccounts(auxSubs);
      setNewContactSubIdErr([...newContactSubIdErr].filter((num) => num !== k));
      setNewContactErr("");
    }
  }

  function onKeyPressSubIdx(e: React.KeyboardEvent<HTMLInputElement>, newSA: SubAccountContact) {
    if (!asciiHex.includes(e.key)) {
      e.preventDefault();
    }
    if (newSA.subaccount_index.includes("0x") || newSA.subaccount_index.includes("0X")) {
      if (e.key === "X" || e.key == "x") {
        e.preventDefault();
      }
    }
  }

  function onDeleteSubAccount(k: number) {
    const auxSubs = [...newSubAccounts];
    auxSubs.splice(k, 1);
    setNewSubaccounts(auxSubs);
    setNewContactErr("");
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
