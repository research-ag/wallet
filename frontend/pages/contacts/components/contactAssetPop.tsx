// svgsetassetsToAdd
import { IconType, IconTypeEnum } from "@/const";
import PlusIcon from "@assets/svg/files/plus-icon.svg";
//
import { CustomButton } from "@components/Button";
import { CustomCheck } from "@components/CheckBox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Asset, AssetToAdd } from "@redux/models/AccountModels";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
interface ContactAssetPopProps {
  onAdd(data: AssetToAdd[]): void;
  assets: Asset[];
  getAssetIcon(type: IconType, symbol?: string, logo?: string): JSX.Element;
  btnClass?: string;
  compClass?: string;
  onOpen?: any;
  onClose?: any;
}

const ContactAssetPop = ({
  onAdd,
  assets,
  getAssetIcon,
  btnClass = "",
  compClass = "flex flex-row justify-center items-center w-full",
  onOpen,
  onClose,
}: ContactAssetPopProps) => {
  const { t } = useTranslation();
  const [assetsToAdd, setAssetsToAdd] = useState<AssetToAdd[]>([]);
  const [symbolToAdd, setSymbolsToAdd] = useState<string[]>([]);
  const [openDrop, setOpenDrop] = useState<boolean>(false);

  useEffect(() => {
    if (openDrop) {
      onOpen && onOpen();
    } else {
      onClose && onClose();
    }
  }, [openDrop]);

  return (
    <Fragment>
      <div className={`${compClass}`}>
        <DropdownMenu.Root open={openDrop && assets.length > 0} onOpenChange={setOpenDrop}>
          <DropdownMenu.Trigger className="!p-0">
            <CustomButton
              className={`${assets.length === 0 ? "bg-GrayColor cursor-default" : ""} ${btnClass}`}
              size={"icon"}
            >
              <img src={PlusIcon} alt="plus-icon" />
            </CustomButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="text-md bg-PrimaryColorLight w-[10rem] rounded-lg dark:bg-SecondaryColor scroll-y-light z-[9999] max-h-80 text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-BorderColor/20"
              sideOffset={2}
              align="end"
            >
              <div className="flex flex-col justify-start items-start bg-SecondaryColorLight dark:bg-SecondaryColor rounded-lg w-40 border border-BorderColorLight/20 dark:border-BorderColor/20 shadow max-h-64 z-[2000]">
                <div className="flex flex-col w-full scroll-y-light">
                  <button
                    className={
                      "flex flex-row justify-between items-center rounded-t-lg px-3 py-2 w-full hover:bg-HoverColorLight hover:dark:bg-HoverColor"
                    }
                    onClick={handleSelectAll}
                  >
                    <p>{t("selected.all")}</p>
                    <CustomCheck
                      className="border-BorderColorLight dark:border-BorderColor"
                      checked={assetsToAdd.length === assets.length}
                    />
                  </button>
                  {assets.map((asset, k) => {
                    return (
                      <button
                        key={k}
                        className={`flex flex-row justify-between items-center px-3 py-2 w-full hover:bg-HoverColorLight hover:dark:bg-HoverColor ${
                          symbolToAdd.includes(asset.tokenSymbol) && assetsToAdd.length !== assets.length
                            ? "bg-HoverColorLight dark:bg-HoverColor"
                            : ""
                        }`}
                        onClick={() => {
                          handleSelectAsset(asset);
                        }}
                      >
                        <div className="flex flex-start justify-start items-center gap-2">
                          {getAssetIcon(IconTypeEnum.Enum.FILTER, asset.tokenSymbol, asset.logo)}
                          <p>{asset.symbol}</p>
                        </div>

                        <CustomCheck
                          className="border-BorderColorLight dark:border-BorderColor"
                          checked={symbolToAdd.includes(asset.tokenSymbol)}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-center items-center p-2 pt-4 w-full rounded-b-lg">
                  <CustomButton onClick={handleAddAssetButton} size={"small"} className="w-full">
                    <p>{t("add.asset")}</p>
                  </CustomButton>
                </div>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </Fragment>
  );

  function setToAdd(assets: AssetToAdd[], tokens: string[]) {
    setAssetsToAdd(assets);
    setSymbolsToAdd(tokens);
  }

  function handleSelectAll() {
    if (assetsToAdd.length === assets.length) {
      setToAdd([], []);
    } else {
      setToAdd(
        assets.map((ast) => {
          return { symbol: ast.symbol, tokenSymbol: ast.tokenSymbol, logo: ast.logo };
        }),
        assets.map((ast) => {
          return ast.tokenSymbol;
        }),
      );
    }
  }

  function handleSelectAsset(asset: Asset) {
    if (symbolToAdd.includes(asset.tokenSymbol)) {
      setToAdd(
        assetsToAdd.filter((ast) => ast.tokenSymbol !== asset.tokenSymbol),
        symbolToAdd.filter((ast) => ast !== asset.tokenSymbol),
      );
    } else {
      setToAdd(
        [...assetsToAdd, { symbol: asset.symbol, tokenSymbol: asset.tokenSymbol, logo: asset.logo }],
        [...symbolToAdd, asset.tokenSymbol],
      );
    }
  }

  function handleAddAssetButton() {
    onAdd(assetsToAdd);
    setToAdd([], []);
    setOpenDrop(false);
  }
};

export default ContactAssetPop;
