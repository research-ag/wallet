// svgs
import PlusIcon from "@assets/svg/files/plus-icon.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GeneralHook } from "../../../hooks/generalHook";
import { AccountDefaultEnum, AddingAssetsEnum, TokenNetworkEnum } from "@/const";
import { TokenHook } from "../../../hooks/tokenHook";
import { Asset } from "@redux/models/AccountModels";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import DialogAssetConfirmation from "./DialogAssetConfirmation";
import AddAssetManual from "./AddAssetManual";
import { setAccordionAssetIdx, setAssetMutation, setSelectedAsset } from "@redux/assets/AssetReducer";
import AddAssetAutomatic from "./AddAssetAutomatic";
import { db } from "@/database/db";
import { getAssetDetails } from "@pages/home/helpers/icrc";
import { BasicDrawer } from "@components/drawer";

const AddAsset = () => {
  const [assetOpen, setAssetOpen] = useState(false);
  const { assets } = useAppSelector((state) => state.asset);
  const { accordionIndex } = useAppSelector((state) => state.asset.helper);
  const { asset } = useAppSelector((state) => state.asset.mutation);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { checkAssetAdded } = GeneralHook();

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
    manual,
    setManual,
  } = TokenHook();

  useEffect(() => {
    setErrToken("");
    setErrIndex("");
    setValidToken(false);
  }, [assetOpen]);

  if (!assetOpen) return null;

  return (
    <>
      <div
        className="flex flex-row items-center justify-center w-8 h-8 rounded-md cursor-pointer bg-SelectRowColor"
        onClick={onAddAsset}
      >
        <img src={PlusIcon} alt="plus-icon" />
      </div>

      <BasicDrawer isDrawerOpen={assetOpen}>
        <div className="px-8 mt-4 overflow-y-auto text-left text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
          <CloseAddAssetDrawer onClose={onClose} isEdit={asset ? true : false} />

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
              newAsset={newAsset}
              setNewAsset={setNewAsset}
              asset={asset}
              setAssetOpen={setAssetOpen}
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
              setManual={setManual}
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
      </BasicDrawer>
    </>
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

  function onAddAsset() {
    setAssetOpen(true);
  }
};

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

export default AddAsset;
