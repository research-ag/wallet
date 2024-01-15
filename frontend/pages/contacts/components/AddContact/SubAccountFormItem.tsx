import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-empty.svg";
import { Asset, AssetToAdd } from "@redux/models/AccountModels";
import { AssetContact, Contact, SubAccountContact } from "@redux/models/ContactsModels";
import ContactAssetPop from "../contactAssetPop";
import { useTranslation } from "react-i18next";
import ContactAssetElement from "../contactAssetElement";
import { CustomInput } from "@components/Input";
import { getAssetIcon } from "@/utils/icons";
import { checkHexString, removeLeadingZeros } from "@/utils";
import AllowanceTooltip from "../AllowanceTooltip";

interface SubAccountFormItemProps {
  assets: Array<Asset>;
  newContact: Contact;
  newSubAccounts: SubAccountContact[];
  newContactSubNameErr: number[];
  newContactSubIdErr: number[];
  asciiHex: string[];
  selAstContact: string;
  isValidSubacc: (from: string, validContact: boolean, contAst?: AssetContact) => any;
  setNewSubaccounts: any;
  setNewContact: any;
  setNewContactSubNameErr: any;
  setNewContactErr: any;
  setNewContactSubIdErr: any;
}

export default function SubAccountFormItem(props: SubAccountFormItemProps) {
  const { t } = useTranslation();
  const {
    isValidSubacc,
    asciiHex,
    setNewContactSubNameErr,
    setNewContactErr,
    setNewContact,
    assets,
    newContact,
    selAstContact,
    newSubAccounts,
    setNewSubaccounts,
    newContactSubNameErr,
    newContactSubIdErr,
    setNewContactSubIdErr,
  } = props;

  return (
    <div className="flex flex-row items-start justify-start w-full h-full">
      <div className="flex flex-col justify-start items-start w-[70%] h-full">
        <div className="flex flex-row items-center justify-between w-full p-3">
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
      <div className="flex flex-col items-start justify-start w-full h-full gap-4 p-3 bg-SecondaryColorLight dark:bg-SecondaryColor">
        <p>{`${t("sub-acc")} (${newSubAccounts.length})`}</p>
        <div className="flex flex-row justify-start items-start w-full gap-2 max-h-[15rem] scroll-y-light">
          <div className="flex flex-col items-start justify-start w-full gap-2">
            <p className="opacity-60">{t("name.sub.account")}</p>
            {newSubAccounts.map((newSA, k) => {
              return (
                <div key={k} className="relative flex items-center justify-between w-full">
                  {newSA?.allowance ? (
                    <AllowanceTooltip amount={newSA.allowance?.allowance} expiration={newSA.allowance.expires_at} />
                  ) : <div className="w-8 h-4"></div>}
                  <CustomInput
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
                </div>
              );
            })}
          </div>
          <div className="flex flex-col justify-start items-start w-[40%] gap-2">
            <p className="opacity-60">{t("sub-acc")}</p>
            {newSubAccounts.map((newSA, k) => {
              return (
                <div key={k} className="flex flex-row items-center justify-start w-full gap-2">
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
                    className="w-5 h-5 cursor-pointer fill-PrimaryTextColorLight dark:fill-PrimaryTextColor"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
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

  function assetToAdd(data: AssetToAdd[]) {
    setNewContact((prev: Contact) => {
      return {
        ...prev,
        assets: [
          ...prev.assets,
          ...data.map((ata) => {
            return {
              symbol: ata.symbol,
              tokenSymbol: ata.tokenSymbol,
              logo: ata.logo,
              subaccounts: [],
              address: ata.address,
              decimal: ata.decimal,
              shortDecimal: ata.shortDecimal,
              hasAllowance: ata.hasAllowance,
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
      auxSubs[k].sub_account_id = `0x${value.trim()}`;
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
}
