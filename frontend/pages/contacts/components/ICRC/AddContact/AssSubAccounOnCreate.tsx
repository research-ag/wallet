import { CustomInput } from "@components/input";
import { checkHexString } from "@/utils";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-empty.svg";
import { SubAccountContact } from "@redux/models/ContactsModels";
import { useTranslation } from "react-i18next";
import AllowanceTooltip from "../AllowanceTooltip";

interface AddSubAccountOnCreateProps {
  newContactSubNameErr: number[];
  newContactSubIdErr: number[];
  asciiHex: string[];
  newSubAccounts: SubAccountContact[];
  selAstContact: string;
  setNewContactSubIdErr: any;
  setNewContactSubNameErr: any;
  setNewContactErr: any;
  setNewSubaccounts: any;
  setNewContact: any;
}

export default function AddSubAccountOnCreate(props: AddSubAccountOnCreateProps) {
  const { t } = useTranslation();
  const {
    newContactSubNameErr,
    newContactSubIdErr,
    setNewContactSubIdErr,
    asciiHex,
    setNewContactSubNameErr,
    setNewContactErr,
    newSubAccounts,
    setNewSubaccounts,
    selAstContact,
  } = props;

  return (
    <div className="flex flex-col items-start justify-start w-full h-full gap-4 p-3 bg-SecondaryColorLight dark:bg-SecondaryColor">
      <p>{`${t("sub-acc")} (${newSubAccounts.length})`}</p>
      <div className="flex flex-row justify-start items-start w-full gap-2 max-h-[15rem] scroll-y-light">
        <div className="flex flex-col items-start justify-start w-full gap-2">
          <p className="opacity-60">{t("name.sub.account")}</p>
          {newSubAccounts.map((newSA, k) => {
            console.log("newSA: ", newSA);
            return (
              <div key={k} className="relative flex items-center justify-between w-full">
                {newSA?.allowance?.allowance ? (
                  <AllowanceTooltip
                    amount={newSA.allowance?.allowance}
                    expiration={newSA.allowance.expires_at}
                    tokenSymbol={selAstContact}
                  />
                ) : (
                  <div className="w-8 h-4"></div>
                )}
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

        <div className="flex flex-col justify-start items-start w-[80%] gap-2">
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
  );

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
      auxSubs[k].sub_account_id = value.includes("0x") ? value.trim() : `0x${value.trim()}`;
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
