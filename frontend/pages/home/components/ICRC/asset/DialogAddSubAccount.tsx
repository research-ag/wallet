// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { BasicModal } from "@components/modal";
import { CustomInput } from "@components/input";
import { CustomCheck } from "@components/checkbox";
import { CustomButton } from "@components/button";
import { useTranslation } from "react-i18next";
import { checkHexString, getUSDfromToken, hexToNumber, hexToUint8Array, removeLeadingZeros } from "@/utils";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { GeneralHook } from "../../../hooks/generalHook";
import { useAppDispatch } from "@redux/Store";
import { setAccordionAssetIdx } from "@redux/assets/AssetReducer";
import bigInt from "big-integer";
import { ChangeEvent, Fragment, useState } from "react";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { db } from "@/database/db";
import { LoadingLoader } from "@components/loader";
import { IconTypeEnum } from "@/const";
import { getAssetIcon } from "@/utils/icons";

interface DialogAddSubAccountProps {
  newErr: any;
  setNewErr(value: any): void;
  newSub: SubAccount | undefined;
  setNewSub(value: any): void;
  setAddOpen(value: boolean): void;
  usedIdxs: string[];
  getLowestMissing(value: string[]): any;
  hexChecked: boolean;
  setHexChecked(value: any): void;
  assets: Asset[];
  idx: number;
  selectedAsset?: Asset;
  accordionIndex: string[];
}

const DialogAddSubAccount = ({
  newErr,
  setNewErr,
  newSub,
  setNewSub,
  usedIdxs,
  getLowestMissing,
  hexChecked,
  setHexChecked,
  assets,
  idx,
  selectedAsset,
  setAddOpen,
  accordionIndex,
}: DialogAddSubAccountProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { asciiHex, userAgent, userPrincipal, changeSelectedAccount } = GeneralHook();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <BasicModal
      width="w-[18rem]"
      padding="py-5 px-4"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
      open={newSub ? true : false}
    >
      <div className="flex flex-col items-start justify-start w-full gap-2">
        <CloseIcon
          className="absolute cursor-pointer top-6 right-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={() => {
            addToAcordeonIdx();
            setNewSub(undefined);
            setAddOpen(false);
            setHexChecked(false);
          }}
        />
        {!showConfirm ? (
          <Fragment>
            <p className="">{t("add.subacc")}</p>
            <CustomInput
              intent={"primary"}
              border={newErr.name ? "error" : "primary"}
              placeholder={t("name.sub.account")}
              value={newSub?.name || ""}
              sizeComp="small"
              sizeInput="small"
              inputClass="!py-1"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onChange={onChangeName}
              onKeyUp={onKeyUp}
            />
            <button className="flex flex-row gap-2 p-0" onClick={onChangeCheckboxHex}>
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
                sufix={<p className="text-sm opacity-70">(Hex)</p>}
              />
            )}
            <div className="flex flex-row items-center justify-end w-full">
              <CustomButton size={"small"} className="min-w-[5rem]" onClick={onEnter}>
                {loading ? <LoadingLoader /> : <p>{t("add")}</p>}
              </CustomButton>
            </div>
          </Fragment>
        ) : (
          <div className="flex flex-col items-center justify-center w-full gap-3">
            {getAssetIcon(IconTypeEnum.Enum.ASSET, assets[Number(idx)].tokenSymbol, assets[Number(idx)].logo)}
            <p className={"text-lg font-semibold text-center"}>
              {t("new.subacc.added", { name: newSub?.name || "", asset: assets[Number(idx)].tokenName })}
            </p>
          </div>
        )}
      </div>
    </BasicModal>
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
    if (!loading) {
      setLoading(true);
      if (newSub) {
        // Prepare and check idx to add
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
          // Not reduce accordion when add asset
          addToAcordeonIdx();

          // Look for balance and add sub Account
          try {
            const tknAddress = selectedAsset?.address || "";
            const decimal = 8;
            const assetMrkt = 0;
            const { balance } = IcrcLedgerCanister.create({
              agent: userAgent,
              canisterId: tknAddress as any,
            });
            const myBalance = await balance({
              owner: userPrincipal,
              subaccount: hexToUint8Array(`0x${subClean}`),
              certified: false,
            });

            const asset = assets[Number(idx)];

            const assetToUpdate: Asset = {
              ...asset,
              subAccounts: [
                ...asset.subAccounts,
                {
                  name: newSub.name,
                  sub_account_id: `0x${subClean}`.toLowerCase(),
                  amount: myBalance.toString(),
                  currency_amount: assetMrkt ? getUSDfromToken(myBalance.toString(), assetMrkt, decimal) : "0",
                  transaction_fee: asset.subAccounts[0].transaction_fee,
                  address: asset.subAccounts[0].address,
                  decimal: asset.subAccounts[0].decimal,
                  symbol: asset.subAccounts[0].symbol,
                },
              ].sort((a, b) => hexToNumber(a.sub_account_id)?.compare(hexToNumber(b.sub_account_id) || bigInt()) || 0),
            };

            // INFO: add new sub account to asset
            await db().updateAsset(asset.address, assetToUpdate, { sync: true });

            const savedSub = {
              ...newSub,
              sub_account_id: `0x${subClean}`.toLowerCase(),
              amount: myBalance.toString(),
              currency_amount: assetMrkt ? getUSDfromToken(myBalance.toString(), assetMrkt, decimal) : "0",
            };

            setTimeout(() => {
              setShowConfirm(true);
            }, 2500);

            setTimeout(() => {
              setAddOpen(false);
              setHexChecked(false);
              changeSelectedAccount(savedSub);
              setNewSub(undefined);
              setLoading(false);
              setShowConfirm(false);
            }, 6000);
          } catch (e) {
            console.log("AddErr: ", e);
            setLoading(false);
          }
        } else {
          setNewErr({ name: errName, idx: errIdx });
          setLoading(false);
        }
      }
    }
  }
  function addToAcordeonIdx() {
    if (!accordionIndex.includes(selectedAsset?.tokenSymbol || "")) {
      dispatch(setAccordionAssetIdx([...accordionIndex, selectedAsset?.tokenSymbol || ""]));
    }
  }
};

export default DialogAddSubAccount;
