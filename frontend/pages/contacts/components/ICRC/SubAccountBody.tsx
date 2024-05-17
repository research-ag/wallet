// svg

import { ReactComponent as PencilIcon } from "@assets/svg/files/pencil.svg";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-icon.svg";
import { ReactComponent as ChevIcon } from "@assets/svg/files/chev-icon.svg";
import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";

import { Buffer } from "buffer";

import { CustomCopy } from "@components/tooltip";
import { CustomInput } from "@components/input";
import { encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import AllowanceTooltip from "./AllowanceTooltip";
import {
  AssetContact,
  Contact,
  NewContactSubAccount,
  SubAccountContact,
  SubAccountContactErr,
} from "@redux/models/ContactsModels";
import { getAllowanceDetails } from "@/common/libs/icrcledger/";
import { DeleteContactTypeEnum } from "@/common/const";
import useContactTable from "../../hooks/useContactTable";
import { LoadingLoader } from "@components/loader";
import store from "@redux/Store";
import { SupportedStandardEnum } from "@/@types/icrc";
import { CustomButton } from "@components/button";
import { ChangeEvent, useState } from "react";
import { asciiHex } from "@pages/contacts/constants/asciiHex";
import { getNormalizedHex, isHexadecimalValid } from "@pages/home/helpers/checkers";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import { getInitialFromName, removeLeadingZeros } from "@common/utils/strings";
import { shortAddress } from "@common/utils/icrc";

interface SubAccountBodyProps {
  asst: AssetContact;
  addSub: boolean;
  selSubaccIdx: string;
  subaccEdited: SubAccountContact;
  subaccEditedErr: SubAccountContactErr;
  cntc: Contact;
  fromPrincSub: boolean;
  setFromPrincSub(value: boolean): void;
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

export default function SubAccountBody(props: SubAccountBodyProps) {
  const {
    asst,
    addSub,
    selSubaccIdx,
    subaccEdited,
    subaccEditedErr,
    cntc,
    fromPrincSub,
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
    setFromPrincSub,
  } = props;
  const { editCntctSubacc, addCntctSubacc, isPending, setIsPending } = useContactTable();
  const [princ, setPrinc] = useState("");

  return (
    <tbody>
      {asst?.subaccounts?.map((sa, l) => {
        const encodedAcc = encodeIcrcAccount({
          owner: Principal.fromText(cntc.principal || ""),
          subaccount: hexToUint8Array(`0x${sa.subaccount_index}`),
        });
        return (
          <tr key={l} className={`${isPending ? "opacity-50 pointer-events-none" : ""}`}>
            <td></td>
            <td className="h-full">
              <div className="relative flex flex-col items-center justify-center w-full h-full">
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
              <div className="relative flex flex-row items-center justify-start w-full h-10 gap-2 px-4">
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
                  <div className="flex flex-row items-center justify-start w-full gap-2">
                    <div
                      className={
                        "flex justify-center items-center w-8 h-8 min-w-[2rem] min-h-[2rem] rounded-md bg-SelectRowColor"
                      }
                    >
                      <p className="text-PrimaryTextColor">{getInitialFromName(sa.name, 1)}</p>
                    </div>
                    <p className="text-left break-all opacity-70">
                      {sa.name.length > 105 ? `${sa.name.slice(0, 105)}...` : sa.name}
                    </p>
                    {sa.allowance?.allowance && (
                      <AllowanceTooltip
                        amount={sa.allowance.allowance}
                        expiration={sa.allowance.expires_at}
                        tokenSymbol={asst.tokenSymbol}
                      />
                    )}
                  </div>
                )}
              </div>
            </td>
            <td
              className={`py-2 border-b  border-BorderColorTwoLight dark:border-BorderColorTwo ${
                sa.subaccount_index === selSubaccIdx ? "bg-SelectRowColor/10" : ""
              }`}
            >
              <div className="relative flex flex-row items-center justify-start w-full h-10 gap-2 px-4">
                <div className="flex flex-row items-center justify-center w-full gap-2 px-2 opacity-70">
                  <p className="text-nowrap">{shortAddress(`0x${sa.subaccount_index || "0"}`, 7, 5)}</p>
                  <CustomCopy size={"xSmall"} className="p-0" copyText={sa.subaccount_index || "0"} />
                </div>
              </div>
            </td>
            <td
              className={`py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo ${
                sa.subaccount_index === selSubaccIdx ? "bg-SelectRowColor/10" : ""
              }`}
            >
              <div className="flex flex-row items-center justify-center w-full gap-2 px-2 opacity-70">
                <p>{shortAddress(encodedAcc, 12, 10)}</p>
                <CustomCopy size={"xSmall"} className="p-0" copyText={encodedAcc} />
              </div>
            </td>
            <td
              className={`py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo ${
                sa.subaccount_index === selSubaccIdx ? "bg-SelectRowColor/10" : ""
              }`}
            >
              <div className="flex flex-row items-start justify-center w-full gap-4">
                {sa.subaccount_index === selSubaccIdx && !isPending && (
                  <CheckIcon
                    onClick={() => {
                      checkSubAccount(true, cntc, asst, sa);
                    }}
                    className="w-4 h-4 opacity-50 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
                  />
                )}

                {sa.subaccount_index === selSubaccIdx && isPending && <LoadingLoader />}

                {!(sa.subaccount_index === selSubaccIdx && !isPending) && (
                  <PencilIcon
                    onClick={() => {
                      onEditSubAccount(sa);
                      setFromPrincSub(false);
                    }}
                    className="w-4 h-4 opacity-50 cursor-pointer fill-PrimaryTextColorLight dark:fill-PrimaryTextColor"
                  />
                )}

                {sa.subaccount_index === selSubaccIdx && !isPending && (
                  <CloseIcon
                    onClick={() => {
                      setSelSubaccIdx("");
                      setFromPrincSub(false);
                    }}
                    className="w-5 h-5 opacity-50 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
                  />
                )}

                {!(sa.subaccount_index === selSubaccIdx) && (
                  <TrashIcon
                    onClick={() => {
                      onDeleteSubAccount(sa);
                    }}
                    className="w-4 h-4 cursor-pointer fill-PrimaryTextColorLight dark:fill-PrimaryTextColor"
                  />
                )}
              </div>
            </td>
            <td
              className={`py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo ${
                sa.subaccount_index === selSubaccIdx ? "bg-SelectRowColor/10" : ""
              }`}
            >
              <div className="flex flex-row items-start justify-center w-full gap-2">
                <ChevIcon className="invisible" />
              </div>
            </td>
          </tr>
        );
      })}
      {addSub && (
        <tr className={`${isPending ? "opacity-50 pointer-events-none" : ""}`}>
          <td></td>
          <td className="h-full">
            <div className="relative flex flex-col items-center justify-center w-full h-full">
              <div className="w-1 h-1 bg-SelectRowColor"></div>
              <div className="absolute bottom-0 w-1 ml-[-1px] left-1/2 border-l h-14 border-dotted border-SelectRowColor"></div>
            </div>
          </td>
          <td className={"py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10"}>
            <div className="relative flex flex-row items-center justify-start w-full h-10 gap-2 px-4">
              <CustomInput
                intent={"primary"}
                border={subaccEditedErr.name ? "error" : "selected"}
                sizeComp={"xLarge"}
                sizeInput="small"
                value={subaccEdited.name}
                onChange={(e) => {
                  changeName(e.target.value);
                }}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
            </div>
          </td>
          <td className={"py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10"}>
            <div className="relative flex flex-row items-center justify-start w-full h-10 gap-2 px-4">
              <CustomInput
                intent={"primary"}
                border={subaccEditedErr.subaccount_index ? "error" : "selected"}
                sizeComp={"xLarge"}
                sizeInput="small"
                inputClass="text-center"
                value={fromPrincSub ? princ : subaccEdited.subaccount_index}
                onChange={onSubAccountChange}
                onKeyDown={onKeyDownIndex}
              />
              <CustomButton size={"xSmall"} onClick={onFromPrincChange}>
                <p>{fromPrincSub ? "Principal" : "Hex"}</p>
              </CustomButton>
            </div>
          </td>
          <td className={"py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10"}>
            <div className="flex flex-row items-center justify-center w-full gap-2 px-2 opacity-70">
              <p>{shortAddress(getSubAccount(cntc.principal), 12, 10)}</p>
              <CustomCopy size={"xSmall"} className="p-0" copyText={getSubAccount(cntc.principal)} />
            </div>
          </td>
          <td className={"py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10"}>
            <div className="flex flex-row items-start justify-center w-full gap-4">
              {isPending ? (
                <LoadingLoader />
              ) : (
                <CheckIcon
                  onClick={() => {
                    checkSubAccount(false, cntc, asst || ({} as AssetContact));
                  }}
                  className="w-4 h-4 opacity-50 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
                />
              )}
              <CloseIcon
                onClick={onCloseClic}
                className="w-5 h-5 opacity-50 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
              />
            </div>
          </td>
          <td className={"py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10"}>
            <div className="flex flex-row items-start justify-center w-full gap-2">
              <ChevIcon className="invisible" />
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );

  async function checkSubAccount(edit: boolean, contact: Contact, asset: AssetContact, subAccount?: SubAccountContact) {
    if (subaccEditedErr.name || subaccEditedErr.subaccount_index) return;
    let princSubId = "";

    if (fromPrincSub) {
      const princBytes = Principal.fromText(princ).toUint8Array();
      princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;
    }
    setIsPending(true);
    const SUB_ACCOUNT_ID_ERROR = "SUB_ACCOUNT_ID_ERROR";
    const SUB_ACCOUNT_NAME_ERROR = "SUB_ACCOUNT_NAME_ERROR";

    try {
      const subAccountName = subaccEdited.name;
      const grossSubAccountId = fromPrincSub ? princSubId : subaccEdited.subaccount_index.trim();

      if (!subAccountName) throw SUB_ACCOUNT_NAME_ERROR;
      if (!isHexadecimalValid(grossSubAccountId)) throw SUB_ACCOUNT_ID_ERROR;

      const normalizedHex = getNormalizedHex(grossSubAccountId);
      const subAccountIndex = removeLeadingZeros(normalizedHex) === "" ? "0" : removeLeadingZeros(normalizedHex);

      const duplicated = asset.subaccounts.find((sa) => {
        return sa.subaccount_index === subAccountIndex;
      });

      if (duplicated && duplicated?.subaccount_index !== selSubaccIdx) throw SUB_ACCOUNT_ID_ERROR;
      setSubaccEditedErr({ name: false, subaccount_index: false });

      let allowance = undefined;
      if (asset.supportedStandards.includes(SupportedStandardEnum.Values["ICRC-2"])) {
        allowance = await getAllowanceDetails({
          spenderPrincipal: store.getState().auth.userPrincipal.toText(),
          spenderSubaccount: subaccEdited.sub_account_id,
          accountPrincipal: contact.principal,
          assetAddress: asset.address,
          assetDecimal: asset.decimal,
        });
      }

      if (edit) {
        editCntctSubacc(
          cntc.principal,
          asst.tokenSymbol,
          subAccount?.subaccount_index || "0",
          subaccEdited.name.trim(),
          subAccountIndex,
          allowance || { allowance: "", expires_at: "" },
        );
        setSelSubaccIdx("");
      } else {
        addCntctSubacc(
          cntc.principal,
          asst.tokenSymbol,
          subaccEdited.name.trim(),
          subAccountIndex,
          fromPrincSub ? princSubId : subaccEdited.sub_account_id,
          allowance || { allowance: "", expires_at: "" },
        );
        setSelSubaccIdx("");
        setAddSub(false);
      }
    } catch (error) {
      if (error === SUB_ACCOUNT_ID_ERROR) {
        return setSubaccEditedErr({ name: false, subaccount_index: true });
      }
      if (error === SUB_ACCOUNT_NAME_ERROR) {
        return setSubaccEditedErr({ name: true, subaccount_index: false });
      }
      console.error(error);
    } finally {
      setIsPending(false);
      setFromPrincSub(false);
    }
  }

  function onFromPrincChange() {
    setFromPrincSub(!fromPrincSub);
    changeSubIdx("");
    setPrinc("");
  }

  function onSubAccountChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (fromPrincSub) {
      setPrinc(value);
      if (value === "") {
        setSubaccEditedErr({ ...subaccEditedErr, subaccount_index: false });
      } else {
        try {
          Principal.fromText(value);
          setSubaccEditedErr({ ...subaccEditedErr, subaccount_index: false });
        } catch {
          setSubaccEditedErr({ ...subaccEditedErr, subaccount_index: true });
        }
      }
    } else {
      changeSubIdx(value);
    }
  }

  function onEditSubAccount(sa: SubAccountContact) {
    setAddSub(false);
    setSelContactPrin("");
    setSelSubaccIdx(sa.subaccount_index);
    setSubaccEdited(sa);
    setSubaccEditedErr({
      name: false,
      subaccount_index: false,
    });
  }

  function onDeleteSubAccount(sa: SubAccountContact) {
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
    setFromPrincSub(false);
  }

  function getSubAccount(princ: string) {
    return encodeIcrcAccount({
      owner: Principal.fromText(princ || ""),
      subaccount: hexToUint8Array(`0x${subaccEdited.subaccount_index}` || "0"),
    });
  }

  function onKeyDownIndex(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!fromPrincSub) {
      if (!asciiHex.includes(e.key)) {
        e.preventDefault();
      }
      if (subaccEdited.subaccount_index.includes("0x") || subaccEdited.subaccount_index.includes("0X")) {
        if (e.key === "X" || e.key == "x") {
          e.preventDefault();
        }
      }
    }
  }
}
