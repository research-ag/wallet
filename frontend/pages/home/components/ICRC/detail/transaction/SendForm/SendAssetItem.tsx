import { SetSenderAsset } from "@/@types/transactions";
import { SelectOption } from "@/@types/components";
import formatAsset from "@/utils/formatAsset";
import { Select } from "@components/select";
import { useAppSelector } from "@redux/Store";
import { Asset } from "@redux/models/AccountModels";
import { useMemo, useState } from "react";

export interface SendAssetItemProps {
  asset: Asset;
  setSenderAsset: SetSenderAsset;
}

export default function SendAssetItem(props: SendAssetItemProps) {
  const { asset, setSenderAsset } = props;
  const [searchAsset, setSearchAsset] = useState<string | null>(null);
  const { assets } = useAppSelector((state) => state.asset);

  const options = useMemo(() => {
    if (!searchAsset) return assets.map(formatAsset);
    const searchLower = searchAsset.toLowerCase().trim();

    return assets
      .filter((asset) => {
        return (
          asset.tokenName.toLowerCase().includes(searchLower) || asset.tokenSymbol.toLowerCase().includes(searchLower)
        );
      })
      .map(formatAsset);
  }, [searchAsset, assets]);

  return (
    <Select
      onSelect={onAssetChange}
      options={options}
      initialValue={asset?.tokenName}
      currentValue={asset?.tokenName}
      disabled={false}
      onSearch={onSearchChange}
      onOpenChange={onOpenChange}
    />
  );

  function onAssetChange(option: SelectOption) {
    setSearchAsset(null);
    const asset = assets.find((asset) => asset.tokenName === option.value);
    if (!asset) return;
    setSenderAsset(asset);
  }

  function onSearchChange(searchValue: string) {
    setSearchAsset(searchValue);
  }

  function onOpenChange() {
    setSearchAsset(null);
  }
}
