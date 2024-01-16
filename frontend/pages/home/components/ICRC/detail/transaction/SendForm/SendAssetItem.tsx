import { SelectOption } from "@/@types/components";
import formatAsset from "@/utils/formatAsset";
import { Select } from "@components/select";
import { SenderInitialState } from "@pages/home/hooks/useSendFrom";
import { useAppSelector } from "@redux/Store";
import { Asset } from "@redux/models/AccountModels";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface SendAssetItemProps {
  asset: Asset;
  setSender: Dispatch<SetStateAction<SenderInitialState>>;
}

export default function SendAssetItem(props: SendAssetItemProps) {
  const { asset, setSender } = props;
  const [searchAsset, setSearchAsset] = useState<string | null>(null);
  const { assets } = useAppSelector((state) => state.asset);
  const { t } = useTranslation();

  function onAssetChange(option: SelectOption) {
    setSearchAsset(null);
    const asset = assets.find((asset) => asset.tokenName === option.value);
    if (!asset) return;
    setSender((prev) => ({ ...prev, asset }));
  }

  function onSearchChange(searchValue: string) {
    setSearchAsset(searchValue);
  }

  function onOpenChange() {
    setSearchAsset(null);
  }

  const options = useMemo(() => {
    if (!searchAsset) return assets.map(formatAsset);
  }, [searchAsset, assets]);

  return (
    <div className="">
      <label htmlFor="asset" className="text-lg">
        {t("asset")}
      </label>
      <Select
        onSelect={onAssetChange}
        options={options}
        initialValue={asset?.tokenName}
        currentValue={asset?.tokenName}
        disabled={false}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
