import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-empty.svg";
import { Asset, AssetToAdd } from "@redux/models/AccountModels";
import { AssetContact, Contact, SubAccountContact } from "@redux/models/ContactsModels";
import ContactAssetPop from "../contactAssetPop";
import { useTranslation } from "react-i18next";
import ContactAssetElement from "../contactAssetElement";
import { CustomInput } from "@components/Input";
import { getAssetIcon } from "@/utils/icons";

interface SubAccountFormItemProps {
  assets: Array<Asset>;
  newContact: Contact;
  assetToAdd: (data: AssetToAdd[]) => void;
  selAstContact: any;
  isValidSubacc: (from: string, validContact: boolean, contAst?: AssetContact) => any;
  newSubAccounts: SubAccountContact[];
  isAvailableAddContact: () => boolean;
  setNewSubaccounts: any;
  newContactSubNameErr: number[];
  onChangeSubName: (value: string, k: number) => void;
  newContactSubIdErr: number[];
  onchangeSubIdx: (value: string, k: number) => void;
  onKeyPressSubIdx: (e: React.KeyboardEvent<HTMLInputElement>, newSA: SubAccountContact) => void;
  onDeleteSubAccount: (k: number) => void;
}

export default function SubAccountFormItem(props: SubAccountFormItemProps) {
  const { t } = useTranslation();
  const {
    assetToAdd,
    isValidSubacc,
    isAvailableAddContact,
    onChangeSubName,
    onchangeSubIdx,
    onKeyPressSubIdx,
    onDeleteSubAccount,
    assets,
    newContact,
    selAstContact,
    newSubAccounts,
    setNewSubaccounts,
    newContactSubNameErr,
    newContactSubIdErr,
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
}
