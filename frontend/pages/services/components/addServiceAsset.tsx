// svg
import { ReactComponent as PlusIcon } from "@assets/svg/files/plus-icon.svg";
import { IconTypeEnum } from "@common/const";
import { getAssetIcon } from "@common/utils/icons";
import { CustomButton } from "@components/button";
import { CustomCheck } from "@components/checkbox";
//
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAppSelector } from "@redux/Store";
import { ServiceAsset } from "@redux/models/ServiceModels";
import { clsx } from "clsx";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { AddAssetWarning } from "./Modals/addAssetWarning";
import useServiceAsset from "../hooks/useServiceAsset";

interface AddServiceassetProps {
  servicePrincipal: string;
  assets: ServiceAsset[];
  assetsToAdd: ServiceAsset[];
  setAssetsToAdd(value: ServiceAsset[]): void;
  addAssetsToService(servicePrin: string, assets: ServiceAsset[]): void;
  addAssetsToWallet(assets: ServiceAsset[]): void;
}

export const AddServiceAsset = (props: AddServiceassetProps) => {
  const userAssets = useAppSelector((state) => state.asset.list.assets);
  const { servicePrincipal, assets, assetsToAdd, setAssetsToAdd, addAssetsToService, addAssetsToWallet } = props;
  const { t } = useTranslation();
  const { getAssetFromUserAssets } = useServiceAsset();
  const [open, setOpen] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [missingAssets, setMissingAssets] = useState<ServiceAsset[]>([]);
  const [inListAssets, setInLsitAssets] = useState<ServiceAsset[]>([]);

  return (
    <Fragment>
      <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
        <DropdownMenu.Trigger asChild>
          <button className="flex flex-row px-2 py-1 gap-1 justify-center items-center rounded-md bg-SelectRowColor">
            <PlusIcon className="w-4 h-4" />
            <p className="text-PrimaryTextColor">{t("asset")}</p>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={contentContainerStyles} sideOffset={2} align="center">
            <div
              onClick={handleSelectAll}
              className="flex flex-row items-center justify-between w-full px-3 py-2 hover:bg-secondary-color-1-light hover:dark:bg-HoverColor"
            >
              <p>{t("selected.all")}</p>
              <CustomCheck
                className="border-secondary-color-2-light dark:border-BorderColor"
                checked={assets.length === assetsToAdd.length}
              />
            </div>
            {assets.map((asset, k) => {
              const userAsset = getAssetFromUserAssets(asset.principal);
              return (
                <div
                  key={k}
                  className={assetStyle(k, assets)}
                  onClick={() => {
                    handleSelectAsset(asset);
                  }}
                >
                  <div className="flex items-center justify-start gap-2 flex-start">
                    {getAssetIcon(IconTypeEnum.Enum.FILTER, userAsset?.tokenSymbol, asset.logo)}
                    <p>{asset.tokenSymbol}</p>
                  </div>

                  <CustomCheck
                    className="border-BorderColorLight dark:border-BorderColor"
                    checked={assetsToAdd.includes(asset)}
                  />
                </div>
              );
            })}
            <div className="flex justify-end items-center w-full py-2 px-3">
              <CustomButton onClick={handleAddAssetButton} size={"small"} className="w-1/3">
                <p>{t("add")}</p>
              </CustomButton>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      {openAddModal && (
        <AddAssetWarning
          open={openAddModal}
          setOpen={setOpenAddModal}
          service={servicePrincipal}
          assetToAdd={inListAssets}
          missingAsset={missingAssets}
          addAssetsToService={addAssetsToService}
          addAssetsToWallet={addAssetsToWallet}
        />
      )}
    </Fragment>
  );
  function onOpenChange(value: boolean) {
    setOpen(value);
    setAssetsToAdd([]);
  }
  function handleSelectAll() {
    if (assets.length === assetsToAdd.length) setAssetsToAdd([]);
    else {
      setAssetsToAdd(assets);
    }
  }
  function handleSelectAsset(asset: ServiceAsset) {
    if (assetsToAdd.includes(asset)) {
      const auxSymbols = assetsToAdd.filter((currentAsset) => currentAsset !== asset);
      setAssetsToAdd(auxSymbols);
    } else setAssetsToAdd([...assetsToAdd, asset]);
  }
  function handleAddAssetButton() {
    if (assetsToAdd.length > 0) {
      const nonInList: ServiceAsset[] = [];
      const inList: ServiceAsset[] = [];
      assetsToAdd.map((ast) => {
        const includeList = userAssets.find((asst) => asst.address === ast.principal);
        if (includeList) inList.push(ast);
        else nonInList.push(ast);
      });
      if (nonInList.length > 0) {
        setMissingAssets(nonInList);
        setInLsitAssets(inList);
        setOpenAddModal(true);
        setOpen(false);
      } else addAssetsToService(servicePrincipal, assetsToAdd);
      setOpen(false);
    }
  }
};
const assetStyle = (k: number, assets: any[]) =>
  clsx({
    ["flex flex-row justify-between items-center px-3 py-2 w-full hover:bg-secondary-color-1-light hover:dark:bg-HoverColor"]:
      true,
    ["rounded-b-lg"]: k === assets.length - 1,
  });
const contentContainerStyles = clsx(
  "text-md bg-PrimaryColorLight w-[12rem]",
  "rounded-lg dark:bg-SecondaryColor scroll-y-light z-[999]",
  "max-h-80 text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight",
  "dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-BorderColor/20",
);
