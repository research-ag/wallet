import PlusIcon from "@assets/svg/files/plus-icon.svg";
// svgs
import { AssetMutationAction, setAssetMutationAction } from "@redux/assets/AssetReducer";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import AssetDrawerMutate from "./AssetDrawerMutate";

export default function AssetMutate() {
  const dispatch = useAppDispatch();
  const { assetAction } = useAppSelector((state) => state.asset.mutation);

  const isDrawerOpen = assetAction !== AssetMutationAction.NONE && assetAction !== AssetMutationAction.DELETE;

  return (
    <>
      <div className={containerStyles} onClick={onAddAsset}>
        <img src={PlusIcon} alt="plus-icon" />
      </div>
      {isDrawerOpen ? <AssetDrawerMutate isDrawerOpen={isDrawerOpen} /> : null}
    </>
  );

  function onAddAsset() {
    dispatch(setAssetMutationAction(AssetMutationAction.ADD_AUTOMATIC));
  }
}

const containerStyles = "flex flex-row items-center justify-center w-8 h-8 rounded-md cursor-pointer bg-SelectRowColor";
