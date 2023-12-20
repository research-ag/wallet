// svgs
import { ReactComponent as PencilIcon } from "@assets/svg/files/pencil.svg";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-icon.svg";
import { ReactComponent as ChevIcon } from "@assets/svg/files/chev-icon.svg";
import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { useTranslation } from "react-i18next";
import { encodeIcrcAccount } from "@dfinity/ledger";
import { getInitialFromName, hexToNumber, hexToUint8Array, removeLeadingZeros, shortAddress } from "@/utils";
import { Principal } from "@dfinity/principal";
import { CustomCopy } from "@components/CopyTooltip";
import { CustomInput } from "@components/Input";
import {
  AssetContact,
  Contact,
  NewContactSubAccount,
  SubAccountContact,
  SubAccountContactErr,
} from "@redux/models/ContactsModels";
import { DeleteContactTypeEnum } from "@/const";
import { useContacts } from "../hooks/contactsHook";
import { GeneralHook } from "@pages/home/hooks/generalHook";
import bigInt from "big-integer";

interface TableSubAccountsProps {
  asst: AssetContact;
  addSub: boolean;
  selSubaccIdx: string;
  subaccEdited: SubAccountContact;
  subaccEditedErr: SubAccountContactErr;
  cntc: Contact;
  setSubaccEdited(value: SubAccountContact): void;
  changeSubIdx(value: string): void;
  changeName(value: string): void;
  setAddSub(value: boolean): void;
  setSelSubaccIdx(value: string): void;
  setSelContactPrin(value: string): void;
  setDeleteModal(value: boolean): void;
  setDeleteType(value: DeleteContactTypeEnum): void;
  setSubaccEditedErr(value: SubAccountContactErr): void;
  setDeleteObject(value: NewContactSubAccount): void;
}

const TableSubAccounts = ({
  asst,
  addSub,
  selSubaccIdx,
  subaccEdited,
  subaccEditedErr,
  cntc,
  setSubaccEdited,
  changeSubIdx,
  changeName,
  setAddSub,
  setSelSubaccIdx,
  setSelContactPrin,
  setDeleteModal,
  setDeleteType,
  setSubaccEditedErr,
  setDeleteObject,
}: TableSubAccountsProps) => {
  const { t } = useTranslation();

  const { asciiHex } = GeneralHook();
  const { checkSubIndxValid, editCntctSubacc, addCntctSubacc } = useContacts();

  return (
    <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md ">
      {asst && (asst?.subaccounts?.length > 0 || addSub) && (
        <thead className="text-PrimaryTextColor/70">
          <tr className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            <th className="p-2 text-left w-[4.5%] "></th>
            <th className="p-2 text-left w-[5%] "></th>
            <th className="p-2 text-left w-[35%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo ">
              <p>{t("name")}</p>
            </th>
            <th className="p-2 w-[10%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo ">
              <p>{t("sub-acc")}</p>
            </th>
            <th className="p-2 w-[30%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo ">
              <p>{t("account.indentifier")}</p>
            </th>
            <th className="p-2 w-[12.5%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo "></th>
            <th className="w-[3%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo "></th>
          </tr>
        </thead>
      )}
      <tbody>
        {asst?.subaccounts?.map((sa, l) => {
          const encodedAcc = encodeIcrcAccount({
            owner: Principal.fromText(cntc.principal || ""),
            subaccount: hexToUint8Array(`0x${sa.subaccount_index}`),
          });
          return (
            <tr key={l}>
              <td></td>
              <td className="h-full">
                <div className="relative flex flex-col justify-center items-center w-full h-full">
                  <div className="w-1 h-1 bg-SelectRowColor"></div>
                  {l !== 0 && (
                    <div className="absolute bottom-0 w-1 ml-[-1px] left-1/2 border-l h-14 border-dotted border-SelectRowColor"></div>
                  )}
                </div>
              </td>
              <td
                className={`py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo ${
                  sa.subaccount_index === selSubaccIdx ? "bg-SelectRowColor/10" : ""
                }`}
              >
                <div className="relative flex flex-row justify-start items-center w-full h-10 gap-2 px-4">
                  {sa.subaccount_index === selSubaccIdx ? (
                    <CustomInput
                      intent={"primary"}
                      border={subaccEditedErr.name ? "error" : "selected"}
                      sizeComp={"xLarge"}
                      sizeInput="small"
                      value={subaccEdited.name}
                      onChange={(e) => {
                        changeName(e.target.value);
                      }}
                    />
                  ) : (
                    <div className="flex flex-row justify-start items-center w-full gap-2">
                      <div
                        className={
                          "flex justify-center items-center w-8 h-8 min-w-[2rem] min-h-[2rem] rounded-md bg-SelectRowColor"
                        }
                      >
                        <p className="text-PrimaryTextColor">{getInitialFromName(sa.name, 1)}</p>
                      </div>
                      <p className="opacity-70 break-all text-left">
                        {sa.name.length > 105 ? `${sa.name.slice(0, 105)}...` : sa.name}
                      </p>
                    </div>
                  )}
                </div>
              </td>
              <td
                className={`py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo ${
                  sa.subaccount_index === selSubaccIdx ? "bg-SelectRowColor/10" : ""
                }`}
              >
                <div className="relative flex flex-row justify-start items-center w-full h-10 gap-2 px-4">
                  {sa.subaccount_index === selSubaccIdx ? (
                    <CustomInput
                      intent={"primary"}
                      border={subaccEditedErr.subaccount_index ? "error" : "selected"}
                      sizeComp={"xLarge"}
                      sizeInput="small"
                      inputClass="text-center"
                      value={subaccEdited.subaccount_index}
                      onChange={(e) => {
                        changeSubIdx(e.target.value);
                      }}
                      onKeyDown={onKeyDownIndex}
                    />
                  ) : (
                    <div className="flex flex-row justify-center items-center gap-2 opacity-70 px-2 w-full">
                      <p className=" whitespace-nowrap">{`0x${sa.subaccount_index || "0"}`}</p>
                      <CustomCopy size={"xSmall"} className="p-0" copyText={sa.subaccount_index || "0"} />
                    </div>
                  )}
                </div>
              </td>
              <td
                className={`py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo ${
                  sa.subaccount_index === selSubaccIdx ? "bg-SelectRowColor/10" : ""
                }`}
              >
                <div className="flex flex-row justify-center items-center gap-2 opacity-70 px-2 w-full">
                  <p>{shortAddress(encodedAcc, 12, 10)}</p>
                  <CustomCopy size={"xSmall"} className="p-0" copyText={encodedAcc} />
                </div>
              </td>
              <td
                className={`py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo ${
                  sa.subaccount_index === selSubaccIdx ? "bg-SelectRowColor/10" : ""
                }`}
              >
                <div className="flex flex-row justify-center items-start gap-4 w-full">
                  {sa.subaccount_index === selSubaccIdx ? (
                    <CheckIcon
                      onClick={() => {
                        checkSubAcc(true, cntc, asst, sa);
                      }}
                      className="w-4 h-4 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor opacity-50 cursor-pointer"
                    />
                  ) : (
                    <PencilIcon
                      onClick={() => {
                        onEdit(sa);
                      }}
                      className="w-4 h-4 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor opacity-50 cursor-pointer"
                    />
                  )}
                  {sa.subaccount_index === selSubaccIdx ? (
                    <CloseIcon
                      onClick={() => {
                        setSelSubaccIdx("");
                      }}
                      className="w-5 h-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor opacity-50 cursor-pointer"
                    />
                  ) : (
                    <TrashIcon
                      onClick={() => {
                        onDelete(sa);
                      }}
                      className="w-4 h-4 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor cursor-pointer"
                    />
                  )}
                </div>
              </td>
              <td
                className={`py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo ${
                  sa.subaccount_index === selSubaccIdx ? "bg-SelectRowColor/10" : ""
                }`}
              >
                <div className="flex flex-row justify-center items-start gap-2 w-full">
                  <ChevIcon className="invisible" />
                </div>
              </td>
            </tr>
          );
        })}
        {addSub && (
          <tr>
            <td></td>
            <td className="h-full">
              <div className="relative flex flex-col justify-center items-center w-full h-full">
                <div className="w-1 h-1 bg-SelectRowColor"></div>
                <div className="absolute bottom-0 w-1 ml-[-1px] left-1/2 border-l h-14 border-dotted border-SelectRowColor"></div>
              </div>
            </td>
            <td className={"py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10"}>
              <div className="relative flex flex-row justify-start items-center w-full h-10 gap-2 px-4">
                <CustomInput
                  intent={"primary"}
                  border={subaccEditedErr.name ? "error" : "selected"}
                  sizeComp={"xLarge"}
                  sizeInput="small"
                  value={subaccEdited.name}
                  onChange={(e) => {
                    changeName(e.target.value);
                  }}
                  autoFocus
                />
              </div>
            </td>
            <td className={"py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10"}>
              <div className="relative flex flex-row justify-start items-center w-full h-10 gap-2 px-4">
                <CustomInput
                  intent={"primary"}
                  border={subaccEditedErr.subaccount_index ? "error" : "selected"}
                  sizeComp={"xLarge"}
                  sizeInput="small"
                  inputClass="text-center"
                  value={subaccEdited.subaccount_index}
                  onChange={(e) => {
                    changeSubIdx(e.target.value);
                  }}
                  onKeyDown={onKeyDownIndex}
                />
              </div>
            </td>
            <td className={"py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10"}>
              <div className="flex flex-row justify-center items-center gap-2 opacity-70 px-2 w-full">
                <p>{shortAddress(getSubAcc(cntc.principal), 12, 10)}</p>
                <CustomCopy size={"xSmall"} className="p-0" copyText={getSubAcc(cntc.principal)} />
              </div>
            </td>
            <td className={"py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10"}>
              <div className="flex flex-row justify-center items-start gap-4 w-full">
                <CheckIcon
                  onClick={() => {
                    checkSubAcc(false, cntc, asst || ({} as AssetContact));
                  }}
                  className="w-4 h-4 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor opacity-50 cursor-pointer"
                />
                <CloseIcon
                  onClick={onCloseClic}
                  className="w-5 h-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor opacity-50 cursor-pointer"
                />
              </div>
            </td>
            <td className={"py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10"}>
              <div className="flex flex-row justify-center items-start gap-2 w-full">
                <ChevIcon className="invisible" />
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  function checkSubAcc(edit: boolean, cntc: Contact, asst: AssetContact, sa?: SubAccountContact) {
    let subacc = subaccEdited.subaccount_index.trim();
    if (subacc.slice(0, 2).toLowerCase() === "0x") subacc = subacc.substring(2);

    const checkedIdx = removeLeadingZeros(subacc) === "" ? "0" : removeLeadingZeros(subacc);
    const checkedIdxValid = checkSubIndxValid(checkedIdx, asst.subaccounts);

    let eqHexValid = false;
    let eqHex = false;
    if (edit) {
      eqHex = (hexToNumber(`0x${subacc}`) || bigInt()).eq(hexToNumber(`0x${sa?.subaccount_index}`) || bigInt());
      if (!eqHex) {
        eqHexValid = !checkedIdxValid;
      }
    } else {
      eqHexValid = !checkedIdxValid;
    }

    setSubaccEditedErr({
      name: subaccEdited.name.trim() === "",
      subaccount_index: subacc === "" || eqHexValid,
    });

    if (edit) {
      if (subacc !== "" && subaccEdited.name.trim() !== "" && (eqHex || checkedIdxValid)) {
        editCntctSubacc(
          cntc.principal,
          asst.tokenSymbol,
          sa?.subaccount_index || "0",
          subaccEdited.name.trim(),
          checkedIdx,
        );
        setSelSubaccIdx("");
      }
    } else {
      if (subacc !== "" && subaccEdited.name.trim() !== "" && checkedIdxValid) {
        addCntctSubacc(
          cntc.principal,
          asst.tokenSymbol,
          subaccEdited.name.trim(),
          removeLeadingZeros(subacc) === "" ? "0" : removeLeadingZeros(subacc),
        );
        setSelSubaccIdx("");
        setAddSub(false);
      }
    }
  }

  function getSubAcc(princ: string) {
    return encodeIcrcAccount({
      owner: Principal.fromText(princ || ""),
      subaccount: hexToUint8Array(`0x${subaccEdited.subaccount_index}` || "0"),
    });
  }

  function onKeyDownIndex(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!asciiHex.includes(e.key)) {
      e.preventDefault();
    }
    if (subaccEdited.subaccount_index.includes("0x") || subaccEdited.subaccount_index.includes("0X")) {
      if (e.key === "X" || e.key == "x") {
        e.preventDefault();
      }
    }
  }

  function onEdit(sa: SubAccountContact) {
    setAddSub(false);
    setSelContactPrin("");
    setSelSubaccIdx(sa.subaccount_index);
    setSubaccEdited(sa);
    setSubaccEditedErr({
      name: false,
      subaccount_index: false,
    });
  }

  function onDelete(sa: SubAccountContact) {
    setAddSub(false);
    setSelContactPrin("");
    setSelSubaccIdx("");
    setDeleteType(DeleteContactTypeEnum.Enum.SUB);
    setDeleteObject({
      principal: cntc.principal,
      name: cntc.name,
      tokenSymbol: asst.tokenSymbol,
      symbol: asst.symbol,
      subaccIdx: sa.subaccount_index,
      subaccName: sa.name,
      totalAssets: 0,
      TotalSub: 0,
    });
    setDeleteModal(true);
  }

  function onCloseClic() {
    setAddSub(false);
    setSelSubaccIdx("");
  }
};

export default TableSubAccounts;
