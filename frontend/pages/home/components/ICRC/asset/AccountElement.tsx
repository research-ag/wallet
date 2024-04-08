/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// svgs
import PlusIcon from "@assets/svg/files/plus-icon.svg";
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-icon.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { clsx } from "clsx";
import { ChangeEvent, Fragment, useState } from "react";
import { GeneralHook } from "../../../hooks/generalHook";
import { toFullDecimal } from "@/utils";
import { CustomInput } from "@components/input";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@redux/Store";
import { CustomCopy } from "@components/tooltip";
import { addSubAccount, setSubAccountName } from "@redux/assets/AssetReducer";
import { BasicModal } from "@components/modal";
import { CustomButton } from "@components/button";
import bigInt from "big-integer";
import { db } from "@/database/db";
import { LoadingLoader } from "@components/loader";

interface AccountElementProps {
  asset: Asset;
  subAccount: SubAccount;
  symbol: string;
  tokenSymbol: string;
  name: string;
  editNameId: string;
  setName(value: string): void;
  setEditNameId(value: string): void;
  setNewSub(value: SubAccount | undefined): void;
  tokenIndex: number;
  newSub: boolean;
  assets: Asset[];
  subaccountId: number;
  setAddOpen(value: boolean): void;
}

const AccountElement = ({
  asset,
  subAccount,
  symbol,
  tokenSymbol,
  name,
  editNameId,
  setName,
  setEditNameId,
  tokenIndex,
  setNewSub,
  newSub,
  assets,
  subaccountId,
  setAddOpen,
}: AccountElementProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedAsset, changeSelectedAsset, selectedAccount, changeSelectedAccount } = GeneralHook();
  const chechEqId = () => {
    return (
      subAccount?.sub_account_id === selectedAccount?.sub_account_id && subAccount?.symbol === selectedAccount?.symbol
    );
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  return (
    <Fragment>
      <div
        aria-haspopup="true"
        className={accElemStyle()}
        onClick={() => {
          if (!newSub && selectedAsset?.tokenSymbol !== tokenSymbol) changeSelectedAsset(asset);
          if (!newSub && selectedAccount !== subAccount) changeSelectedAccount(subAccount);
          if (editNameId !== subAccount.sub_account_id) setEditNameId("");
        }}
      >
        <div className="flex flex-col items-start justify-center">
          {editNameId === subAccount.sub_account_id ? (
            <div className="flex flex-row items-center justify-start">
              <CustomInput
                intent={"primary"}
                placeholder={""}
                value={name}
                border={nameError ? "error" : undefined}
                sizeComp="small"
                sizeInput="small"
                inputClass="!py-1"
                compOutClass="!w-1/2"
                autoFocus
                onChange={onNameChange}
              />
              <button
                className="flex justify-center items-center ml-2 p-0.5 bg-RadioCheckColor rounded cursor-pointer"
                onClick={onSave}
              >
                <p className="text-sm text-PrimaryTextColor">{t("save")}</p>
              </button>
              <button
                className="flex items-center justify-center p-1 ml-2 rounded cursor-pointer bg-LockColor"
                onClick={onAdd}
              >
                <img src={PlusIcon} className="w-4 h-4 rotate-45" alt="info-icon" />
              </button>
            </div>
          ) : (
            <button className="p-0 w-full text-left min-h-[1.645rem]" onDoubleClick={onDoubleClick}>
              <p className={`${accName()} break-words max-w-[9rem]`}>{`${subAccount?.name}`}</p>
            </button>
          )}
          <div className="flex flex-row items-center justify-start gap-3 min-h-5">
            <p className={`${accId()} break-words max-w-[9rem] text-left`}>{subAccount?.sub_account_id}</p>
            {chechEqId() && (
              <CustomCopy size={"xSmall"} className="p-0" copyText={subAccount?.sub_account_id.substring(2) || "0"} />
            )}
          </div>
        </div>
        <div
          className={`flex flex-row justify-between items-center gap-2 ${
            subAccount?.sub_account_id !== "0x0" && Number(subAccount?.amount) === 0 && !newSub ? "" : "pr-6"
          }`}
        >
          <div className="flex flex-col items-end justify-center">
            <p className="whitespace-nowrap">{`${toFullDecimal(
              subAccount?.amount,
              subAccount.decimal,
              Number(asset.shortDecimal),
            )} ${symbol}`}</p>
            <p className={accCurrencyAmnt()}>{`≈ $${Number(subAccount?.currency_amount).toFixed(2)}`}</p>
          </div>
          {subAccount?.sub_account_id !== "0x0" && Number(subAccount?.amount) === 0 && !newSub && (
            <button
              className="p-0"
              onClick={() => {
                setDeleteModal(true);
              }}
            >
              <TrashIcon className=" fill-PrimaryTextColorLight dark:fill-PrimaryTextColor" />
            </button>
          )}
        </div>
      </div>
      <BasicModal
        width="w-[18rem]"
        padding="py-5 px-4"
        border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
        open={deleteModal}
      >
        <div className="flex flex-col items-start justify-start w-full gap-4 reative text-md">
          <CloseIcon
            className="absolute cursor-pointer top-5 right-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
            onClick={() => {
              setDeleteModal(false);
            }}
          />
          <WarningIcon className="w-6 h-6" />
          <p className="w-full break-words">
            {t("delete.subacc.msg")}
            <span className="ml-1 font-semibold">
              {subAccount.name === "-" ? `${t("subacc")}-${subAccount.sub_account_id}` : subAccount.name}
            </span>
            ?
          </p>

          <div className="flex flex-row items-start justify-end w-full ">
            <CustomButton className="min-w-[5rem]" onClick={onConfirm} size={"small"}>
              {loadingDelete ? <LoadingLoader /> : <p>{t("yes")}</p>}
            </CustomButton>
          </div>
        </div>
      </BasicModal>
    </Fragment>
  );

  function onNameChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
    setNameError(false);
  }

  async function onSave() {
    if (name.trim() !== "") {
      setEditNameId("");
      if (newSub) {
        const asset = assets[+tokenIndex];
        const subAccounts = asset.subAccounts
          .map((sa) => ({
            ...sa,
            name: name,
            numb: subAccount.sub_account_id,
          }))
          .sort((a, b) => bigInt(a.numb).compare(bigInt(b.numb)));

        await db().updateAsset(asset.address, {
          ...asset,
          subAccounts: subAccounts,
        });

        dispatch(addSubAccount(tokenIndex, { ...subAccount, name: name.trim() }));
        setNewSub(undefined);
        setAddOpen(false);
      } else {
        const asset = assets[+tokenIndex];
        const subAccounts = asset.subAccounts.map((sa) =>
          sa.sub_account_id === subAccount.sub_account_id ? { ...sa, name: name } : sa,
        );

        await db().updateAsset(asset.address, {
          ...asset,
          subAccounts: subAccounts,
        });
        dispatch(setSubAccountName(tokenIndex, subaccountId, name));
      }
    } else {
      setNameError(true);
    }
  }

  function onAdd() {
    setEditNameId("");
    setNewSub(undefined);
    setAddOpen(false);
  }

  async function onConfirm() {
    console.log("onConfirm - delete a sub account");

    const asset = assets[Number(tokenIndex)];

    const subAccounts = asset.subAccounts
      .map((sa) => (sa.sub_account_id !== subAccount.sub_account_id ? sa : null!))
      .filter((x) => !!x);

    await db().updateAsset(asset.address, {
      ...asset,
      subAccounts: subAccounts,
    });

    setTimeout(() => {
      setDeleteModal(false);
      setLoadingDelete(false);
    }, 2500);
  }

  function onDoubleClick() {
    setEditNameId(subAccount.sub_account_id);
    setName(subAccount.name);
    setNewSub(undefined);

    setAddOpen(false);
  }

  // Tailwind CSS
  function accElemStyle() {
    return clsx({
      ["relative flex flex-row justify-between items-center w-[calc(100%-2rem)] min-h-[3.5rem] pl-4 pr-4 text-PrimaryColor dark:text-PrimaryColorLight cursor-pointer hover:bg-[rgb(51,178,239,0.24)] text-md"]:
        true,
      ["bg-[rgb(51,178,239,0.24)]"]: chechEqId() && !newSub,
      ["!bg-SvgColor"]: newSub,
    });
  }
  function accName() {
    return clsx({ ["text-[#33b2ef]"]: chechEqId() });
  }
  function accId() {
    return clsx({
      ["text-[#33b2ef]"]: chechEqId(),
      ["opacity-60"]: subAccount?.sub_account_id !== selectedAccount?.sub_account_id,
    });
  }
  function accCurrencyAmnt() {
    return clsx({
      ["opacity-60"]: subAccount?.sub_account_id !== selectedAccount?.sub_account_id,
    });
  }
};

export default AccountElement;
