import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { useTranslation } from "react-i18next";
import { GeneralHook } from "../../../hooks/generalHook";
import { AccountDefaultEnum, TokenNetworkEnum } from "@/const";
import { TokenHook } from "../../../hooks/tokenHook";
import { Asset } from "@redux/models/AccountModels";
import { useAppDispatch, useAppSelector } from "@redux/Store";
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
import DialogAssetConfirmation from "./DialogAssetConfirmation";

export default function AddAssetDrawer() {
  const dispatch = useAppDispatch();
  const { checkAssetAdded } = GeneralHook();
  const { t } = useTranslation();

  const { assets } = useAppSelector((state) => state.asset);
  const { accordionIndex } = useAppSelector((state) => state.asset.helper);
  const { assetMutated, assetAction } = useAppSelector((state) => state.asset.mutation);

  const isDrawerOpen = useMemo(
    () => assetAction !== AssetMutationAction.NONE && assetAction !== AssetMutationAction.DELETE,
    [assetAction],
  );

  const isManual = useMemo(() => assetAction === AssetMutationAction.ADD_MANUAL, [assetAction]);
  const isUpdate = useMemo(() => assetAction === AssetMutationAction.UPDATE, [assetAction]);

  const {
    newAsset,
    setNewAsset,
    setNetwork,
    setValidToken,
    setErrIndex,
    setErrToken,
    errIndex,
    errToken,
    validToken,
    network,
  } = TokenHook();

  useEffect(() => {
    setErrToken("");
    setErrIndex("");
    setValidToken(false);
  }, [isDrawerOpen]);

  return (
    <BasicDrawer isDrawerOpen={isDrawerOpen}>
      <div className="px-8 mt-4 overflow-y-auto text-left text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
        <CloseAddAssetDrawer onClose={onClose} isEdit={assetMutated ? true : false} />

        {isManual || isUpdate ? (
          <AddAssetManual
            errToken={errToken}
            setErrToken={setErrToken}
            errIndex={errIndex}
            setErrIndex={setErrIndex}
            validToken={validToken}
            setValidToken={setValidToken}
            newAsset={newAsset}
            setNewAsset={setNewAsset}
            asset={assetMutated}
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
      <DialogAssetConfirmation
        newAsset={newAsset}
        setNewAsset={setNewAsset}
        setNetwork={setNetwork}
      />
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
    // setManual(false);
    dispatch(setAssetMutation(undefined));
  }
  async function addAssetToData() {
    if (checkAssetAdded(newAsset.address)) {
      setErrToken(t("adding.asset.already.imported"));
      setValidToken(false);
    } else {
      // TODO: set to redux status adding asset
      // setAddStatus(AddingAssetsEnum.enum.adding);
      // showModal(true);

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
      // TODO: close modal to the redux state
      // showModal(false);
      // TODO: set dispatch as NONE or ADD_MANUAL
      // setManual(false);
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
    if (!accordionIndex.includes(assetMutated?.tokenSymbol || "")) {
      dispatch(setAccordionAssetIdx([...accordionIndex, assetMutated?.tokenSymbol || ""]));
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
