import AddAssetAutomatic from "./AddAssetAutomatic";
import { db } from "@/database/db";
import { getAssetDetails } from "@pages/home/helpers/icrc";
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
import { useMemo } from "react";
import AddAssetManual from "./AddAssetManual";
import { useTranslation } from "react-i18next";
import { GeneralHook } from "@pages/home/hooks/generalHook";
import DialogAssetConfirmation from "./DialogAssetConfirmation";
import { Asset } from "@redux/models/AccountModels";
import useAssetMutate from "@pages/home/hooks/useAssetMutate";

export default function AssetFormRender() {
  const dispatch = useAppDispatch();
  const { checkAssetAdded } = GeneralHook();
  const { t } = useTranslation();
  const { assets } = useAppSelector((state) => state.asset);
  const { assetMutated, assetAction } = useAppSelector((state) => state.asset.mutation);

  const isManual = useMemo(() => assetAction === AssetMutationAction.ADD_MANUAL, [assetAction]);
  const isUpdate = useMemo(() => assetAction === AssetMutationAction.UPDATE, [assetAction]);

  const { newAsset, setNewAsset, setValidToken, setErrIndex, setErrToken, errIndex, errToken, validToken } =
    useAssetMutate();

  return (
    <>
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
          addAssetToData={addAssetToData}
        ></AddAssetManual>
      ) : (
        <AddAssetAutomatic
          setNewAsset={setNewAsset}
          newAsset={newAsset}
          addAssetToData={addAssetToData}
          setValidToken={setValidToken}
          setErrToken={setErrToken}
          errToken={errToken}
        ></AddAssetAutomatic>
      )}

      <DialogAssetConfirmation newAsset={newAsset} />
    </>
  );

  async function addAssetToData() {
    if (checkAssetAdded(newAsset.address)) {
      setErrToken(t("adding.asset.already.imported"));
      setValidToken(false);
    } else {
      try {
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
        });

        const tknSave: Asset = { ...newAsset, ...updatedAsset, sortIndex };

        await db().addAsset(tknSave, { sync: true });

        dispatch(setAssetMutationResult(AssetMutationResult.ADDED));
        dispatch(setSelectedAsset(tknSave));
        dispatch(setAccordionAssetIdx([tknSave.symbol]));
      } catch (error) {
        console.error("Error adding asset", error);
        dispatch(setAssetMutationResult(AssetMutationResult.FAILED));
      } finally {
        setTimeout(() => {
          dispatch(setAssetMutationResult(AssetMutationResult.NONE));
          dispatch(setAssetMutationAction(AssetMutationAction.NONE));
          dispatch(setAssetMutation(undefined));
        }, 3000);
      }
    }
  }
}
