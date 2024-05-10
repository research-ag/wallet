import { BasicDrawer } from "@components/drawer";
import CloseAssetDrawer from "./CloseAssetDrawer";
import AddAssetAutomatic from "./AddAssetAutomatic";
import AddAssetManual from "./AddAssetManual";
import { useMemo } from "react";
import {
  AssetMutationAction,
  setAccordionAssetIdx,
  setAssetMutation,
  setAssetMutationAction,
} from "@redux/assets/AssetReducer";
import { useAppDispatch, useAppSelector } from "@redux/Store";

export default function AssetDrawerMutate({ isDrawerOpen }: { isDrawerOpen: boolean }) {
  const dispatch = useAppDispatch();
  const { assetMutated, assetAction } = useAppSelector((state) => state.asset.mutation);
  const { accordionIndex } = useAppSelector((state) => state.asset.helper);

  const isManual = useMemo(() => assetAction === AssetMutationAction.ADD_MANUAL, [assetAction]);
  const isUpdate = useMemo(() => assetAction === AssetMutationAction.UPDATE, [assetAction]);

  return (
    <BasicDrawer isDrawerOpen={isDrawerOpen}>
      <div className={formContainerStyles}>
        <CloseAssetDrawer onClose={onClose} isEdit={assetMutated ? true : false} />
        {isManual || isUpdate ? <AddAssetManual /> : <AddAssetAutomatic />}
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
