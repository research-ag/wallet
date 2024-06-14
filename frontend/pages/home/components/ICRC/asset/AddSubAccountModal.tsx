// svgs
import { IconTypeEnum } from "@/common/const";
import { db } from "@/database/db";
import { getAssetIcon } from "@/common/utils/icons";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { CustomButton } from "@components/button";
import { CustomCheck } from "@components/checkbox";
import { CustomInput } from "@components/input";
import { LoadingLoader } from "@components/loader";
//
import { BasicModal } from "@components/modal";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { asciiHex } from "@pages/contacts/constants/asciiHex";
import { setAccordionAssetIdx, setSelectedAccount } from "@redux/assets/AssetReducer";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import bigInt from "big-integer";
import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { checkHexString, hexToNumber, hexToUint8Array } from "@common/utils/hexadecimal";
import { removeLeadingZeros } from "@common/utils/strings";
import { getUSDFromToken } from "@common/utils/amount";
import logger from "@/common/utils/logger";

interface AddSubAccountModalProps {
  isAddSubAccountOpen: boolean;
  onClose: () => void;
  currentAsset: Asset;
  usedIdxs: string[];
}

export const MAX_SUB_ACCOUNT_NAME_LENGTH = 10;

export default function AddSubAccountModal({
  isAddSubAccountOpen,
  onClose,
  currentAsset,
  usedIdxs,
}: AddSubAccountModalProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { assets } = useAppSelector((state) => state.asset.list);
  const { tokensMarket } = useAppSelector((state) => state.asset.utilData);
  const { selectedAsset, accordionIndex } = useAppSelector((state) => state.asset.helper);
  const { userAgent, userPrincipal, authClient } = useAppSelector((state) => state.auth);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newSub, setNewSub] = useState<SubAccount | undefined>();
  const [loading, setLoading] = useState(false);
  const [newErr, setNewErr] = useState({ name: false, idx: false });
  const [hexChecked, setHexChecked] = useState<boolean>(false);

  const currentAssetIndex = assets.findIndex((asset) => asset.tokenSymbol === currentAsset.tokenSymbol);

  useEffect(() => {
    let newIdx = "0";
    newIdx = getLowestMissing(usedIdxs).toString(16);

    setNewSub({
      name: "",
      sub_account_id: newIdx,
      address: authClient,
      amount: "0",
      currency_amount: "0",
      transaction_fee: currentAsset.subAccounts[0].transaction_fee,
      decimal: Number(currentAsset.decimal),
      symbol: currentAsset.tokenSymbol,
    });
  }, []);

  if (currentAssetIndex === -1) return <></>;

  return (
    <BasicModal
      width="w-[18rem]"
      padding="py-5 px-4"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
      open={isAddSubAccountOpen}
    >
      <div className="flex flex-col items-start justify-start w-full gap-2">
        <CloseIcon
          className="absolute cursor-pointer top-6 right-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={() => onClose()}
        />
        {!showConfirm ? (
          <>
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
            <div className="flex flex-row gap-2 p-0" onClick={onChangeCheckboxHex}>
              <CustomCheck className="border-BorderColorLight dark:border-BorderColor" checked={hexChecked} />
              <p className="text-sm">{t("hex.check")}</p>
            </div>
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full gap-3">
            {getAssetIcon(
              IconTypeEnum.Enum.ASSET,
              assets[currentAssetIndex].tokenSymbol,
              assets[currentAssetIndex].logo,
            )}
            <p className={"text-lg font-semibold text-center"}>
              {t("new.subacc.added", { name: newSub?.name || "", asset: assets[currentAssetIndex].tokenName })}
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

  function getLowestMissing(idxs: string[]) {
    let lowestMissing = bigInt();
    for (let index = 0; index < idxs.length; index++) {
      const saId = hexToNumber(idxs[index]) || bigInt();
      const newId = hexToNumber(`0x${index.toString(16)}`) || bigInt();
      if (saId.compare(newId) !== 1) lowestMissing = saId.add(bigInt(1));
    }
    return lowestMissing;
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
        if (newSub.name.trim() === "" || newSub.name.trim().length > MAX_SUB_ACCOUNT_NAME_LENGTH) errName = true;
        const checkedIdx = subClean === "" ? "0x0" : `0x${subClean}`;
        if (usedIdxs.includes(checkedIdx.toLowerCase())) {
          errIdx = true;
        }
        if (!errName && !errIdx) {
          // Not reduce accordion when add asset
          addToAcordeonIdx();

          // Look for balance and add sub Account
          try {
            const tokenMarket = tokensMarket.find((token) => token.symbol === currentAsset?.tokenSymbol)?.price || 0;

            const { balance } = IcrcLedgerCanister.create({
              agent: userAgent,
              canisterId: Principal.fromText(currentAsset.address),
            });
            let myBalance = BigInt(0);
            try {
              myBalance = await balance({
                owner: userPrincipal,
                subaccount: hexToUint8Array(`0x${subClean}`),
                certified: false,
              });
            } catch {
              //
            }

            const asset = assets[currentAssetIndex];

            const assetToUpdate: Asset = {
              ...asset,
              subAccounts: [
                ...asset.subAccounts,
                {
                  name: newSub.name,
                  sub_account_id: `0x${subClean}`.toLowerCase(),
                  amount: myBalance.toString(),
                  currency_amount: tokenMarket
                    ? getUSDFromToken(myBalance.toString(), tokenMarket, Number(currentAsset.decimal))
                    : "0",
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
              currency_amount: tokenMarket
                ? getUSDFromToken(myBalance.toString(), tokenMarket, Number(currentAsset.decimal))
                : "0",
            };

            setShowConfirm(true);
            onClose();
            setHexChecked(false);

            dispatch(setSelectedAccount(savedSub));
            setNewSub(undefined);
            setLoading(false);
            setShowConfirm(false);
          } catch (e) {
            logger.debug("AddErr: ", e);
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
}
