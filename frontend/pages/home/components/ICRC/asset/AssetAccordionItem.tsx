import InfoIcon from "@assets/svg/files/info-icon.svg";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-icon.svg";
//
import { Asset } from "@redux/models/AccountModels";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import * as Accordion from "@radix-ui/react-accordion";
import clsx from "clsx";
import {
  AssetMutationAction,
  setAssetMutation,
  setAssetMutationAction,
  setExtraDataMuatation,
  setSelectedAccount,
  setSelectedAsset,
} from "@redux/assets/AssetReducer";
import { getAssetIcon } from "@/common/utils/icons";
import { IconTypeEnum } from "@/common/const";
import { ChevronDownIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import AddSubAccountModal from "./AddSubAccountModal";
import AccountAccordionItem from "./AccountAccordionItem";
import { getFirstNChars } from "@common/utils/strings";
import { getUSDFromToken, toFullDecimal } from "@common/utils/amount";

interface AssetAccordionItemProps {
  currentAsset: Asset;
  isCurrentAssetLast: boolean;
  assetIterationIndex: number;
}

export default function AssetAccordionItem(props: AssetAccordionItemProps) {
  const { currentAsset, isCurrentAssetLast } = props;
  const [isAddSubAccountOpen, setAddSubAccountOpen] = useState(false);
  const { selectedAsset, accordionIndex, selectedAccount } = useAppSelector((state) => state.asset.helper);
  const { isAppDataFreshing } = useAppSelector((state) => state.common);
  const { services } = useAppSelector((state) => state.services);
  const { tokensMarket } = useAppSelector((state) => state.asset.utilData);
  const [usedIdxs, setUsedIdxs] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const isCurrentAssetSelected = currentAsset?.tokenSymbol === selectedAsset?.tokenSymbol;
  const hasMoreThanOneSubAccounts = currentAsset.subAccounts.length > 1;
  const hasSubAccounts = currentAsset.subAccounts.length > 0;

  return (
    <>
      <Accordion.Item value={currentAsset.tokenSymbol}>
        <div className={getAssetElementStyles(isCurrentAssetSelected, isCurrentAssetLast)} onClick={onSelectAsset}>
          {isCurrentAssetSelected && <div className="absolute left-0 bg-[#33b2ef] h-full w-1"></div>}

          <Accordion.Trigger className="flex flex-row items-center justify-center w-full">
            <div className="flex flex-row justify-between w-full h-full text-md">
              <div className="flex flex-row items-center justify-start gap-2">
                {getAssetIcon(IconTypeEnum.Enum.ASSET, currentAsset?.tokenSymbol, currentAsset.logo)}

                <div className="flex flex-col items-start justify-start">
                  <p className="text-md">
                    {getFirstNChars(currentAsset?.name ? currentAsset.name : currentAsset.tokenName, 18)}
                  </p>

                  <div className="flex flex-row items-center justify-start">
                    <p className={`text-md ${isCurrentAssetSelected ? "opacity-60" : ""}`}>
                      {currentAsset.symbol ? currentAsset.symbol : currentAsset.tokenSymbol}
                    </p>
                    <div className="p-0 mr-1" onClick={onAssetUpdate}>
                      <img src={InfoIcon} className="w-3 h-3 ml-1" alt="info-icon" />
                    </div>
                    {isCurrentAssetSelected ? (
                      <div
                        className="flex flex-row justify-start items-center rounded ml-2 !p-0"
                        onClick={onAddNewSubAccount}
                      >
                        <div className="flex items-center justify-center h-5 rounded bg-SvgColorLight/10 dark:bg-SvgColor">
                          <p className="mx-1 text-xm">+ Sub</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {hasMoreThanOneSubAccounts && (
                          <div className="flex items-center justify-center h-5 rounded bg-SvgColorLight/10 dark:bg-SvgColor">
                            <p className="px-1 text-xm">{`${currentAsset.subAccounts.length} Subs`}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end justify-center">
                <p className="text-md">{`${toFullDecimal(
                  getFullTokenAmount().token,
                  Number(currentAsset.decimal),
                  Number(currentAsset.shortDecimal),
                )} ${currentAsset.symbol}`}</p>
                <p
                  className={isCurrentAssetSelected ? "opacity-60 text-md" : "text-md"}
                >{`≈ $${getFullTokenAmount().currency.toFixed(2)}`}</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between h-8 ml-3 ">
              {currentAsset?.subAccounts && accordionIndex.includes(currentAsset.tokenSymbol) ? (
                <ChevronDownIcon className="w-3 h-3" />
              ) : (
                <ChevronLeftIcon className="w-3 h-3" />
              )}
              {getFullTokenAmount().token === BigInt("0") && !isAppDataFreshing && (
                <TrashIcon
                  onClick={onDeleteAsset}
                  className="w-3 h-3 cursor-pointer fill-PrimaryTextColorLight dark:fill-PrimaryTextColor "
                />
              )}
            </div>
          </Accordion.Trigger>
        </div>

        {hasSubAccounts && (
          <Accordion.Content>
            <div className={getContainerStyles(isCurrentAssetLast)}>
              {currentAsset.subAccounts.map((currentSubAccount, index) => {
                const isCurrentSubAccountSelected =
                  currentSubAccount.sub_account_id === selectedAccount?.sub_account_id &&
                  currentAsset.tokenSymbol === selectedAsset?.tokenSymbol;

                return (
                  <AccountAccordionItem
                    currentSubAccount={currentSubAccount}
                    key={`${currentSubAccount.sub_account_id}-${index}`}
                    isCurrentSubAccountSelected={isCurrentSubAccountSelected}
                    currentAsset={currentAsset}
                  />
                );
              })}
            </div>
          </Accordion.Content>
        )}
      </Accordion.Item>

      {isAddSubAccountOpen ? (
        <AddSubAccountModal
          isAddSubAccountOpen={isAddSubAccountOpen}
          onClose={onClose}
          usedIdxs={usedIdxs}
          currentAsset={currentAsset}
        />
      ) : null}
    </>
  );

  function onClose() {
    setAddSubAccountOpen(false);
  }

  function onSelectAsset() {
    if (selectedAsset?.tokenSymbol !== currentAsset.tokenSymbol) {
      dispatch(setSelectedAsset(currentAsset));
      currentAsset.subAccounts.length > 0 && dispatch(setSelectedAccount(currentAsset.subAccounts[0]));
    }
  }

  function onAssetUpdate() {
    dispatch(setAssetMutation(currentAsset));
    dispatch(setAssetMutationAction(AssetMutationAction.UPDATE));
  }

  function onAddNewSubAccount() {
    setAddSubAccountOpen((prev) => !prev);
    const idxs = currentAsset.subAccounts.map((sa) => {
      return sa.sub_account_id.toLowerCase();
    });
    setUsedIdxs(idxs);
  }

  function getFullTokenAmount() {
    const assetMarket = tokensMarket.find((tm) => tm.symbol === currentAsset.tokenSymbol);
    let total = BigInt("0");

    currentAsset.subAccounts.map((currentSubAccount) => {
      total = total + BigInt(currentSubAccount.amount);
    }, 0);
    const currencyTotal = assetMarket
      ? getUSDFromToken(total.toString(), assetMarket.price, currentAsset.decimal)
      : "0.00";

    return {
      token: total,
      currency: Number(currencyTotal),
    };
  }

  function onDeleteAsset() {
    const auxServices = services
      .filter((srv) => {
        return !!srv.assets.find((ast) => ast.visible && ast.principal === currentAsset.address);
      })
      .map((srv) => {
        const findAsset = srv.assets.find((ast) => ast.visible && ast.principal === currentAsset.address);
        return { name: srv.name, credit: findAsset?.credit || "0", address: currentAsset.address };
      });
    dispatch(setExtraDataMuatation(auxServices.length > 0 ? { deletedServicesAssets: auxServices } : undefined));
    dispatch(setAssetMutation(currentAsset));
    dispatch(setAssetMutationAction(AssetMutationAction.DELETE));
  }
}

const getAssetElementStyles = (isSelected: boolean, isNotLast: boolean) =>
  clsx(
    "relative flex flex-row items-center w-full h-16 text-PrimaryColor dark:text-PrimaryColorLight cursor-pointer hover:bg-SecondaryColorLight dark:hover:bg-SecondaryColor",
    isSelected ? "bg-SecondaryColorLight dark:bg-SecondaryColor" : "",
    isNotLast ? "border-b-[0.1rem] dark:border-BorderColorThree border-BorderColorThreeLight" : "",
  );

const getContainerStyles = (isCurrentAssetLast: boolean) =>
  clsx(
    "flex flex-col justify-start items-end w-full",
    !isCurrentAssetLast ? "border-b-[0.1rem] dark:border-BorderColorThree border-BorderColorThreeLight" : "",
  );
