import PlusIcon from "@assets/svg/files/plus-icon.svg";
// svgs
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
import { BasicDrawer } from "@components/drawer";
import CloseAssetDrawer from "./CloseAssetDrawer";
import AddAssetAutomatic from "./AddAssetAutomatic";
import AddAssetManual from "./AddAssetManual";
import useAssetMutate from "@pages/home/hooks/useAssetMutate";
import DialogAssetConfirmation from "./DialogAssetConfirmation";
import { Asset } from "@redux/models/AccountModels";
import { getAssetDetails } from "@pages/home/helpers/icrc";
import { db } from "@/database/db";
import { useTranslation } from "react-i18next";

export default function AssetDrawerMutate() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { assets } = useAppSelector((state) => state.asset);
  const { accordionIndex } = useAppSelector((state) => state.asset.helper);
  const { assetMutated, assetAction } = useAppSelector((state) => state.asset.mutation);

  const { newAsset, setNewAsset, setValidToken, setErrIndex, setErrToken, errIndex, errToken, validToken } =
    useAssetMutate();

  const isManual = useMemo(() => assetAction === AssetMutationAction.ADD_MANUAL, [assetAction]);
  const isUpdate = useMemo(() => assetAction === AssetMutationAction.UPDATE, [assetAction]);
  const isDrawerOpen = useMemo(
    () => assetAction !== AssetMutationAction.NONE && assetAction !== AssetMutationAction.DELETE,
    [assetAction],
  );

  return (
    <>
      <div className={containerStyles} onClick={onAddAsset}>
        <img src={PlusIcon} alt="plus-icon" />
      </div>
      {isDrawerOpen && (
        <BasicDrawer isDrawerOpen={isDrawerOpen}>
          <div className={formContainerStyles}>
            <CloseAssetDrawer onClose={onClose} isEdit={assetMutated ? true : false} />


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

          </div>
        </BasicDrawer>
      )}
    </>
  );

  function onAddAsset() {
    dispatch(setAssetMutationAction(AssetMutationAction.ADD_AUTOMATIC));
  }

  function onClose() {
    if (!accordionIndex.includes(assetMutated?.tokenSymbol || "")) {
      dispatch(setAccordionAssetIdx([...accordionIndex, assetMutated?.tokenSymbol || ""]));
    }

    dispatch(setAssetMutation(undefined));
    dispatch(setAssetMutationAction(AssetMutationAction.NONE));
  }

  function isAssetAdded(address: string) {
    return assets.find((asst: Asset) => asst.address === address) ? true : false;
  };

  async function addAssetToData() {
    if (isAssetAdded(newAsset.address)) {
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

        const assetToSave: Asset = { ...newAsset, ...updatedAsset, sortIndex };
        await db().addAsset(assetToSave, { sync: true });

        dispatch(setAssetMutationResult(AssetMutationResult.ADDED));
        dispatch(setSelectedAsset(assetToSave));
        dispatch(setAccordionAssetIdx([assetToSave.symbol]));

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

const containerStyles = "flex flex-row items-center justify-center w-8 h-8 rounded-md cursor-pointer bg-SelectRowColor";

const formContainerStyles =
  "px-8 mt-4 overflow-y-auto text-left text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md";
