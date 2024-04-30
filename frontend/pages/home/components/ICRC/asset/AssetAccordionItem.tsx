import { Asset } from "@redux/models/AccountModels";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import * as Accordion from "@radix-ui/react-accordion";
import clsx from "clsx";
import { setSelectedAsset } from "@redux/assets/AssetReducer";

interface AssetAccordionItemProps {
  currentAsset: Asset;
  isCurrentAssetLast: boolean;
}

export default function AssetAccordionItem(props: AssetAccordionItemProps) {
  const { currentAsset, isCurrentAssetLast } = props;
  const dispatch = useAppDispatch();
  const { selectedAsset } = useAppSelector((state) => state.asset);

  const isCurrentAssetSelected = currentAsset?.tokenSymbol === selectedAsset?.tokenSymbol;

  return (
    <Accordion.Item value={currentAsset.tokenSymbol}>
      <div className={getAssetElementStyles(isCurrentAssetSelected, isCurrentAssetLast)} onClick={onSelectAsset}>
        <p>{currentAsset.tokenSymbol}</p>
      </div>
    </Accordion.Item>
  );

  function onSelectAsset() {
    dispatch(setSelectedAsset(currentAsset));
  }
}

const getAssetElementStyles = (isSelected: boolean, isNotLast: boolean) =>
  clsx(
    "relative flex flex-row items-center w-full h-16 text-PrimaryColor dark:text-PrimaryColorLight cursor-pointer hover:bg-SecondaryColorLight dark:hover:bg-SecondaryColor",
    isSelected ? "bg-SecondaryColorLight dark:bg-SecondaryColor" : "",
    isNotLast ? "border-b-[0.1rem] dark:border-BorderColorThree border-BorderColorThreeLight" : "",
  );
