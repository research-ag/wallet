// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import Modal from "@components/Modal";
import { CustomInput } from "@components/Input";
import { CustomCheck } from "@components/CheckBox";
import { CustomButton } from "@components/Button";
import { useTranslation } from "react-i18next";
import { checkHexString, hexToNumber, removeLeadingZeros } from "@/utils";
import { SubAccount } from "@redux/models/AccountModels";
import { GeneralHook } from "../hooks/generalHook";
import { Token } from "@redux/models/TokenModels";
import { useAppDispatch } from "@redux/Store";
import { addSubAccount } from "@redux/assets/AssetReducer";
import bigInt from "big-integer";
import { ChangeEvent } from "react";
import { db } from "@/database/db";

interface DialogAddAssetProps {
  newErr: any;

  setNewErr(value: any): void;

  newSub: SubAccount | undefined;

  setNewSub(value: any): void;

  usedIdxs: string[];

  getLowestMissing(value: string[]): any;

  hexChecked: boolean;

  setHexChecked(value: any): void;

  tokens: Token[];
  idx: number;
}

const DialogAddAsset = ({
                          newErr,
                          setNewErr,
                          newSub,
                          setNewSub,
                          usedIdxs,
                          getLowestMissing,
                          hexChecked,
                          setHexChecked,
                          tokens,
                          idx,
                        }: DialogAddAssetProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { asciiHex } = GeneralHook();

  return (
    <Modal
      width="w-[18rem]"
      padding="py-5 px-4"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
      open={newSub ? true : false}
    >
      <div className="reative flex flex-col justify-start items-start w-full gap-2">
        <CloseIcon
          className="absolute top-6 right-5 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={() => {
            setNewSub(undefined);
            setHexChecked(false);
          }}
        />
        <p className="">{t("add.subacc")}</p>
        <CustomInput
          intent={"primary"}
          border={newErr.name ? "error" : "primary"}
          placeholder={t("name.sub.account")}
          value={newSub?.name || ""}
          sizeComp="small"
          sizeInput="small"
          inputClass="!py-1"
          autoFocus
          onChange={onChangeName}
          onKeyUp={onKeyUp}
        />
        <button className="p-0 flex flex-row gap-2" onClick={onChangeCheckboxHex}>
          <CustomCheck className="border-BorderColorLight dark:border-BorderColor" checked={hexChecked} />
          <p className="text-sm">{t("hex.check")}</p>
        </button>
        {hexChecked && (
          <CustomInput
            intent={"primary"}
            border={newErr.idx ? "error" : "primary"}
            placeholder={t("sub-acc")}
            value={newSub?.sub_account_id || ""}
            sizeComp="small"
            sizeInput="small"
            inputClass="!py-1"
            onChange={onChangeIdx}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
          />
        )}
        <div className="flex flex-row justify-end items-center w-full">
          <CustomButton size={"small"} className="min-w-[5rem]" onClick={onEnter}>
            <p>{t("add")}</p>
          </CustomButton>
        </div>
      </div>
    </Modal>
  );

  function onChangeName(e: ChangeEvent<HTMLInputElement>) {
    setNewSub((prev: any) => {
      if (prev) return { ...prev, name: e.target.value };
    });
    setNewErr((prev: any) => {
      return { idx: prev.idx, name: false };
    });
  }

  function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.key === "Enter") {
      onEnter();
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!asciiHex.includes(e.key)) {
      e.preventDefault();
    }
    if (newSub?.sub_account_id.includes("0x") || newSub?.sub_account_id.includes("0X")) {
      if (e.key === "X" || e.key == "x") {
        e.preventDefault();
      }
    }
  }

  function onChangeCheckboxHex() {
    if (hexChecked) {
      const lowestMissing = getLowestMissing(usedIdxs);
      setNewSub((prev: any) => {
        if (prev) return { ...prev, sub_account_id: lowestMissing.toString(16) };
      });
      setNewErr((prev: any) => {
        return { name: prev.name, idx: false };
      });
    }
    setHexChecked((prev: any) => !prev);
  }

  function onChangeIdx(e: ChangeEvent<HTMLInputElement>) {
    if (checkHexString(e.target.value))
      setNewSub((prev: any) => {
        if (prev) return { ...prev, sub_account_id: e.target.value.trim() };
      });
    setNewErr((prev: any) => {
      return { name: prev.name, idx: false };
    });
  }

  async function onEnter() {
    if (newSub) {
      const subClean = removeLeadingZeros(
        newSub.sub_account_id.slice(0, 2).toLowerCase() === "0x"
          ? newSub.sub_account_id.substring(2)
          : newSub.sub_account_id,
      );
      let errName = false;
      let errIdx = false;
      if (newSub.name.trim() === "") errName = true;
      const checkedIdx = subClean === "" ? "0x0" : `0x${subClean}`;
      if (usedIdxs.includes(checkedIdx.toLowerCase())) {
        errIdx = true;
      }
      if (!errName && !errIdx) {
        const token = tokens[Number(idx)];
        await db().updateToken(token.id_number, {
          ...token,
          subAccounts: [
            ...token.subAccounts,
            {
              name: newSub.name,
              numb: `0x${subClean}`.toLowerCase(),
            },
          ].sort((a, b) => {
            return hexToNumber(a.numb)?.compare(hexToNumber(b.numb) || bigInt()) || 0;
          }),
        });
        dispatch(
          addSubAccount(idx, {
            ...newSub,
            sub_account_id: `0x${subClean}`.toLowerCase(),
          }),
        );
        setNewSub(undefined);
        setHexChecked(false);
      } else {
        setNewErr({ name: errName, idx: errIdx });
      }
    }
  }
};

export default DialogAddAsset;
