// svgs
import { IconTypeEnum, TokenNetwork, TokenNetworkEnum } from "@/common/const";
import ChevIcon from "@assets/svg/files/chev-icon.svg";
//
import { CustomButton } from "@components/button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { Asset } from "@redux/models/AccountModels";
import { getAssetIcon } from "@/common/utils/icons";
import {
  AssetMutationAction,
  AssetMutationResult,
  setAccordionAssetIdx,
  setAssetMutation,
  setAssetMutationAction,
  setAssetMutationResult,
  setSelectedAsset,
} from "@redux/assets/AssetReducer";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import useCreateUpdateAsset from "@pages/home/hooks/useCreateUpdateAsset";
import { useState } from "react";
import useAssetMutate, { assetMutateInitialState } from "@pages/home/hooks/useAssetMutate";
import { db } from "@/database/db";
import getAssetDetails from "@pages/home/helpers/getAssetDetails";
import logger from "@/common/utils/logger";

const AddAssetAutomatic = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { assets } = useAppSelector((state) => state.asset.list);
  const [network, setNetwork] = useState<TokenNetwork>(TokenNetworkEnum.enum["ICRC-1"]);
  const { newAssetList, assetTOpen, setAssetTOpen, networkTOpen, setNetworkTOpen } = useCreateUpdateAsset();
  const { newAsset, setNewAsset, setErrToken, errToken } = useAssetMutate();

  return (
    <div className="flex flex-col items-start justify-start w-full">
      <div className="flex flex-row items-center justify-start w-full gap-4">
        <div className="flex flex-col items-start justify-start w-1/2">
          <p className="w-full text-left opacity-60">{t("type")}</p>
          <DropdownMenu.Root
            onOpenChange={(e: boolean) => {
              setNetworkTOpen(e);
            }}
          >
            <DropdownMenu.Trigger asChild>
              <div
                className={clsx(
                  networkBox,
                  "border-BorderColorLight dark:border-BorderColor",
                  "items-center",
                  "cursor-pointer",
                  "w-[7rem]",
                  "pr-0",
                )}
              >
                <div>
                  <p>{network}</p>
                </div>
                <img
                  src={ChevIcon}
                  style={{ width: "2rem", height: "2rem" }}
                  alt="chevron-icon"
                  className={`${networkTOpen ? "" : "rotate-90"}`}
                />
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="text-lg bg-PrimaryColorLight w-[7rem] rounded-lg dark:bg-SecondaryColor z-[2000] text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-BorderColor"
                sideOffset={2}
                align="end"
              >
                {TokenNetworkEnum.options.map((networkOption, idx) => {
                  return (
                    <DropdownMenu.Item
                      key={`net-${idx}`}
                      className={`flex flex-row text-md justify-start items-center p-3 cursor-pointer ${
                        idx > 0 ? "border-t border-BorderColorLight dark:border-BorderColor" : ""
                      }`}
                      onSelect={() => {
                        onSelectNetwork(networkOption);
                      }}
                    >
                      <div className="flex flex-col items-start justify-center">
                        <p>{`${networkOption}`}</p>
                      </div>
                    </DropdownMenu.Item>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
        <div className="flex flex-col items-start justify-start w-full">
          <p className="w-full text-left opacity-60">{t("asset")}</p>
          <DropdownMenu.Root
            onOpenChange={(e: boolean) => {
              setAssetTOpen(e);
            }}
          >
            <DropdownMenu.Trigger asChild>
              <div
                className={clsx(
                  networkBox,
                  "border-BorderColorLight dark:border-BorderColor",
                  "items-center",
                  "cursor-pointer",
                  "w-[14rem]",
                  "pr-0",
                )}
              >
                {newAsset.tokenSymbol != "" ? (
                  <div className="flex flex-row items-center justify-start">
                    {getAssetIcon(IconTypeEnum.Enum.ASSET, newAsset.tokenSymbol, newAsset.logo)}
                    <p className="ml-3">{`${newAsset.tokenName}`}</p>
                  </div>
                ) : (
                  <p className="opacity-70">{t("adding.select")}</p>
                )}
                <img
                  src={ChevIcon}
                  style={{ width: "2rem", height: "2rem" }}
                  alt="chevron-icon"
                  className={`${assetTOpen ? "" : "rotate-90"}`}
                />
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="text-lg bg-PrimaryColorLight w-[14rem] max-h-96 overflow-auto rounded-md dark:bg-SecondaryColor z-[2000] text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-BorderColor scroll-y-light"
                sideOffset={2}
                align="end"
              >
                {newAssetList.map((newAsset, idx) => {
                  const tokenFounded = assets.find((asst) => asst.tokenSymbol === newAsset.tokenSymbol);
                  if (!tokenFounded)
                    return (
                      <DropdownMenu.Item
                        key={`net-${idx}`}
                        className={`flex flex-row text-md justify-start items-center p-3 cursor-pointer ${
                          idx > 0 ? "border-t border-BorderColorLight dark:border-BorderColor" : ""
                        }`}
                        onSelect={() => {
                          onSelectToken(newAsset);
                        }}
                      >
                        <div className="flex flex-row items-center justify-start">
                          {getAssetIcon(IconTypeEnum.Enum.ASSET, newAsset.tokenSymbol, newAsset.logo)}
                          <p className="ml-3">{`${newAsset.tokenSymbol}`}</p>
                        </div>
                      </DropdownMenu.Item>
                    );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
      {errToken !== "" && <p className="w-full text-sm text-right text-LockColor">{errToken}</p>}
      <div className="flex flex-row items-center justify-between w-full mt-2 mb-4">
        <CustomButton intent={"noBG"} className="!font-light !p-0 mt-3" onClick={onAddAssetManually}>
          {t("add.asset.manually")}
        </CustomButton>
        <CustomButton className="min-w-[5rem]" onClick={onAdd}>
          <p>{t("add")}</p>
        </CustomButton>
      </div>
    </div>
  );

  function onSelectNetwork(networkOption: TokenNetwork) {
    if (networkOption === network) return;

    setNetwork(networkOption);
    setNewAsset(assetMutateInitialState);
  }

  function onSelectToken(newAsset: Asset) {
    setNewAsset(newAsset);
    setErrToken("");
  }

  function onAddAssetManually() {
    dispatch(setAssetMutationAction(AssetMutationAction.ADD_MANUAL));
    setNewAsset(assetMutateInitialState);
  }

  async function onAdd() {
    newAsset.address.trim() !== "" && addAssetToData();
  }

  async function addAssetToData() {
    if (isAssetAdded(newAsset.address)) {
      setErrToken(t("adding.asset.already.imported"));
      return;
    }

    try {
      dispatch(setAssetMutation(newAsset));
      dispatch(setAssetMutationResult(AssetMutationResult.ADDING));

      const idxSorting = assets.length > 0 ? [...assets].sort((a, b) => b.sortIndex - a.sortIndex) : [];
      const sortIndex = (idxSorting.length > 0 ? idxSorting[0]?.sortIndex : 0) + 1;

      const updatedAsset = await getAssetDetails({
        canisterId: newAsset.address,
        includeDefault: true,
        customName: newAsset.name,
        customSymbol: newAsset.symbol,
        supportedStandard: newAsset.supportedStandards,
        sortIndex,
        ledgerIndex: newAsset.index,
      });

      const assetToSave: Asset = { ...newAsset, ...updatedAsset, sortIndex };

      await db().addAsset(assetToSave, { sync: true });

      dispatch(setAssetMutationResult(AssetMutationResult.ADDED));
      dispatch(setSelectedAsset(assetToSave));
      dispatch(setAccordionAssetIdx([assetToSave.tokenSymbol]));
    } catch (error) {
      logger.debug("Error adding asset", error);
      dispatch(setAssetMutationResult(AssetMutationResult.FAILED));
    } finally {
      dispatch(setAssetMutationAction(AssetMutationAction.NONE));
    }
  }

  function isAssetAdded(address: string) {
    return assets.find((asst: Asset) => asst.address === address) ? true : false;
  }
};

// Tailwind CSS constants
const networkBox = clsx(
  "flex",
  "flex-row",
  "w-full",
  "justify-between",
  "items-start",
  "rounded",
  "border border-slate-color-info",
  "px-3",
  "py-1",
);

export default AddAssetAutomatic;
