import { ReactComponent as DropIcon } from "@assets/svg/files/chevron-right-icon.svg";
import { IconTypeEnum } from "@common/const";
import { getAssetIcon } from "@common/utils/icons";
import { CustomCheck } from "@components/checkbox";
import { BasicSwitch } from "@components/switch";
//
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ServiceAsset } from "@redux/models/ServiceModels";
import { clsx } from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useServiceAsset from "../hooks/useServiceAsset";

interface AssetFilterProps {
  assetFilter: string[];
  onAssetFilterChange: (assetFilter: string[]) => void;
  supportedAssetsActive: boolean;
  setSupportedAssetsActive: (assetFilter: boolean) => void;
  filterAssets: ServiceAsset[];
}

export default function AssetFilter({
  assetFilter,
  onAssetFilterChange,
  supportedAssetsActive,
  setSupportedAssetsActive,
  filterAssets,
}: AssetFilterProps) {
  const { t } = useTranslation();
  const { getAssetFromUserAssets } = useServiceAsset();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <p className="mr-2 text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("asset")}</p>
      <DropdownMenu.Root onOpenChange={onOpenChange}>
        <DropdownMenu.Trigger asChild>
          <div className={triggerContainerStyles}>
            <div className="flex flex-row items-center justify-between w-full">
              {assetFilter.length === 0 || assetFilter.length === filterAssets.length ? (
                <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("all")}</p>
              ) : assetFilter.length === 1 ? (
                <div className="flex items-center justify-start gap-2 flex-start">
                  {getAssetIcon(
                    IconTypeEnum.Enum.FILTER,
                    filterAssets.find((ast) => ast.tokenSymbol === assetFilter[0])?.tokenSymbol,
                    filterAssets.find((ast) => ast.tokenSymbol === assetFilter[0])?.logo,
                  )}
                  <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{assetFilter[0]}</p>
                </div>
              ) : (
                <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{`${assetFilter.length} ${t(
                  "selections",
                )}`}</p>
              )}

              <DropIcon className={`fill-gray-color-4 ${open ? "-rotate-90" : ""}`} />
            </div>
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={contentContainerStyles} sideOffset={2} align="end">
            <div className="flex flex-row justify-between items-center w-full px-3 py-2 hover:bg-secondary-color-1-light hover:dark:bg-HoverColor">
              <p>{t("supported.assets")}</p>
              <BasicSwitch checked={supportedAssetsActive} onChange={onCheckedChange} />
            </div>
            <div
              onClick={handleSelectAll}
              className="flex flex-row items-center justify-between w-full px-3 py-2 hover:bg-secondary-color-1-light hover:dark:bg-HoverColor"
            >
              <p>{t("selected.all")}</p>
              <CustomCheck
                className="border-secondary-color-2-light dark:border-BorderColor"
                checked={assetFilter.length === filterAssets.length}
              />
            </div>
            {filterAssets.map((asset, k) => {
              const ast = getAssetFromUserAssets(asset.principal);
              return (
                <div
                  key={k}
                  className={assetStyle(k, filterAssets)}
                  onClick={() => {
                    handleSelectAsset(asset);
                  }}
                >
                  <div className="flex items-center justify-start gap-2 flex-start">
                    {getAssetIcon(
                      IconTypeEnum.Enum.FILTER,
                      ast?.tokenSymbol || asset.tokenSymbol,
                      ast?.logo || asset.logo,
                    )}
                    <p>{ast?.symbol || asset.tokenSymbol}</p>
                  </div>

                  <CustomCheck
                    className="border-BorderColorLight dark:border-BorderColor"
                    checked={assetFilter.includes(asset.tokenSymbol)}
                  />
                </div>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );

  function onOpenChange(open: boolean) {
    setOpen(open);
  }

  function handleSelectAll() {
    if (assetFilter.length === filterAssets.length) onAssetFilterChange([]);
    else {
      const symbols = filterAssets.map((currentAsset) => {
        return currentAsset.tokenSymbol;
      });
      onAssetFilterChange(symbols);
    }
  }

  function handleSelectAsset(asset: ServiceAsset) {
    if (assetFilter.includes(asset.tokenSymbol)) {
      const auxSymbols = assetFilter.filter((currentAsset) => currentAsset !== asset.tokenSymbol);
      onAssetFilterChange(auxSymbols);
    } else onAssetFilterChange([...assetFilter, asset.tokenSymbol]);
  }

  function onCheckedChange(checked: boolean) {
    setSupportedAssetsActive(checked);
  }
}

const assetStyle = (k: number, assets: any[]) =>
  clsx({
    ["flex flex-row justify-between items-center px-3 py-2 w-full hover:bg-secondary-color-1-light hover:dark:bg-HoverColor"]:
      true,
    ["rounded-b-lg"]: k === assets.length - 1,
  });

const triggerContainerStyles = clsx(
  "flex flex-row justify-start items-center cursor-pointer",
  "border border-BorderColorLight dark:border-BorderColor",
  "rounded px-2 py-1 w-[12rem] h-[2.4rem]",
  "bg-SecondaryColorLight dark:bg-SecondaryColor",
);

const contentContainerStyles = clsx(
  "text-md bg-PrimaryColorLight w-[12rem]",
  "rounded-lg dark:bg-SecondaryColor scroll-y-light z-[999]",
  "max-h-80 text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight",
  "dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-BorderColor/20",
);
