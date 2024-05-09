import { useAppDispatch, useAppSelector } from "@redux/Store";
import * as Accordion from "@radix-ui/react-accordion";
import { Asset } from "@redux/models/AccountModels";
import AssetAccordionItem from "./AssetAccordionItem";
import { setAccordionAssetIdx } from "@redux/assets/AssetReducer";
import DeleteAssetModal from "./DeleteAssetModal";

interface AssetAccordionProps {
  searchKey: string;
}

export default function AssetAccordion(props: AssetAccordionProps) {
  const { searchKey } = props;
  const dispatch = useAppDispatch();
  const { assets } = useAppSelector((state) => state.asset.list);
  const { accordionIndex } = useAppSelector((state) => state.asset.helper);

  return (
    <div className="w-full max-h-[calc(100vh-13rem)] scroll-y-light">
      <Accordion.Root type="multiple" defaultValue={[]} value={accordionIndex} onValueChange={onValueChange}>
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
                assetIterationIndex={index}
                key={currentAsset.tokenSymbol}
                currentAsset={currentAsset}
              />
            );
        })}
      </Accordion.Root>
      <DeleteAssetModal />
    </div>
  );

  function onValueChange(tokenSymbols: string[]) {
    const differ = accordionIndex.map((index) => tokenSymbols.includes(index));
    if (differ.includes(true)) dispatch(setAccordionAssetIdx(tokenSymbols));
  }
}
