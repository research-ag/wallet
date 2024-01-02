// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import Modal from "@components/Modal";
import { CustomInput } from "@components/Input";
import { CustomButton } from "@components/Button";
import { useTranslation } from "react-i18next";
import { checkHexString, getUSDfromToken, hexToNumber, hexToUint8Array, removeLeadingZeros } from "@/utils";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { GeneralHook } from "../../hooks/generalHook";
import { Token } from "@redux/models/TokenModels";
import { useAppDispatch } from "@redux/Store";
import { addSubAccount, setAcordeonAssetIdx } from "@redux/assets/AssetReducer";
import bigInt from "big-integer";
import { ChangeEvent, useState } from "react";
import { AssetHook } from "../../hooks/assetHook";
import { IcrcLedgerCanister } from "@dfinity/ledger";
import { CheckBox } from "@components/checkbox";

interface DialogAddAssetProps {
  newErr: any;
  setNewErr(value: any): void;
  newSub: SubAccount | undefined;
  setNewSub(value: any): void;
  setAddOpen(value: boolean): void;
  usedIdxs: string[];
  getLowestMissing(value: string[]): any;
  hexChecked: boolean;
  setHexChecked(value: any): void;
  tokens: Token[];
  idx: number;
  authClient: string;
  selectedAsset?: Asset;
  acordeonIdx: string[];
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
  authClient,
  selectedAsset,
  setAddOpen,
  acordeonIdx,
}: DialogAddAssetProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { tokensMarket } = AssetHook();
  const { asciiHex, userAgent, userPrincipal, changeSelectedAccount } = GeneralHook();
  const [loading, setLoading] = useState(false);

  return (
    <Modal
      width="w-[18rem]"
      padding="py-5 px-4"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
      open={newSub ? true : false}
    >
      <div className="flex flex-col items-start justify-start w-full gap-2 reative">
        <CloseIcon
          className="absolute cursor-pointer top-6 right-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={() => {
            addToAcordeonIdx();
            setNewSub(undefined);
            setAddOpen(false);
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
        <button className="flex flex-row gap-2 p-0" onClick={onChangeCheckboxHex}>
          <CheckBox className="border-BorderColorLight dark:border-BorderColor" checked={hexChecked} />
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
            sufix={<p className="text-sm opacity-70">(Hex)</p>}
          />
        )}
        <div className="flex flex-row items-center justify-end w-full">
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

  function saveLocalStorage(auxTokens: Token[]) {
    localStorage.setItem(
      authClient,
      JSON.stringify({
        from: "II",
        tokens: auxTokens.sort((a, b) => {
          return a.id_number - b.id_number;
        }),
      }),
    );
  }

  async function onEnter() {
    if (!loading) {
      setLoading(true);
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
          addToAcordeonIdx();
          try {
            const tknAddress = selectedAsset?.address || "";
            let decimal = 8;
            let assetMrkt = 0;
            const { balance } = IcrcLedgerCanister.create({
              agent: userAgent,
              canisterId: tknAddress as any,
            });
            const myBalance = await balance({
              owner: userPrincipal,
              subaccount: hexToUint8Array(`0x${subClean}`),
              certified: false,
            });
            const auxTokens = tokens.map((tkn, k) => {
              if (k === Number(idx)) {
                decimal = Number(tkn.decimal);
                assetMrkt = tokensMarket.find((tm) => tm.symbol === tkn.symbol)?.price || 0;
                return {
                  ...tkn,
                  subAccounts: [
                    ...tkn.subAccounts,
                    {
                      name: newSub.name,
                      numb: `0x${subClean}`.toLowerCase(),
                      amount: myBalance.toString(),
                      currency_amount: assetMrkt ? getUSDfromToken(myBalance.toString(), assetMrkt, decimal) : "0",
                    },
                  ].sort((a, b) => {
                    return hexToNumber(a.numb)?.compare(hexToNumber(b.numb) || bigInt()) || 0;
                  }),
                };
              } else return tkn;
            });

            saveLocalStorage(auxTokens);
            const savedSub = {
              ...newSub,
              sub_account_id: `0x${subClean}`.toLowerCase(),
              amount: myBalance.toString(),
              currency_amount: assetMrkt ? getUSDfromToken(myBalance.toString(), assetMrkt, decimal) : "0",
            };
            dispatch(addSubAccount(idx, savedSub));
            setNewSub(undefined);
            setAddOpen(false);
            setHexChecked(false);
            changeSelectedAccount(savedSub);
          } catch (e) {
            console.log("AddErr: ", e);
          }
        } else {
          setNewErr({ name: errName, idx: errIdx });
        }
      }
      setLoading(false);
    }
  }
  function addToAcordeonIdx() {
    if (!acordeonIdx.includes(selectedAsset?.tokenSymbol || "")) {
      dispatch(setAcordeonAssetIdx([...acordeonIdx, selectedAsset?.tokenSymbol || ""]));
    }
  }
};

export default DialogAddAsset;
