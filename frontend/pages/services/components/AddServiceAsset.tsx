// svg
import { ReactComponent as PlusIcon } from "@assets/svg/files/plus-icon.svg";
import SearchIcon from "@assets/svg/files/icon-search.svg";
//
import { IconTypeEnum } from "@common/const";
import { getAssetIcon } from "@common/utils/icons";
import { CustomButton } from "@components/button";
import { CustomCheck } from "@components/checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAppSelector } from "@redux/Store";
import { ServiceAsset } from "@redux/models/ServiceModels";
import { clsx } from "clsx";
import { ChangeEvent, Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AddAssetWarning } from "@/pages/services/components/Modals/addAssetWarning";
import useServiceAsset from "@/pages/services/hooks/useServiceAsset";
import { CustomInput } from "@components/input";

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
  const [searchKey, setSearchKey] = useState("");
  const [missingAssets, setMissingAssets] = useState<ServiceAsset[]>([]);
  const [inListAssets, setInLsitAssets] = useState<ServiceAsset[]>([]);

  const assetsToShow = useMemo(() => {
    return assets.filter((ast) => {
      const key = searchKey.trim().toLowerCase();
      return key === "" || ast.tokenSymbol.toLowerCase().includes(key);
    });
  }, [searchKey, assets]);

  useEffect(() => {
    const auxSelected = assetsToAdd.filter((ast) => {
      return !!assetsToShow.find((nl) => nl.principal === ast.principal);
    });
    if (auxSelected.length !== assetsToAdd.length) setAssetsToAdd(auxSelected);
  }, [assetsToShow]);

  return (
    <Fragment>
      <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
        <DropdownMenu.Trigger asChild>
          <button className="flex flex-row items-center justify-center gap-1 px-2 py-1 rounded-md bg-SelectRowColor">
            <PlusIcon className="w-4 h-4" />
            <p className="text-PrimaryTextColor">{t("asset")}</p>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={contentContainerStyles} sideOffset={5} side="right" align="center">
            <div className="flex items-center justify-center w-full px-3 py-2">
              <CustomInput
                sizeComp={"medium"}
                sizeInput="medium"
                value={searchKey}
                onChange={onSearchChange}
                autoFocus
                placeholder={t("search")}
                prefix={<img src={SearchIcon} className="w-5 h-5 mx-2" alt="search-icon" />}
                compInClass="bg-white dark:bg-SecondaryColor"
              />
            </div>
            <div className="flex flex-col items-center justify-start w-full rounded-lg bg-PrimaryColorLight dark:bg-SecondaryColor">
              {assetsToShow.length > 0 && (
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
              )}
              {assetsToShow.map((asset, k) => {
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
                      {getAssetIcon(
                        IconTypeEnum.Enum.FILTER,
                        userAsset?.tokenSymbol || asset.tokenSymbol,
                        userAsset?.logo || asset.logo,
                      )}
                      <p>{userAsset?.symbol || asset.tokenSymbol}</p>
                    </div>

                    <CustomCheck
                      className="border-BorderColorLight dark:border-BorderColor"
                      checked={assetsToAdd.includes(asset)}
                    />
                  </div>
                );
              })}
              <div className="flex items-center justify-end w-full px-3 py-2">
                <CustomButton onClick={handleAddAssetButton} size={"small"} className="w-1/3">
                  <p>{t("add")}</p>
                </CustomButton>
              </div>
            </div>

            <DropdownMenu.Arrow className="w-4 h-2 fill-BorderColorLight dark:fill-primary-color" />
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
  function onSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchKey(e.target.value);
  }
  function handleSelectAll() {
    if (assetsToShow.length === assetsToAdd.length) setAssetsToAdd([]);
    else {
      setAssetsToAdd(assetsToShow);
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
  "text-md bg-SecondaryColorLight w-[12rem]",
  "rounded-lg dark:bg-level-2-color scroll-y-light z-[999]",
  "max-h-80 text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight",
  "dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-primary-color",
);
