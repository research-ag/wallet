// svgs
import SearchIcon from "@assets/svg/files/icon-search.svg";
import { ReactComponent as PlusIcon } from "@assets/svg/files/plus-icon.svg";
import ChevronRightIcon from "@assets/svg/files/chevron-right-icon.svg";
import ChevronRightDarkIcon from "@assets/svg/files/chevron-right-dark-icon.svg";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CustomInput } from "@components/Input";
import { GeneralHook } from "@pages/home/hooks/generalHook";
import { ThemeHook } from "@pages/hooks/themeHook";
import { IconTypeEnum, ThemesEnum } from "@/const";
import { CustomCheck } from "@components/CheckBox";
import Modal from "@components/Modal";
import clsx from "clsx";
import { Asset } from "@redux/models/AccountModels";
import { IUseContactFilters } from "../hooks/useContactFilters";
import AddContact from "./addContact";
import { IconButton } from "@components/button";

const ContactFilters = ({
  searchKey,
  assetFilter,
  assetOpen,
  addOpen,
  setAssetFilter,
  setAssetOpen,
  setSearchKey,
  setAddOpen,
}: IUseContactFilters) => {
  const { t } = useTranslation();
  const { theme } = ThemeHook();
  const { assets, getAssetIcon } = GeneralHook();

  return (
    <Fragment>
      <div className="flex flex-row items-center justify-start w-full gap-3 text-md">
        <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("asset")}</p>

        <DropdownMenu.Root
          onOpenChange={(e: boolean) => {
            setAssetOpen(e);
          }}
        >
          <DropdownMenu.Trigger asChild>
            <div className="flex flex-row justify-start items-center border border-BorderColorLight dark:border-BorderColor rounded px-2 py-1 w-[10rem] h-[2.5rem] bg-SecondaryColorLight dark:bg-SecondaryColor">
              <div className="flex flex-row items-center justify-between w-full">
                {assetFilter.length === 0 || assetFilter.length === assets.length ? (
                  <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("all")}</p>
                ) : assetFilter.length === 1 ? (
                  <div className="flex items-center justify-start gap-2 flex-start">
                    {getAssetIcon(
                      IconTypeEnum.Enum.FILTER,
                      assetFilter[0],
                      assets.find((ast) => ast.tokenSymbol === assetFilter[0])?.logo,
                    )}
                    <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{assetFilter[0]}</p>
                  </div>
                ) : (
                  <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{`${assetFilter.length} ${t(
                    "selections",
                  )}`}</p>
                )}
                <img
                  src={theme === ThemesEnum.enum.dark ? ChevronRightIcon : ChevronRightDarkIcon}
                  className={`${assetOpen ? "-rotate-90 transition-transform" : "rotate-0 transition-transform"} ml-1`}
                  alt="chevron-icon"
                />
              </div>
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="text-md bg-PrimaryColorLight w-[10rem] rounded-lg dark:bg-SecondaryColor scroll-y-light z-[999] max-h-80 text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-BorderColor/20"
              sideOffset={2}
              align="end"
            >
              <button
                onClick={handleSelectAll}
                className="flex flex-row items-center justify-between w-full px-3 py-2 rounded-t-lg hover:bg-HoverColorLight hover:dark:bg-HoverColor"
              >
                <p>{t("selected.all")}</p>
                <CustomCheck
                  className="border-BorderColorLight dark:border-BorderColor"
                  checked={assetFilter.length === assets.length}
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
                      checked={assetFilter.includes(asset.tokenSymbol)}
                    />
                  </button>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <CustomInput
          compOutClass="!w-[40%]"
          prefix={<img src={SearchIcon} className="mx-2" alt="search-icon" />}
          intent={"secondary"}
          sizeInput={"medium"}
          placeholder={t("search.contact")}
          value={searchKey}
          onChange={(e) => {
            setSearchKey(e.target.value);
          }}
        />
        <IconButton
          icon={<PlusIcon className="w-6 h-6" />}
          size="medium"
          onClick={() => {
            setAddOpen(true);
          }}
        />
      </div>
      <Modal
        open={addOpen}
        width="w-[48rem]"
        padding="py-5 px-8"
        border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
        overlayZIndex="0"
        contentZIndex="0"
      >
        <AddContact setAddOpen={setAddOpen} />
      </Modal>
    </Fragment>
  );

  function handleSelectAll() {
    if (assetFilter.length === assets.length) setAssetFilter([]);
    else {
      const symbols = assets.map((ast) => {
        return ast.tokenSymbol;
      });
      setAssetFilter(symbols);
    }
  }

  function handleSelectAsset(asset: Asset) {
    if (assetFilter.includes(asset.tokenSymbol)) {
      const auxSymbols = assetFilter.filter((ast) => ast !== asset.tokenSymbol);
      setAssetFilter(auxSymbols);
    } else setAssetFilter([...assetFilter, asset.tokenSymbol]);
  }
};

export default ContactFilters;

// Tailwind CSS
const assetStyle = (k: number, assets: Asset[]) =>
  clsx({
    ["flex flex-row justify-between items-center px-3 py-2 w-full hover:bg-HoverColorLight hover:dark:bg-HoverColor"]:
      true,
    ["rounded-b-lg"]: k === assets.length - 1,
  });
