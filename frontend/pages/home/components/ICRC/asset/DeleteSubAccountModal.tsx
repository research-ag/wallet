import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { BasicModal } from "@components/modal";
import { CustomButton } from "@components/button";
import { LoadingLoader } from "@components/loader";
import { useTranslation } from "react-i18next";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { useState } from "react";
import { db } from "@/database/db";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { setAccordionAssetIdx, setSelectedAccount } from "@redux/assets/AssetReducer";

interface DeleteSubAccountModalProps {
  isDeleteModalOpen: boolean;
  onClose: () => void;
  currentSubAccount: SubAccount;
  currentAsset: Asset;
}

export default function DeleteSubAccountModal(props: DeleteSubAccountModalProps) {
  const { isDeleteModalOpen, onClose, currentSubAccount, currentAsset } = props;
  const dispatch = useAppDispatch();
  const { assets } = useAppSelector((state) => state.asset.list);
  const [isDeleteLoading, setDeleteLoading] = useState(false);
  const { t } = useTranslation();
  return (
    <BasicModal
      width="w-[18rem]"
      padding="py-5 px-4"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
      open={isDeleteModalOpen}
    >
      <div className="flex flex-col items-start justify-start w-full gap-4 reative text-md">
        <CloseIcon
          className="absolute cursor-pointer top-5 right-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={onClose}
        />
        <WarningIcon className="w-6 h-6" />

        <p className="w-full break-words">
          {t("delete.subacc.msg")}
          <span className="ml-1 font-semibold">
            {currentSubAccount.name === "-"
              ? `${t("subacc")}-${currentSubAccount.sub_account_id}`
              : currentSubAccount.name}
          </span>
          ?
        </p>

        <div className="flex flex-row items-start justify-end w-full ">
          <CustomButton className="min-w-[5rem]" onClick={onConfirm} size={"small"}>
            {isDeleteLoading ? <LoadingLoader /> : <p>{t("yes")}</p>}
          </CustomButton>
        </div>
      </div>
    </BasicModal>
  );

  async function onConfirm() {
    setDeleteLoading(true);

    const assetIndex = assets.findIndex((a) => a.address === currentAsset.address);

    if (assetIndex === -1) {
      setDeleteLoading(false);
      return;
    }

    const asset = assets[Number(assetIndex)];

    const subAccounts = asset.subAccounts
      .map((sa) => (sa.sub_account_id !== currentSubAccount.sub_account_id ? sa : null!))
      .filter((x) => !!x);

    await db().updateAsset(
      asset.address,
      {
        ...asset,
        subAccounts: subAccounts,
      },
      { sync: true },
    );

    dispatch(setSelectedAccount(subAccounts[0]));
    dispatch(setAccordionAssetIdx([asset.tokenSymbol]));

    onClose();
    setDeleteLoading(false);
  }
}
