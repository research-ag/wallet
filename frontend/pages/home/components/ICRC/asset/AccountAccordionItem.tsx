import PlusIcon from "@assets/svg/files/plus-icon.svg";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-icon.svg";
//
import { CustomInput } from "@components/input";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomCopy } from "@components/tooltip";
import DeleteSubAccountModal from "./DeleteSubAccountModal";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { db } from "@/database/db";
import { setSelectedAccount, setSelectedAsset, setSubAccountMutation } from "@redux/assets/AssetReducer";
import { toFullDecimal } from "@common/utils/amount";

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
  const dispatch = useAppDispatch();
  const { assets } = useAppSelector((state) => state.asset.list);
  const { selectedAccount, selectedAsset } = useAppSelector((state) => state.asset.helper);
  const { subAccountMutation } = useAppSelector((state) => state.asset.mutation);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const isCurrentEdit =
    subAccountMutation?.sub_account_id === currentSubAccount.sub_account_id &&
    currentAsset?.tokenSymbol === subAccountMutation?.symbol;

  const isNameInvalid = !subAccountMutation
    ? true
    : subAccountMutation.name.trim() === "" || subAccountMutation.name.trim().length > 15;

  const hasBalance = Number(currentSubAccount?.amount) > 0;
  const isDefaultAccount = currentSubAccount?.sub_account_id === "0x0";

  return (
    <>
      <div aria-haspopup="true" className={getAccountStyles()} onClick={onSelectSubAccount}>
        <div className="flex flex-col items-start justify-center">
          {isCurrentEdit ? (
            <div className="flex flex-row items-center justify-start">
              <CustomInput
                intent={"primary"}
                placeholder={""}
                value={subAccountMutation?.name || ""}
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
        <div className={getDefaultAccountStyles(hasBalance || isDefaultAccount)}>
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
          {!hasBalance && !isDefaultAccount && (
            <button className="p-0" onClick={() => setDeleteModalOpen(true)}>
              <TrashIcon className="w-3 h-3 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor" />
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

  function onSelectSubAccount() {
    if (isCurrentEdit) return;
    dispatch(setSubAccountMutation(undefined));
    if (selectedAsset?.address !== currentAsset.address) dispatch(setSelectedAsset(currentAsset));
    if (selectedAccount?.sub_account_id !== currentSubAccount.sub_account_id)
      dispatch(setSelectedAccount(currentSubAccount));
  }

  function onEditSubAccount() {
    dispatch(setSubAccountMutation(currentSubAccount));
  }

  function onNameChange(e: ChangeEvent<HTMLInputElement>) {
    subAccountMutation && dispatch(setSubAccountMutation({ ...subAccountMutation, name: e.target.value }));
  }

  function onCancelEdit() {
    dispatch(setSubAccountMutation(undefined));
  }

  async function onSave() {
    if (isNameInvalid) return;

    const assetIndex = assets.findIndex((a) => a.address === currentAsset.address);
    if (assetIndex === -1) return;

    const asset = assets[assetIndex];

    const subAccounts: SubAccount[] = asset.subAccounts.map((sa) =>
      sa.sub_account_id === currentSubAccount.sub_account_id ? { ...sa, ...subAccountMutation } : sa,
    );

    await db().updateAsset(asset.address, { ...asset, subAccounts: subAccounts }, { sync: true });
    dispatch(setSubAccountMutation(undefined));
  }

  function getAccountStyles() {
    return clsx({
      ["relative flex justify-between items-center w-[calc(100%-2rem)] min-h-[3.5rem] text-PrimaryColor dark:text-PrimaryColorLight cursor-pointer hover:bg-[rgb(51,178,239,0.24)] text-md px-1"]:
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
    "pr-6": isNotDefault,
  });
