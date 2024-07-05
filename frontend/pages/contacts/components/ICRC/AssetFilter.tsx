import { ReactComponent as DropIcon } from "@assets/svg/files/chevron-right-icon.svg";
import { IconTypeEnum } from "@common/const";
import { getAssetIcon } from "@common/utils/icons";
import { CustomCheck } from "@components/checkbox";
//
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Asset } from "@redux/models/AccountModels";
import { useAppSelector } from "@redux/Store";
import clsx from "clsx";
import { isEqual } from "lodash";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";

interface AssetFilterProps {
  assetFilter: string[];
  onAssetFilterChange: (assetFilter: string[]) => void;
}

function AssetFilter({ assetFilter, onAssetFilterChange }: AssetFilterProps) {
  const { t } = useTranslation();
  const { assets } = useAppSelector((state) => state.asset.list);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <p className="mr-2 text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("asset")}</p>
      <DropdownMenu.Root onOpenChange={onOpenChange}>
        <DropdownMenu.Trigger asChild>
          <div className={triggerContainerStyles}>
            <div className="flex flex-row items-center justify-between w-full">
              {assetFilter.length === 0 || assetFilter.length === assets.length ? (
                <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("all")}</p>
              ) : assetFilter.length === 1 ? (
                <div className="flex items-center justify-start gap-2 flex-start">
                  {getAssetIcon(
                    IconTypeEnum.Enum.FILTER,
                    assets.find((ast) => ast.symbol === assetFilter[0])?.tokenSymbol,
                    assets.find((ast) => ast.symbol === assetFilter[0])?.logo,
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
            <div
              onClick={handleSelectAll}
              className="flex flex-row items-center justify-between w-full px-3 py-2 rounded-t-lg hover:bg-secondary-color-1-light hover:dark:bg-HoverColor"
            >
              <p>{t("selected.all")}</p>
              <CustomCheck
                className="border-secondary-color-2-light dark:border-BorderColor"
                checked={assetFilter.length === assets.length}
              />
            </div>
            {assets.map((asset, k) => {
              return (
                <div
                  key={k}
                  className={assetStyle(k, assets)}
                  onClick={() => {
                    handleSelectAsset(asset);
                  }}
                >
                  <div className="flex items-center justify-start gap-2 flex-start">
                    {getAssetIcon(IconTypeEnum.Enum.FILTER, asset.tokenSymbol, asset.logo)}
                    <p>{asset.symbol}</p>
                  </div>

                  <CustomCheck
                    className="border-BorderColorLight dark:border-BorderColor"
                    checked={assetFilter.includes(asset.symbol)}
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
    if (assetFilter.length === assets.length) onAssetFilterChange([]);
    else {
      const symbols = assets.map((currentAsset) => {
        return currentAsset.symbol;
      });
      onAssetFilterChange(symbols);
    }
  }

  function handleSelectAsset(asset: Asset) {
    if (assetFilter.includes(asset.symbol)) {
      const auxSymbols = assetFilter.filter((currentAsset) => currentAsset !== asset.symbol);
      onAssetFilterChange(auxSymbols);
    } else onAssetFilterChange([...assetFilter, asset.symbol]);
  }
}

const assetStyle = (k: number, assets: Asset[]) =>
  clsx({
    ["flex flex-row justify-between items-center px-3 py-2 w-full hover:bg-secondary-color-1-light hover:dark:bg-HoverColor"]:
      true,
    ["rounded-b-lg"]: k === assets.length - 1,
  });

const triggerContainerStyles = clsx(
  "flex flex-row justify-start items-center cursor-pointer",
  "border border-BorderColorLight dark:border-BorderColor",
  "rounded px-2 py-1 w-[10rem] h-[2.4rem]",
  "bg-SecondaryColorLight dark:bg-SecondaryColor",
);

const contentContainerStyles = clsx(
  "text-md bg-PrimaryColorLight w-[10rem]",
  "rounded-lg dark:bg-SecondaryColor scroll-y-light z-[999]",
  "max-h-80 text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight",
  "dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-BorderColor/20",
);

export default memo(AssetFilter, arePropsEqual);

function arePropsEqual(prevProps: AssetFilterProps, nextProps: AssetFilterProps) {
  if (prevProps === nextProps) return true;
  return (
    isEqual(prevProps.assetFilter, nextProps.assetFilter) &&
    isEqual(prevProps.onAssetFilterChange, nextProps.onAssetFilterChange)
  );
}
