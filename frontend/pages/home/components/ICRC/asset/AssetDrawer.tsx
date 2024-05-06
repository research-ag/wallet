import { useAppDispatch, useAppSelector } from "@redux/Store";
import {
  AssetMutationAction,
  setAccordionAssetIdx,
  setAssetMutation,
  setAssetMutationAction,
} from "@redux/assets/AssetReducer";
import { BasicDrawer } from "@components/drawer";
import AssetFormRender from "./AssetFormRender";
import CloseAssetDrawer from "./CloseAssetDrawer";
import { useMemo } from "react";

export default function AssetDrawer() {
  const dispatch = useAppDispatch();
  const { accordionIndex } = useAppSelector((state) => state.asset.helper);
  const { assetMutated, assetAction } = useAppSelector((state) => state.asset.mutation);

  const isDrawerOpen = useMemo(
    () => assetAction !== AssetMutationAction.NONE && assetAction !== AssetMutationAction.DELETE,
    [assetAction],
  );

  return (
    <BasicDrawer isDrawerOpen={isDrawerOpen}>
      <div className={formContainerStyles}>
        <CloseAssetDrawer onClose={onClose} isEdit={assetMutated ? true : false} />
        <AssetFormRender />
      </div>
    </BasicDrawer>
  );

  function onClose() {
    if (!accordionIndex.includes(assetMutated?.tokenSymbol || "")) {
      dispatch(setAccordionAssetIdx([...accordionIndex, assetMutated?.tokenSymbol || ""]));
    }

    dispatch(setAssetMutation(undefined));
    dispatch(setAssetMutationAction(AssetMutationAction.NONE));
  }
}

const formContainerStyles =
  "px-8 mt-4 overflow-y-auto text-left text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md";
