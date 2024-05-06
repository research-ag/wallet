import PlusIcon from "@assets/svg/files/plus-icon.svg";
// svgs
import AssetDrawer from "./AssetDrawer";
import { AssetMutationAction, setAssetMutationAction } from "@redux/assets/AssetReducer";
import { useAppDispatch } from "@redux/Store";

export default function AssetMutate() {
  const dispatch = useAppDispatch();
  return (
    <>
      <div className={containerStyles} onClick={onAddAsset}>
        <img src={PlusIcon} alt="plus-icon" />
      </div>
      <AssetDrawer />
    </>
  );

  function onAddAsset() {
    dispatch(setAssetMutationAction(AssetMutationAction.ADD_AUTOMATIC));
  }
}

const containerStyles = "flex flex-row items-center justify-center w-8 h-8 rounded-md cursor-pointer bg-SelectRowColor";
