import { Allowance } from "@/@types/allowance";
import { SelectOption } from "@/@types/core";
import { IconTypeEnum } from "@/const";
import { getAssetIcon } from "@/utils/icons";
import { Select } from "@components/core/select";
import { Errors } from "@pages/home/hooks/useCreateAllowance";
import { Asset } from "@redux/models/AccountModels";
import { useEffect, useMemo } from "react";

interface AssetFormItemProps {
  allowance: Allowance;
  assets: Asset[];
  selectedAsset: Asset | undefined;
  setAllowanceState: (allowanceData: Partial<Allowance>) => void;
  isLoading?: boolean;
  errors?: Errors[];
}

export default function AssetFormItem(props: AssetFormItemProps) {
  const { allowance, assets, selectedAsset, setAllowanceState, isLoading, errors } = props;
  const { asset } = allowance;

  function formatAsset(asset: Asset) {
    return {
      value: asset?.tokenName,
      label: `${asset?.tokenName} ${asset?.tokenSymbol}`,
      icon: getAssetIcon(IconTypeEnum.Enum.ASSET, asset?.tokenSymbol, asset?.logo),
    };
  }

  const options = useMemo(() => {
    return assets.map(formatAsset);
  }, []);

  const onAssetChange = (option: SelectOption) => {
    const fullAsset = assets.find((asset) => asset.tokenName === option.value);
    setAllowanceState({ asset: fullAsset, subAccount: {} });
  };

  useEffect(() => {
    setAllowanceState({ asset: selectedAsset });
  }, [selectedAsset]);

  return (
    <div className="mt-4">
      <label htmlFor="asset" className="text-lg">
        Asset
      </label>
      <Select
        onSelect={onAssetChange}
        options={options}
        initialValue={selectedAsset?.tokenName}
        currentValue={asset?.tokenName}
        disabled={isLoading}
      />
    </div>
  );
}
