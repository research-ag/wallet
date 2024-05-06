import PlusIcon from "@assets/svg/files/plus-icon.svg";
// svgs
import {
  AssetMutationAction,
  setAccordionAssetIdx,
  setAssetMutation,
  setAssetMutationAction,
} from "@redux/assets/AssetReducer";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { useMemo } from "react";
import { BasicDrawer } from "@components/drawer";
import CloseAssetDrawer from "./CloseAssetDrawer";
import AssetFormRender from "./AssetFormRender";

export default function AssetDrawerMutate() {
  const dispatch = useAppDispatch();
  const { accordionIndex } = useAppSelector((state) => state.asset.helper);
  const { assetMutated, assetAction } = useAppSelector((state) => state.asset.mutation);

  const isDrawerOpen = useMemo(
    () => assetAction !== AssetMutationAction.NONE && assetAction !== AssetMutationAction.DELETE,
    [assetAction],
  );

  return (
    <>
      <div className={containerStyles} onClick={onAddAsset}>
        <img src={PlusIcon} alt="plus-icon" />
      </div>
      <BasicDrawer isDrawerOpen={isDrawerOpen}>
        <div className={formContainerStyles}>
          <CloseAssetDrawer onClose={onClose} isEdit={assetMutated ? true : false} />
          <AssetFormRender />
        </div>
      </BasicDrawer>
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
}

const containerStyles = "flex flex-row items-center justify-center w-8 h-8 rounded-md cursor-pointer bg-SelectRowColor";

const formContainerStyles =
  "px-8 mt-4 overflow-y-auto text-left text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md";
