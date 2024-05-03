import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { useTranslation } from "react-i18next";
import { GeneralHook } from "../../../hooks/generalHook";
import { AccountDefaultEnum, AddingAssetsEnum, TokenNetworkEnum } from "@/const";
import { TokenHook } from "../../../hooks/tokenHook";
import { Asset } from "@redux/models/AccountModels";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import DialogAssetConfirmation from "./DialogAssetConfirmation";
import AddAssetManual from "./AddAssetManual";
import {
  AssetMutationAction,
  setAccordionAssetIdx,
  setAssetMutation,
  setAssetMutationAction,
  setSelectedAsset,
} from "@redux/assets/AssetReducer";
import AddAssetAutomatic from "./AddAssetAutomatic";
import { db } from "@/database/db";
import { getAssetDetails } from "@pages/home/helpers/icrc";
import { BasicDrawer } from "@components/drawer";
import { useEffect, useMemo } from "react";

export default function AddAssetDrawer() {
  const dispatch = useAppDispatch();
  const { checkAssetAdded } = GeneralHook();
  const { t } = useTranslation();

  const { assets } = useAppSelector((state) => state.asset);
  const { accordionIndex } = useAppSelector((state) => state.asset.helper);
  const { asset, assetAction } = useAppSelector((state) => state.asset.mutation);

  const isDrawerOpen = useMemo(() => assetAction !== AssetMutationAction.NONE, [assetAction]);
  const isManual = useMemo(() => assetAction === AssetMutationAction.ADD_MANUAL, [assetAction]);
  console.log({
    assetAction,
    isDrawerOpen,
    isManual,
  });

  const {
    newAsset,
    setNewAsset,
    setNetwork,
    setValidToken,
    setErrIndex,
    setErrToken,
    errToken,
    validToken,
    showModal,
    network,
    modal,
    addStatus,
    setAddStatus,
    errIndex,
    setManual,
  } = TokenHook();

  useEffect(() => {
    setErrToken("");
    setErrIndex("");
    setValidToken(false);
  }, [isDrawerOpen]);

  return (
    <BasicDrawer isDrawerOpen={isDrawerOpen}>
      <div className="px-8 mt-4 overflow-y-auto text-left text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
        <CloseAddAssetDrawer onClose={onClose} isEdit={asset ? true : false} />

        {isManual ? (
          <AddAssetManual
            errToken={errToken}
            setErrToken={setErrToken}
            errIndex={errIndex}
            setErrIndex={setErrIndex}
            validToken={validToken}
            setValidToken={setValidToken}
            newAsset={newAsset}
            setNewAsset={setNewAsset}
            asset={asset}
            assets={assets}
            addAssetToData={addAssetToData}
          ></AddAssetManual>
        ) : (
          <AddAssetAutomatic
            setNetwork={setNetwork}
            network={network}
            setNewAsset={setNewAsset}
            newAsset={newAsset}
            addAssetToData={addAssetToData}
            setValidToken={setValidToken}
            setErrToken={setErrToken}
            errToken={errToken}
            assets={assets}
          ></AddAssetAutomatic>
        )}
      </div>
      {modal && (
        <DialogAssetConfirmation
          modal={modal}
          showModal={showModal}
          newAsset={newAsset}
          setNewAsset={setNewAsset}
          setNetwork={setNetwork}
          addStatus={addStatus}
          setManual={setManual}
        ></DialogAssetConfirmation>
      )}
    </BasicDrawer>
  );

  function onClose() {
    addToAcordeonIdx();
    dispatch(setAssetMutationAction(AssetMutationAction.NONE));
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
    dispatch(setAssetMutation(undefined));
  }
  async function addAssetToData() {
    if (checkAssetAdded(newAsset.address)) {
      setErrToken(t("adding.asset.already.imported"));
      setValidToken(false);
    } else {
      setAddStatus(AddingAssetsEnum.enum.adding);
      showModal(true);

      const idxSorting = assets.length > 0 ? [...assets].sort((a, b) => b.sortIndex - a.sortIndex) : [];
      const idx = (idxSorting.length > 0 ? idxSorting[0]?.sortIndex : 0) + 1;

      const updatedAsset = await getAssetDetails({
        canisterId: newAsset.address,
        includeDefault: true,
        customName: newAsset.name,
        customSymbol: newAsset.symbol,
        supportedStandard: newAsset.supportedStandards,
        sortIndex: idx,
      });

      const tknSave: Asset = {
        ...newAsset,
        ...updatedAsset,
        sortIndex: idx,
      };

      await db().addAsset(tknSave, { sync: true });
      dispatch(setSelectedAsset(tknSave));
      dispatch(setAccordionAssetIdx([tknSave.symbol]));

      dispatch(setAssetMutationAction(AssetMutationAction.NONE));
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
}

interface CloseAddAssetDrawerProps {
  isEdit: boolean;
  onClose: () => void;
}

function CloseAddAssetDrawer({ isEdit, onClose }: CloseAddAssetDrawerProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-center justify-between w-full mb-5">
      <p className="text-lg font-bold">{isEdit ? t("edit.asset") : t("add.asset")}</p>
      <CloseIcon
        className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
        onClick={onClose}
      />
    </div>
  );
}
