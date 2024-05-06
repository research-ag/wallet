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
  setSelectedAccount,
  setSelectedAsset,
  setSubAccountMutationAction,
  SubAccountMutationAction,
} from "@redux/assets/AssetReducer";
import { getAssetIcon } from "@/utils/icons";
import { IconTypeEnum } from "@/const";
import { getFirstNChars, getUSDFromToken, toFullDecimal } from "@/utils";
import { ChevronDownIcon, ChevronLeftIcon } from "@radix-ui/react-icons";

interface AssetAccordionItemProps {
  currentAsset: Asset;
  isCurrentAssetLast: boolean;
}

export default function AssetAccordionItem(props: AssetAccordionItemProps) {
  const { currentAsset, isCurrentAssetLast } = props;
  const { selectedAsset, accordionIndex } = useAppSelector((state) => state.asset.helper);
  const { tokensMarket } = useAppSelector((state) => state.asset.utilData);
  const dispatch = useAppDispatch();

  const isCurrentAssetSelected = currentAsset?.tokenSymbol === selectedAsset?.tokenSymbol;
  const hasMoreThanOneSubAccounts = currentAsset.subAccounts.length > 1;
  const hasSubAccounts = currentAsset.subAccounts.length > 0;

  return (
    <Accordion.Item value={currentAsset.tokenSymbol}>
      <div className={getAssetElementStyles(isCurrentAssetSelected, isCurrentAssetLast)} onClick={onSelectAsset}>
        {isCurrentAssetSelected && <div className="absolute left-0 bg-[#33b2ef] h-full w-1"></div>}

        <Accordion.Trigger className="flex flex-row items-center justify-center w-full">
          <div className="flex flex-row justify-between w-full h-full text-md">
            <div className="flex flex-row items-center justify-start gap-2">
              {getAssetIcon(IconTypeEnum.Enum.ASSET, currentAsset?.tokenSymbol, currentAsset.logo)}

              <div className="flex flex-col items-start justify-start">
                <p className="text-lg">
                  {getFirstNChars(currentAsset?.name ? currentAsset.name : currentAsset.tokenName, 18)}
                </p>

                <div className="flex flex-row items-center justify-start">
                  <p className={`text-md ${isCurrentAssetSelected ? "opacity-60" : ""}`}>
                    {currentAsset.symbol ? currentAsset.symbol : currentAsset.tokenSymbol}
                  </p>
                  <div className="p-0 mr-1" onClick={onAssetUpdate}>
                    <img src={InfoIcon} className="ml-1" alt="info-icon" />
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
              <ChevronLeftIcon />
            ) : (
              <ChevronDownIcon />
            )}
            {getFullTokenAmount().token === BigInt("0") && (
              <TrashIcon
                onClick={onDeleteAsset}
                className="w-3 h-3 cursor-pointer fill-PrimaryTextColorLight dark:fill-PrimaryTextColor "
              />
            )}
          </div>
        </Accordion.Trigger>
      </div>

      {/* {(asset?.subAccounts || newSub) && ( */}
      {hasSubAccounts && <Accordion.Content className={getContentStyles(isCurrentAssetLast)}></Accordion.Content>}
    </Accordion.Item>
  );

  function onSelectAsset() {
    if (selectedAsset?.tokenSymbol !== currentAsset.tokenSymbol) {
      dispatch(setSelectedAsset(currentAsset));
      //   setNewSub(undefined);
      //   setAddOpen(false);
      currentAsset.subAccounts.length > 0 && dispatch(setSelectedAccount(currentAsset.subAccounts[0]));
    }
    // setName("");
    // setEditNameId("");
  }

  function onAssetUpdate() {
    dispatch(setAssetMutation(currentAsset));
    dispatch(setAssetMutationAction(AssetMutationAction.UPDATE));
  }

  function onAddNewSubAccount() {
    dispatch(setSubAccountMutationAction(SubAccountMutationAction.ADD));

    // setAddOpen(true);
    // let newIdx = "0";
    // const idxs = asset.subAccounts.map((sa) => {
    //   return sa.sub_account_id.toLowerCase();
    // });
    // newIdx = getLowestMissing(idxs).toString(16);
    // setUsedIdxs(idxs);

    // setNewErr({ name: false, idx: false });
    // setNewSub({
    //   name: "",
    //   sub_account_id: newIdx,
    //   address: authClient,
    //   amount: "0",
    //   currency_amount: "0",
    //   transaction_fee: asset.subAccounts[0].transaction_fee,
    //   decimal: Number(asset.decimal),
    //   symbol: asset.tokenSymbol,
    // });
    // setEditNameId(asset.subAccounts.length.toFixed());
    // setName("");
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

const getContentStyles = (isCurrentAssetLast: boolean) =>
  clsx(
    "flex flex-col justify-start items-end",
    !isCurrentAssetLast ? "border-b-[0.1rem] dark:border-BorderColorThree border-BorderColorThreeLight" : "",
  );
