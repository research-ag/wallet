import PlusIcon from "@assets/svg/files/plus-icon.svg";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-icon.svg";
//
import { CustomInput } from "@components/input";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomCopy } from "@components/tooltip";
import { toFullDecimal } from "@/utils";
import DeleteSubAccountModal from "./DeleteSubAccountModal";
import { useAppSelector } from "@redux/Store";
import { db } from "@/database/db";

interface AccountAccordionItemProps {
  currentSubAccount: SubAccount;
  isCurrentSubAccountSelected: boolean;
  currentAsset: Asset;
}

export default function AccountAccordionItem({
  currentSubAccount,
  isCurrentSubAccountSelected,
  currentAsset,
}: AccountAccordionItemProps) {
  const { t } = useTranslation();
  const { assets } = useAppSelector((state) => state.asset);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingSubAccountId, setEditingSubAccountId] = useState("");
  const [subAccountName, setSubAccountName] = useState("");
  const [isNameInvalid, setNameValid] = useState(false);

  console.log({
    subAccountName,
    editingSubAccountId,
    isNameInvalid,
  });

  return (
    <>
      <div aria-haspopup="true" className={getAccountStyles()}>
        <div className="flex flex-col items-start justify-center">
          {editingSubAccountId === currentSubAccount.sub_account_id ? (
            <div className="flex flex-row items-center justify-start">
              <CustomInput
                intent={"primary"}
                placeholder={""}
                value={subAccountName}
                border={isNameInvalid ? "error" : undefined}
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
                onClick={onCancelEdit}
              >
                <img src={PlusIcon} className="w-4 h-4 rotate-45" alt="info-icon" />
              </button>
            </div>
          ) : (
            <button className="p-0 w-full text-left min-h-[1.645rem]" onDoubleClick={onEditSubAccount}>
              <p className={`${accName()} break-words max-w-[9rem]`}>{`${currentSubAccount?.name}`}</p>
            </button>
          )}
          <div className="flex flex-row items-center justify-start gap-3 min-h-5">
            <p className={`${subAccountIdStyles()} break-words max-w-[9rem] text-left`}>
              {currentSubAccount?.sub_account_id}
            </p>
            {isCurrentSubAccountSelected && (
              <CustomCopy
                size={"xSmall"}
                className="p-0"
                copyText={currentSubAccount?.sub_account_id.substring(2) || "0"}
              />
            )}
          </div>
        </div>
        <div className={getDefaultAccountStyles(currentSubAccount?.sub_account_id !== "0x0")}>
          <div className="flex flex-col items-end justify-center">
            <p className="whitespace-nowrap">
              {`${toFullDecimal(
                currentSubAccount?.amount,
                currentSubAccount.decimal,
                Number(currentAsset.shortDecimal),
              )} ${currentAsset.symbol}`}
            </p>
            <p className={subAccountCurrencyStyles()}>{`≈ $${Number(currentSubAccount?.currency_amount).toFixed(
              2,
            )}`}</p>
          </div>
          {currentSubAccount?.sub_account_id !== "0x0" && Number(currentSubAccount?.amount) === 0 && (
            <button className="p-0" onClick={() => setDeleteModalOpen(true)}>
              <TrashIcon className=" fill-PrimaryTextColorLight dark:fill-PrimaryTextColor" />
            </button>
          )}
        </div>
      </div>
      {isDeleteModalOpen && (
        <DeleteSubAccountModal
          currentAsset={currentAsset}
          isDeleteModalOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          currentSubAccount={currentSubAccount}
        />
      )}
    </>
  );

  function onEditSubAccount() {
    setEditingSubAccountId(currentSubAccount.sub_account_id);
    setSubAccountName(currentSubAccount.name);
    setNameValid(false);
  }

  function onNameChange(e: ChangeEvent<HTMLInputElement>) {
    // TODO: implement validation needed.
    setSubAccountName(e.target.value);
    setNameValid(false);
  }

  function onCancelEdit() {
    setEditingSubAccountId("");
    setNameValid(false);
    setSubAccountName("");
  }

  async function onSave() {
    if (subAccountName.trim() === "") return setNameValid(true);

    const assetIndex = assets.findIndex((a) => a.address === currentAsset.address);
    if (assetIndex === -1) return;

    const asset = assets[assetIndex];
    const subAccounts = asset.subAccounts.map((sa) =>
      sa.sub_account_id === currentSubAccount.sub_account_id ? { ...sa, subAccountName: subAccountName } : sa,
    );
    await db().updateAsset(asset.address, { ...asset, subAccounts: subAccounts }, { sync: true });

    setEditingSubAccountId("");
    setNameValid(false);
  }

  function getAccountStyles() {
    return clsx({
      ["relative flex flex-row justify-between items-center w-[calc(100%-2rem)] min-h-[3.5rem] pl-4 pr-4 text-PrimaryColor dark:text-PrimaryColorLight cursor-pointer hover:bg-[rgb(51,178,239,0.24)] text-md"]:
        true,
      ["bg-[rgb(51,178,239,0.24)]"]: isCurrentSubAccountSelected,
    });
  }

  function accName() {
    return clsx({ ["text-[#33b2ef]"]: isCurrentSubAccountSelected });
  }

  function subAccountIdStyles() {
    return clsx({
      ["text-[#33b2ef]"]: isCurrentSubAccountSelected,
      ["opacity-60"]: !isCurrentSubAccountSelected,
    });
  }

  function subAccountCurrencyStyles() {
    return clsx({
      ["opacity-60"]: !isCurrentSubAccountSelected,
    });
  }
}

const getDefaultAccountStyles = (isNotDefault = false) =>
  clsx("flex flex-row justify-between items-center gap-2", {
    "pr-6": !isNotDefault,
    "": isNotDefault,
  });
