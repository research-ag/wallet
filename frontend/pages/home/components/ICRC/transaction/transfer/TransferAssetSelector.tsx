import { SelectOption } from "@/@types/components";
import formatAsset from "@common/utils/formatAsset";
import { BasicSelect } from "@components/select";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { useAppSelector } from "@redux/Store";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function TransferAssetSelector() {
  const { transferState, setTransferState } = useTransfer();
  const { t } = useTranslation();
  const { assets } = useAppSelector((state) => state.asset.list);
  const [searchAsset, setSearchAsset] = useState<string | null>(null);

  const options = (() => {
    if (!searchAsset) return assets.map(formatAsset);
    const searchLower = searchAsset.toLowerCase().trim();

    return assets
      .filter((asset) => {
        return asset.name.toLowerCase().includes(searchLower) || asset.symbol.toLowerCase().includes(searchLower);
      })
      .map(formatAsset);
  })();

  return (
    <div className="max-w-[22rem] mx-auto">
      <p className="opacity-50 text-start text-black-color dark:text-white text-md">{t("asset")}</p>
      <BasicSelect
        onSelect={onAssetChange}
        options={options}
        initialValue={transferState.tokenSymbol}
        currentValue={transferState.tokenSymbol}
        disabled={false}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
        componentWidth="22rem"
      />
    </div>
  );

  function onAssetChange(option: SelectOption) {
    setSearchAsset(null);
    setTransferState((prev) => ({
      ...prev,
      tokenSymbol: option.value,
      fromPrincipal: "",
      toPrincipal: "",
      fromSubAccount: "",
      toSubAccount: "",
    }));
  }

  function onSearchChange(searchValue: string) {
    setSearchAsset(searchValue);
  }

  function onOpenChange() {
    setSearchAsset(null);
  }
}
