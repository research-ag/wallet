// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { BasicModal } from "@components/modal";
import { IconTypeEnum } from "@/common/const";
import { useTranslation } from "react-i18next";
import { getAssetIcon } from "@/common/utils/icons";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { AssetMutationResult, setAssetMutation, setAssetMutationResult } from "@redux/assets/AssetReducer";
import { useEffect } from "react";
import clsx from "clsx";

const DialogAssetConfirmation = ({ isModalOpen }: { isModalOpen: boolean }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { assetResult, assetAction, assetMutated } = useAppSelector((state) => state.asset.mutation);

  useEffect(() => {
    const closeTimer = setTimeout(() => {
      dispatch(setAssetMutationResult(AssetMutationResult.NONE));
      dispatch(setAssetMutation(undefined));
    }, 5000);

    return () => {
      clearTimeout(closeTimer);
    };
  }, [assetAction, assetMutated]);

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
          {getAssetIcon(IconTypeEnum.Enum.ASSET, assetMutated?.tokenSymbol, assetMutated?.logo)}
          <p className={getMessageTextStyles(assetResult)}> {getMessage(assetResult)} </p>
        </div>
      </div>
    </BasicModal>
  );

  function onClose() {
    dispatch(setAssetMutation(undefined));
    dispatch(setAssetMutationResult(AssetMutationResult.NONE));
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

export default function Wrapper() {
  const { assetResult } = useAppSelector((state) => state.asset.mutation);
  const isModalOpen = assetResult !== AssetMutationResult.NONE;

  if (!isModalOpen) return <></>;

  return <DialogAssetConfirmation isModalOpen={isModalOpen} />;
}
