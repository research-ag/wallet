import PlusIcon from "@assets/svg/files/plus-icon.svg";
// svgs
import AddAssetDrawer from "./AddAssetDrawer";
import { AssetMutationAction, setAssetMutationAction } from "@redux/assets/AssetReducer";
import { useAppDispatch } from "@redux/Store";

export default function AddAsset() {
  const dispatch = useAppDispatch();
  return (
    <>
      <div
        className="flex flex-row items-center justify-center w-8 h-8 rounded-md cursor-pointer bg-SelectRowColor"
        onClick={onAddAsset}
      >
        <img src={PlusIcon} alt="plus-icon" />
      </div>
      <AddAssetDrawer />
    </>
  );

  function onAddAsset() {
    dispatch(setAssetMutationAction(AssetMutationAction.ADD_AUTOMATIC));
  }
}
