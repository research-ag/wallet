// svgsetassetsToAdd
import { IconTypeEnum } from "@/common/const";
import { ReactComponent as PlusIcon } from "@assets/svg/files/plus.svg";
import { getAssetIcon } from "@common/utils/icons";
//
import { CustomButton } from "@components/button";
import { CustomCheck } from "@components/checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Asset } from "@redux/models/AccountModels";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
interface ContactAssetPopProps {
  onAdd(data: Asset[]): void;
  assets: Asset[];
  btnClass?: string;
  compClass?: string;
  onOpen?: any;
  onClose?: any;
}

const ContactAssetPop = ({
  onAdd,
  assets,
  btnClass = "",
  compClass = "flex flex-row justify-center items-center w-full",
  onOpen,
  onClose,
}: ContactAssetPopProps) => {
  const { t } = useTranslation();
  const [assetsToAdd, setAssetsToAdd] = useState<Asset[]>([]);
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
            <div
              className={`h-[2rem] rounded-r-sm w-7 grid place-items-center ${
                assets.length === 0 ? "bg-GrayColor cursor-default" : ""
              } ${btnClass}`}
            >
              <PlusIcon className="w-3 h-3 fill-white" />
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="text-md bg-PrimaryColorLight rounded-lg dark:bg-SecondaryColor scroll-y-light z-[9999] text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-BorderColor/20"
              sideOffset={2}
              align="end"
            >
              <div className="flex flex-col justify-start items-start  dark:bg-SecondaryColor rounded-lg min-w-40 border border-BorderColorLight/20 dark:border-BorderColor/20 shadow max-h-64 z-[2000]">
                <div className="flex flex-col w-full scroll-y-light">
                  <div
                    className="flex flex-row items-center justify-between w-full px-3 py-2 rounded-t-lg hover:bg-secondary-color-1-light hover:dark:bg-HoverColor"
                    onClick={handleSelectAll}
                  >
                    <p>{t("selected.all")}</p>
                    <CustomCheck
                      className="border-BorderColorLight dark:border-BorderColor"
                      checked={assetsToAdd.length === assets.length}
                    />
                  </div>
                  {assets.map((asset, k) => {
                    return (
                      <div
                        key={k}
                        className={`flex flex-row justify-between items-center px-3 mr-1 py-2 w-full hover:bg-secondary-color-1-light hover:dark:bg-HoverColor ${
                          symbolToAdd.includes(asset.tokenSymbol) && assetsToAdd.length !== assets.length
                            ? "bg-HoverColorLight dark:bg-HoverColor"
                            : ""
                        }`}
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
                          checked={symbolToAdd.includes(asset.tokenSymbol)}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-center w-full p-2 pt-4 rounded-b-lg">
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

  function setToAdd(assets: Asset[], symbols: string[]) {
    setAssetsToAdd(assets);
    setSymbolsToAdd(symbols);
  }

  function handleSelectAll() {
    if (assetsToAdd.length === assets.length) {
      setToAdd([], []);
    } else {
      setToAdd(
        assets,
        assets.map((ast) => ast.tokenSymbol),
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
      setToAdd([...assetsToAdd, asset], [...symbolToAdd, asset.tokenSymbol]);
    }
  }

  function handleAddAssetButton() {
    onAdd(assetsToAdd);
    setToAdd([], []);
    setOpenDrop(false);
  }
};

export default ContactAssetPop;
