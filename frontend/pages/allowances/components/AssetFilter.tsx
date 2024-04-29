import { IconTypeEnum } from "@/const";
import { getAssetIcon } from "@/utils/icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAppSelector } from "@redux/Store";
import { useTranslation } from "react-i18next";
import { ReactComponent as DropIcon } from "@assets/svg/files/chevron-right-icon.svg";
import { Asset } from "@redux/models/AccountModels";
import { clsx } from "clsx";
import { CustomCheck } from "@components/checkbox";

interface AssetFilterProps {
  setAssetSelectOpen: (open: boolean) => void;
  selectedAssets: string[];
  assetSelectOpen: boolean;
  setSelectedAssets: (filter: string[]) => void;
}

export default function AssetFilter(props: AssetFilterProps) {
  const { setAssetSelectOpen, selectedAssets, assetSelectOpen, setSelectedAssets } = props;
  const { t } = useTranslation();
  const { assets } = useAppSelector((state) => state.asset);

  return (
    <DropdownMenu.Root
      onOpenChange={(e: boolean) => {
        setAssetSelectOpen(e);
      }}
    >
      <DropdownMenu.Trigger asChild>
        <div className={triggerContainerStyles}>
          <div className="flex flex-row items-center justify-between w-full">
            {selectedAssets.length === 0 || selectedAssets.length === assets.length ? (
              <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("all")}</p>
            ) : selectedAssets.length === 1 ? (
              <div className="flex items-center justify-start gap-2 flex-start">
                {getAssetIcon(
                  IconTypeEnum.Enum.FILTER,
                  assets.find((ast) => ast.symbol === selectedAssets[0])?.tokenSymbol,
                  assets.find((ast) => ast.symbol === selectedAssets[0])?.logo,
                )}
                <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{selectedAssets[0]}</p>
              </div>
            ) : (
              <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{`${selectedAssets.length} ${t(
                "selections",
              )}`}</p>
            )}

            <DropIcon className={`fill-gray-color-4 ${assetSelectOpen ? "-rotate-90" : ""}`} />
          </div>
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={contentContainerStyles} sideOffset={2} align="end">
          <button
            onClick={handleSelectAll}
            className="flex flex-row items-center justify-between w-full px-3 py-2 rounded-t-lg hover:bg-secondary-color-1-light hover:dark:bg-HoverColor"
          >
            <p>{t("selected.all")}</p>
            <CustomCheck
              className="border-secondary-color-2-light dark:border-BorderColor"
              checked={selectedAssets.length === assets.length}
            />
          </button>
          {assets.map((asset, k) => {
            return (
              <button
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
                  checked={selectedAssets.includes(asset.symbol)}
                />
              </button>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  function handleSelectAll() {
    if (selectedAssets.length === assets.length) setSelectedAssets([]);
    else {
      const symbols = assets.map((currentAsset) => {
        return currentAsset.symbol;
      });
      setSelectedAssets(symbols);
    }
  }

  function handleSelectAsset(asset: Asset) {
    if (selectedAssets.includes(asset.symbol)) {
      const auxSymbols = selectedAssets.filter((currentAsset) => currentAsset !== asset.symbol);
      setSelectedAssets(auxSymbols);
    } else setSelectedAssets([...selectedAssets, asset.symbol]);
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
  "rounded px-2 py-1 w-[10rem] h-[2.5rem]",
  "bg-SecondaryColorLight dark:bg-SecondaryColor",
);

const contentContainerStyles = clsx(
  "text-md bg-PrimaryColorLight w-[10rem]",
  "rounded-lg dark:bg-SecondaryColor scroll-y-light z-[999]",
  "max-h-80 text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight",
  "dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-BorderColor/20",
);
