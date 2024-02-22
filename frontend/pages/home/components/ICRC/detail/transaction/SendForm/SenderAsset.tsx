import { SelectOption } from "@/@types/components";
import formatAsset from "@/utils/formatAsset";
import { Select } from "@components/select";
import { useAppSelector } from "@redux/Store";
import { setSenderAssetAction } from "@redux/transaction/TransactionActions";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SenderAsset() {
  const { t } = useTranslation();
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

  return (
    <div>
      <p className="opacity-50 text-start text-black-color dark:text-white">{t("asset")}</p>
      <Select
        onSelect={onAssetChange}
        options={options}
        initialValue={sender?.asset?.tokenName}
        currentValue={sender?.asset?.tokenName}
        disabled={false}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
        contentWidth="23rem"
      />
    </div>
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
