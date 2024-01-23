import { SelectOption } from "@/@types/components";
import formatAsset from "@/utils/formatAsset";
import { Select } from "@components/select";
import { useAppSelector } from "@redux/Store";
import { setSenderAssetAction } from "@redux/transaction/TransactionActions";
import { useMemo, useState } from "react";

export default function SenderAsset() {
  const { assets } = useAppSelector((state) => state.asset);
  const { sender } = useAppSelector((state) => state.transaction);
  const [searchAsset, setSearchAsset] = useState<string | null>(null);

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

  // TODO: if not selected asset show bordered error
  return (
    <Select
      onSelect={onAssetChange}
      options={options}
      initialValue={sender?.asset?.tokenName}
      currentValue={sender?.asset?.tokenName}
      disabled={false}
      onSearch={onSearchChange}
      onOpenChange={onOpenChange}
    />
  );

  function onAssetChange(option: SelectOption) {
    setSearchAsset(null);
    const asset = assets.find((asset) => asset.tokenName === option.value);
    if (!asset) return;
    setSenderAssetAction(asset);
  }

  function onSearchChange(searchValue: string) {
    setSearchAsset(searchValue);
  }

  function onOpenChange() {
    setSearchAsset(null);
  }
}
