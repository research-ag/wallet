// svg
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { BasicModal } from "@components/modal";
import { ServiceAsset } from "@redux/models/ServiceModels";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@components/button";
import { LoadingLoader } from "@components/loader";
import { useState } from "react";
import { getAssetIcon } from "@common/utils/icons";
import { IconTypeEnum } from "@common/const";

interface AddAssetWarningProps {
  open: boolean;
  setOpen(value: boolean): void;
  service: string;
  assetToAdd: ServiceAsset[];
  missingAsset: ServiceAsset[];
  addAssetsToService(servicePrin: string, assets: ServiceAsset[]): void;
  addAssetsToWallet(assets: ServiceAsset[]): void;
}

export const AddAssetWarning = (props: AddAssetWarningProps) => {
  const { open, setOpen, service, assetToAdd, missingAsset, addAssetsToService, addAssetsToWallet } = props;
  const { t } = useTranslation();
  const [isAddMissingLoading, setIsAddMissingLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);
  return (
    <BasicModal
      width="w-[20rem]"
      padding="py-5 px-4"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
      background="dark:bg-secondary-color-2 bg-PrimaryColorLight"
      open={open}
    >
      <div className="flex flex-col items-start justify-start w-full gap-4 reative text-md">
        <CloseIcon
          className="absolute cursor-pointer top-5 right-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={onClose}
        />
        <div className="flex flex-row justify-start items-center gap-3">
          <WarningIcon className="w-6 h-6" />
          <p className=" text-lg font-semibold">{t("missing.assets")}</p>
        </div>
        <div className="flex flex-col justify-start items-start gap-2">
          <p className="text-left">{t("missing.assets.msg")}</p>
          <div className="flex flex-row justify-start items-start w-full ">
            <div
              className={`flex flex-col justify-start items-start w-full  ${
                assetToAdd.length > 0 ? "border-r border-BorderColor/50 dark:border-BorderColorLight/50" : ""
              } pr-2 gap-1`}
            >
              <p>{t("missing.assets.to.add")}</p>
              {missingAsset.map((ast, k) => {
                return (
                  <div key={k} className="flex flex-row justify-start items-center gap-1">
                    {getAssetIcon(IconTypeEnum.Enum.FILTER, ast.tokenSymbol, ast.logo)}
                    <p>{ast.tokenSymbol}</p>
                  </div>
                );
              })}
            </div>
            {assetToAdd.length > 0 && (
              <div className="flex flex-col justify-start items-start w-full pl-2 gap-1">
                <p>{t("assets.to.add")}</p>
                {assetToAdd.map((ast, k) => {
                  return (
                    <div key={k} className="flex flex-row justify-start items-center gap-1">
                      {getAssetIcon(IconTypeEnum.Enum.FILTER, ast.tokenSymbol, ast.logo)}
                      <p>{ast.tokenSymbol}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <p className="text-sm opacity-75 text-left">
          {t(assetToAdd.length > 0 ? "missing.assets.warning1" : "missing.assets.warning2")}
        </p>
        <div className="flex flex-row justify-end items-center w-full gap-1">
          {assetToAdd.length > 0 && (
            <CustomButton className="min-w-[5rem]" onClick={onAddAssets} size={"small"}>
              {isAddLoading ? <LoadingLoader /> : <p>{t("only.add.listed")}</p>}
            </CustomButton>
          )}
          <CustomButton className="min-w-[5rem]" onClick={onAddMissing} size={"small"}>
            {isAddMissingLoading ? <LoadingLoader /> : <p>{t(assetToAdd.length > 0 ? "add.all" : "add.missing")}</p>}
          </CustomButton>
        </div>
      </div>
    </BasicModal>
  );
  function onClose() {
    setOpen(false);
  }
  async function onAddMissing() {
    setIsAddMissingLoading(true);
    await addAssetsToWallet(missingAsset);
    addAssetsToService(service, [...assetToAdd, ...missingAsset]);
    setIsAddMissingLoading(false);
    setOpen(false);
  }

  function onAddAssets() {
    setIsAddLoading(true);
    addAssetsToService(service, assetToAdd);
    setIsAddLoading(false);
    setOpen(false);
  }
};
