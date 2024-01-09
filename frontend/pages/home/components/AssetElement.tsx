// svgs
import ChevronRightIcon from "@assets/svg/files/chevron-right-icon.svg";
import ChevronRightDarkIcon from "@assets/svg/files/chevron-right-dark-icon.svg";
import InfoIcon from "@assets/svg/files/info-icon.svg";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-icon.svg";
//
import { SubAccount, Asset } from "@redux/models/AccountModels";
import AccountElement from "./AccountElement";
import { Fragment, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { GeneralHook } from "../hooks/generalHook";
import { ThemeHook } from "@hooks/themeHook";
import { IconTypeEnum, ThemesEnum } from "@/const";
import { getFirstNChars, getUSDfromToken, hexToNumber, toFullDecimal } from "@/utils";
import { AssetHook } from "../hooks/assetHook";
import { Token } from "@redux/models/TokenModels";
import bigInt from "big-integer";
import { AccountHook } from "@pages/hooks/accountHook";
import DialogAddAsset from "./DialogAddAsset";
import DeleteAssetModal from "./DeleteAssetModal";

interface AssetElementProps {
  asset: Asset;
  idx: number;
  acordeonIdx: string[];
  setAssetInfo(value: Asset | undefined): void;
  setAssetOpen(value: boolean): void;
  tokens: Token[];
  setAddOpen(value: boolean): void;
}

const AssetElement = ({
  asset,
  idx,
  acordeonIdx,
  setAssetInfo,
  setAssetOpen,
  tokens,
  setAddOpen,
}: AssetElementProps) => {
  const { theme } = ThemeHook();
  const { authClient } = AccountHook();

  const { assets, selectedAsset, changeSelectedAsset, changeSelectedAccount, getAssetIcon } = GeneralHook();
  const { editNameId, setEditNameId, name, setName, newSub, setNewSub, hexChecked, setHexChecked, tokensMarket } =
    AssetHook();
  const [usedIdxs, setUsedIdxs] = useState<string[]>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [newErr, setNewErr] = useState<{ name: boolean; idx: boolean }>({ name: false, idx: false });

  return (
    <Fragment>
      <Accordion.Item value={asset.tokenSymbol}>
        <div
          className={`relative flex flex-row items-center w-full h-16 text-PrimaryColor dark:text-PrimaryColorLight cursor-pointer hover:bg-SecondaryColorLight dark:hover:bg-SecondaryColor ${
            asset?.tokenSymbol === selectedAsset?.tokenSymbol ? "bg-SecondaryColorLight dark:bg-SecondaryColor" : ""
          } ${
            idx < assets?.length ? "border-b-[0.1rem] dark:border-BorderColorThree border-BorderColorThreeLight" : ""
          }`}
          onClick={onSelectAsset}
        >
          {asset?.tokenSymbol === selectedAsset?.tokenSymbol && (
            <div className="absolute left-0 bg-[#33b2ef] h-full w-1"></div>
          )}
          <Accordion.Trigger className="flex flex-row justify-center items-center w-full">
            <div className={"flex flex-row justify-between w-full h-full text-md"}>
              <div className="flex flex-row justify-start items-center gap-2">
                {getAssetIcon(IconTypeEnum.Enum.ASSET, asset?.tokenSymbol, asset.logo)}
                <div className="flex flex-col justify-start items-start">
                  <p>{`${getFirstNChars(asset?.name ? asset.name : asset.tokenName, 18)}`}</p>
                  <div className="flex flex-row justify-start items-center">
                    <p className={`${asset?.tokenSymbol !== selectedAsset?.tokenSymbol ? "opacity-60" : ""}`}>{`${
                      asset.symbol ? asset.symbol : asset.tokenSymbol
                    }`}</p>{" "}
                    <div className="p-0" onClick={onInfoClic}>
                      <img src={InfoIcon} className="ml-1" alt="info-icon" />
                    </div>
                    {asset?.tokenSymbol === selectedAsset?.tokenSymbol ? (
                      <div className="flex flex-row justify-start items-center rounded ml-2 !p-0" onClick={onAddSub}>
                        <div className="flex justify-center items-center w-full h-5 rounded bg-SvgColorLight/10 dark:bg-SvgColor">
                          <p className="text-sm mx-1">+ Sub</p>
                        </div>
                      </div>
                    ) : (
                      <div className="ml-2">
                        {asset.subAccounts.length > 1 && (
                          <div className="flex justify-center items-center w-full h-5 rounded bg-SvgColorLight/10 dark:bg-SvgColor">
                            <p className="text-sm px-1">{`${asset.subAccounts.length} Subs`}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-end">
                <p>{`${toFullDecimal(getFullTokenAmount().token, Number(asset.decimal), Number(asset.shortDecimal))} ${
                  asset.symbol
                }`}</p>
                <p
                  className={`${asset?.tokenSymbol !== selectedAsset?.tokenSymbol ? "opacity-60" : ""}`}
                >{`≈ $${getFullTokenAmount().currency.toFixed(2)}`}</p>
              </div>
            </div>
            <div className="flex flex-col justify-between items-center h-8 ml-3 ">
              {asset?.subAccounts && (
                <img
                  src={theme === ThemesEnum.enum.dark ? ChevronRightIcon : ChevronRightDarkIcon}
                  className={`${
                    acordeonIdx.includes(asset.tokenSymbol)
                      ? "-rotate-90 transition-transform"
                      : "rotate-0 transition-transform"
                  } `}
                  alt="chevron-icon"
                />
              )}
              {getFullTokenAmount().token === BigInt("0") && (
                <TrashIcon
                  onClick={() => {
                    onDelete();
                  }}
                  className="w-3 h-3 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor cursor-pointer "
                />
              )}
            </div>
          </Accordion.Trigger>
        </div>
        {(asset?.subAccounts || newSub) && (
          <Accordion.Content>
            <div
              className={`flex flex-col justify-start items-end ${
                idx < assets?.length
                  ? "border-b-[0.1rem] dark:border-BorderColorThree border-BorderColorThreeLight"
                  : ""
              }`}
            >
              {asset?.subAccounts.map((subAccount: SubAccount, subIdx: number) => {
                return (
                  <AccountElement
                    key={subIdx}
                    asset={asset}
                    subAccount={subAccount}
                    symbol={asset.symbol}
                    tokenSymbol={asset.tokenSymbol}
                    name={name}
                    setName={setName}
                    editNameId={editNameId}
                    setEditNameId={setEditNameId}
                    tokenIndex={idx}
                    newSub={false}
                    setNewSub={setNewSub}
                    setAddOpen={setAddOpen}
                    tokens={tokens}
                    subaccountId={subIdx}
                  ></AccountElement>
                );
              })}
            </div>
          </Accordion.Content>
        )}
      </Accordion.Item>
      <DialogAddAsset
        newErr={newErr}
        setNewErr={setNewErr}
        newSub={newSub}
        setNewSub={setNewSub}
        setAddOpen={setAddOpen}
        usedIdxs={usedIdxs}
        getLowestMissing={getLowestMissing}
        hexChecked={hexChecked}
        setHexChecked={setHexChecked}
        tokens={tokens}
        idx={idx}
        authClient={authClient}
        selectedAsset={selectedAsset}
        acordeonIdx={acordeonIdx}
      ></DialogAddAsset>
      <DeleteAssetModal open={openDelete} setOpen={setOpenDelete} name={asset.name} symbol={asset.tokenSymbol} />
    </Fragment>
  );

  function onSelectAsset() {
    changeSelectedAsset(asset);
    if (asset?.tokenSymbol !== selectedAsset?.tokenSymbol) {
      setNewSub(undefined);
      setAddOpen(false);
      asset.subAccounts.length > 0 && changeSelectedAccount(asset.subAccounts[0]);
    }
    setName("");
    setEditNameId("");
  }

  function onInfoClic() {
    setAssetInfo(asset);
    setAssetOpen(true);
  }

  function onAddSub() {
    setAddOpen(true);
    let newIdx = "0";
    const idxs = asset.subAccounts.map((sa) => {
      return sa.sub_account_id.toLowerCase();
    });
    newIdx = getLowestMissing(idxs).toString(16);
    setUsedIdxs(idxs);

    setNewErr({ name: false, idx: false });
    setNewSub({
      name: "",
      sub_account_id: newIdx,
      address: authClient,
      amount: "0",
      currency_amount: "0",
      transaction_fee: asset.subAccounts[0].transaction_fee,
      decimal: Number(asset.decimal),
      symbol: asset.tokenSymbol,
    });
    setEditNameId(asset.subAccounts.length.toFixed());
    setName("");
  }

  function getFullTokenAmount() {
    const assetMarket = tokensMarket.find((tm) => tm.symbol === asset.tokenSymbol);
    let total = BigInt("0");
    asset.subAccounts.map((sa) => {
      total = total + BigInt(sa.amount);
    }, 0);
    const currencyTotal = assetMarket ? getUSDfromToken(total.toString(), assetMarket.price, asset.decimal) : "0.00";

    return {
      token: total,
      currency: Number(currencyTotal),
    };
  }

  function getLowestMissing(idxs: string[]) {
    let lowestMissing = bigInt();
    for (let index = 0; index < idxs.length; index++) {
      const saId = hexToNumber(idxs[index]) || bigInt();
      const newId = hexToNumber(`0x${index.toString(16)}`) || bigInt();
      if (saId.compare(newId) !== 1) lowestMissing = saId.add(bigInt(1));
    }
    return lowestMissing;
  }

  function onDelete() {
    setOpenDelete(true);
  }
};

export default AssetElement;
