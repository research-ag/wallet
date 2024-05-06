// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { BasicModal } from "@components/modal";
import { IconTypeEnum } from "@/const";
import { useTranslation } from "react-i18next";
import { Asset } from "@redux/models/AccountModels";
import { getAssetIcon } from "@/utils/icons";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import {
  AssetMutationAction,
  AssetMutationResult,
  setAssetMutation,
  setAssetMutationAction,
  setAssetMutationResult,
} from "@redux/assets/AssetReducer";
import { useEffect, useRef } from "react";
import clsx from "clsx";

interface DialogAssetConfirmationProps {
  newAsset: Asset;
}

const DialogAssetConfirmation = ({ newAsset }: DialogAssetConfirmationProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { assetResult, assetAction } = useAppSelector((state) => state.asset.mutation);
  const newAssetCached = useRef<Asset | undefined>(undefined);

  const isModalOpen = assetResult !== AssetMutationResult.NONE;

  useEffect(() => {
    const isActionAllowed = assetAction !== AssetMutationAction.NONE && assetAction !== AssetMutationAction.DELETE;

    const isNewAssetValid = newAsset && newAsset.name.trim().length > 0;

    if (isActionAllowed && isNewAssetValid) {
      newAssetCached.current = newAsset;
    }
  }, [assetAction, newAsset]);

  return (
    <BasicModal
      open={isModalOpen}
      width="w-[18rem]"
      padding="py-3 px-1"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
    >
      <div className="flex flex-col items-center justify-start w-full">
        <CloseIcon
          className="absolute cursor-pointer top-5 right-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={onClose}
        />
        <div className="flex flex-col items-center justify-start w-full py-2">
          {getAssetIcon(IconTypeEnum.Enum.ASSET, newAssetCached?.current?.tokenSymbol, newAssetCached?.current?.logo)}
          <p className={getMessageTextStyles(assetResult)}> {getMessage(assetResult)} </p>
        </div>
      </div>
    </BasicModal>
  );

  function onClose() {
    dispatch(setAssetMutationResult(AssetMutationResult.NONE));
    dispatch(setAssetMutationAction(AssetMutationAction.NONE));
    dispatch(setAssetMutation(undefined));
  }

  function getMessageTextStyles(status: AssetMutationResult) {
    const resultTextStyles = clsx("text-lg font-semibold mt-3");

    switch (status) {
      case AssetMutationResult.ADDING:
        return clsx(resultTextStyles, "text-black-color dark:text-gray-color-9");
      case AssetMutationResult.ADDED:
        return clsx(resultTextStyles, "text-slate-color-success");
      case AssetMutationResult.FAILED:
        return clsx(resultTextStyles, "text-slate-color-error");
      default:
        return resultTextStyles;
    }
  }

  function getMessage(status: AssetMutationResult) {
    switch (status) {
      case AssetMutationResult.ADDING:
        return t("adding.asset");

      case AssetMutationResult.ADDED:
        return t("adding.asset.successful");

      case AssetMutationResult.FAILED:
        return t("adding.asset.failed");
      default:
        return "";
    }
  }
};

export default DialogAssetConfirmation;
