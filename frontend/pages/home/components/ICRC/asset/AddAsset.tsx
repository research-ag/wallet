// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GeneralHook } from "../../../hooks/generalHook";
import { AccountDefaultEnum, AddingAssetsEnum, TokenNetworkEnum } from "@/const";
import { TokenHook } from "../../../hooks/tokenHook";
import { Asset } from "@redux/models/AccountModels";
import { useAppDispatch } from "@redux/Store";
import DialogAssetConfirmation from "./DialogAssetConfirmation";
import AddAssetManual from "./AddAssetManual";
import { setAccordionAssetIdx, setSelectedAsset } from "@redux/assets/AssetReducer";
import AddAssetAutomatic from "./AddAssetAutomatic";
import { db } from "@/database/db";

interface AddAssetsProps {
  setAssetOpen: Dispatch<SetStateAction<boolean>>;
  assetOpen: boolean;
  asset: Asset | undefined;
  setAssetInfo(value: Asset | undefined): void;
  assets: Asset[];
  accordionIndex: string[];
}

const AddAsset = ({ setAssetOpen, assetOpen, asset, setAssetInfo, assets, accordionIndex }: AddAssetsProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { checkAssetAdded } = GeneralHook();
  const {
    newAsset,
    setNewAsset,
    validToken,
    setValidToken,
    validIndex,
    setValidIndex,
    errToken,
    setErrToken,
    errIndex,
    setErrIndex,
    modal,
    showModal,
    addStatus,
    setAddStatus,
    manual,
    setManual,
    networkTOpen,
    setNetworkTOpen,
    assetTOpen,
    setAssetTOpen,
    network,
    setNetwork,
    newAssetList,
  } = TokenHook(asset);

  useEffect(() => {
    setErrToken("");
    setErrIndex("");
    setValidToken(false);
  }, [assetOpen]);

  return (
    <Fragment>
      <div className="flex flex-col items-center justify-start w-full h-full px-6 pt-8 bg-PrimaryColorLight dark:bg-PrimaryColor text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
        <div className="flex flex-row items-center justify-between w-full mb-5">
          <p className="text-lg font-bold">{asset ? t("edit.asset") : t("add.asset")}</p>
          <CloseIcon
            className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
            onClick={onClose}
          />
        </div>
        {manual || asset ? (
          <AddAssetManual
            manual={manual}
            setManual={setManual}
            errToken={errToken}
            setErrToken={setErrToken}
            errIndex={errIndex}
            setErrIndex={setErrIndex}
            validToken={validToken}
            setValidToken={setValidToken}
            validIndex={validIndex}
            setValidIndex={setValidIndex}
            newAsset={newAsset}
            setNewAsset={setNewAsset}
            asset={asset}
            setAssetOpen={setAssetOpen}
            assets={assets}
            addAssetToData={addAssetToData}
            setAssetInfo={setAssetInfo}
          ></AddAssetManual>
        ) : (
          <AddAssetAutomatic
            setNetworkTOpen={setNetworkTOpen}
            networkTOpen={networkTOpen}
            setNetwork={setNetwork}
            network={network}
            setNewAsset={setNewAsset}
            newAsset={newAsset}
            setAssetTOpen={setAssetTOpen}
            addAssetToData={addAssetToData}
            assetTOpen={assetTOpen}
            setValidToken={setValidToken}
            setErrToken={setErrToken}
            errToken={errToken}
            setManual={setManual}
            newAssetList={newAssetList}
            assets={assets}
          ></AddAssetAutomatic>
        )}
      </div>
      {modal && (
        <DialogAssetConfirmation
          modal={modal}
          showModal={showModal}
          setAssetOpen={setAssetOpen}
          newAsset={newAsset}
          setNewAsset={setNewAsset}
          setNetwork={setNetwork}
          addStatus={addStatus}
          setManual={setManual}
        ></DialogAssetConfirmation>
      )}
    </Fragment>
  );

  function onClose() {
    addToAcordeonIdx();
    setAssetOpen(false);
    setNetwork(TokenNetworkEnum.enum["ICRC-1"]);
    setNewAsset({
      address: "",
      symbol: "",
      name: "",
      tokenSymbol: "",
      tokenName: "",
      decimal: "",
      shortDecimal: "",
      subAccounts: [
        {
          sub_account_id: "0x0",
          name: AccountDefaultEnum.Values.Default,
          amount: "0",
          currency_amount: "0",
          address: "",
          decimal: 0,
          symbol: "",
          transaction_fee: "",
        },
      ],
      index: "",
      sortIndex: 999,
      supportedStandards: [],
    });
    setManual(false);
    setAssetInfo(undefined);
  }

  async function addAssetToData() {
    if (checkAssetAdded(newAsset.address)) {
      setErrToken(t("adding.asset.already.imported"));
      setValidToken(false);
    } else {
      const idxSorting = assets.length > 0 ? [...assets].sort((a, b) => b.sortIndex - a.sortIndex) : [];
      const idx = (idxSorting.length > 0 ? idxSorting[0]?.sortIndex : 0) + 1;
      const tknSave: Asset = {
        ...newAsset,
        sortIndex: idx,
        subAccounts: [
          {
            sub_account_id: "0x0",
            name: AccountDefaultEnum.Values.Default,
            amount: "0",
            currency_amount: "0",
            address: "",
            decimal: 0,
            symbol: "",
            transaction_fee: "",
          },
        ],
      };
      setAddStatus(AddingAssetsEnum.enum.adding);
      showModal(true);
      await db().addAssets(tknSave);
      dispatch(setSelectedAsset(tknSave));
      dispatch(setAccordionAssetIdx([tknSave.symbol]));

      setAssetOpen(false);
      showModal(false);
      setManual(false);
      setNewAsset({
        address: "",
        symbol: "",
        name: "",
        tokenName: "",
        tokenSymbol: "",
        decimal: "",
        shortDecimal: "",
        subAccounts: [
          {
            sub_account_id: "0x0",
            name: AccountDefaultEnum.Values.Default,
            amount: "0",
            currency_amount: "0",
            address: "",
            decimal: 0,
            symbol: "",
            transaction_fee: "",
          },
        ],
        index: "",
        sortIndex: 999,
        supportedStandards: [],
      });
    }
  }

  function addToAcordeonIdx() {
    if (!accordionIndex.includes(asset?.tokenSymbol || "")) {
      dispatch(setAccordionAssetIdx([...accordionIndex, asset?.tokenSymbol || ""]));
    }
  }
};

export default AddAsset;
