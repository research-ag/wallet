import { useAppDispatch, useAppSelector } from "@redux/Store";
import * as Accordion from "@radix-ui/react-accordion";
import { Asset } from "@redux/models/AccountModels";
import AssetAccordionItem from "./AssetAccordionItem";
import { setAccordionAssetIdx } from "@redux/assets/AssetReducer";
import { UseAsset } from "@pages/home/hooks/useAsset";

interface AssetAccordionProps {
  searchKey: string;
}

export default function AssetAccordion(props: AssetAccordionProps) {
  UseAsset();
  console.log("rendering");

  const { searchKey } = props;
  const dispatch = useAppDispatch();
  const { assets } = useAppSelector((state) => state.asset);

  return (
    <div className="w-full max-h-[calc(100vh-13rem)] scroll-y-light">
      {/* <Accordion.Root
        type="multiple"
        defaultValue={[]}
        value={
          (addOpen || assetOpen) && selectedAsset
            ? [...accordionIndex, selectedAsset.tokenSymbol]
            : accordionIndex
        }
        onValueChange={onValueChange}
      >
      </Accordion.Root> */}
      <Accordion.Root type="multiple" defaultValue={[]} onValueChange={onValueChange}>
        {assets.map((currentAsset: Asset, index) => {
          const cleanSearchKey = searchKey.toLocaleLowerCase().trim();

          const isNameIncluded = currentAsset?.name?.toLocaleLowerCase().includes(cleanSearchKey);

          const isSymbolIncluded = currentAsset?.symbol?.toLocaleLowerCase().includes(cleanSearchKey);

          const isSubAccountIncluded = currentAsset.subAccounts
            .map((subAccount) => {
              const isSubAccountNameIncluded = subAccount?.name?.toLocaleLowerCase().includes(cleanSearchKey);

              const isSubAccountIdIncluded = subAccount?.sub_account_id?.toLocaleLowerCase().includes(cleanSearchKey);

              return isSubAccountNameIncluded || isSubAccountIdIncluded;
            })
            .includes(true);

          const isSearchKeyEmpty = cleanSearchKey === "";

          const renderAsset = isNameIncluded || isSymbolIncluded || isSubAccountIncluded || isSearchKeyEmpty;

          if (renderAsset)
            return (
              <AssetAccordionItem
                isCurrentAssetLast={index === assets.length - 1}
                key={currentAsset.tokenSymbol}
                currentAsset={currentAsset}
              />
            );
        })}
      </Accordion.Root>
    </div>
  );

  function onValueChange(tokenSymbols: string[]) {
    dispatch(setAccordionAssetIdx(tokenSymbols));
  }
}
