import { TAllowance, AllowanceValidationErrorsEnum } from "@/@types/allowance";
import { SelectOption } from "@/@types/components";
import { SupportedStandardEnum } from "@/@types/icrc";
import formatAsset from "@/utils/formatAsset";
import { Select } from "@components/select";
import { useAppSelector } from "@redux/Store";
import { initialAllowanceState } from "@redux/allowance/AllowanceReducer";
import { Asset } from "@redux/models/AccountModels";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface AssetFormItemProps {
  allowance: TAllowance;
  assets: Asset[];
  selectedAsset: Asset | undefined;
  setAllowanceState: (allowanceData: Partial<TAllowance>) => void;
  isLoading?: boolean;
}

export default function AssetFormItem(props: AssetFormItemProps) {
  const { t } = useTranslation();
  const { errors } = useAppSelector((state) => state.allowance);
  const [search, setSearch] = useState<string | null>(null);
  const { allowance, assets, selectedAsset, setAllowanceState, isLoading } = props;
  const { asset } = allowance;

  const options = useMemo(() => {
    const filteredAssets = assets.filter((currentAsset) =>
      currentAsset.supportedStandards.includes(SupportedStandardEnum.Values["ICRC-2"]),
    );

    if (!search) return filteredAssets.map(formatAsset);
    const searchLower = search.toLowerCase();

    return filteredAssets
      .filter((currentAsset) => {
        return (
          currentAsset.tokenName.toLowerCase().includes(searchLower) ||
          currentAsset.tokenSymbol.toLowerCase().includes(searchLower)
        );
      })
      .map(formatAsset);
  }, [search, assets]);

  const onAssetChange = (option: SelectOption) => {
    setSearch(null);
    const fullAsset = assets.find((currentAsset) => currentAsset.tokenName === option.value);
    setAllowanceState({ asset: fullAsset, subAccount: initialAllowanceState.subAccount });
  };

  const onSearchChange = (searchValue: string) => {
    setSearch(searchValue);
  };

  const onOpenChange = () => setSearch(null);

  return (
    <div className="mt-4">
      <label htmlFor="asset" className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {t("asset")}
      </label>
      <Select
        onSelect={onAssetChange}
        options={options}
        initialValue={selectedAsset?.tokenName}
        currentValue={asset?.tokenName}
        disabled={isLoading}
        border={isError() ? "error" : undefined}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
      />
    </div>
  );

  function isError(): boolean {
    return errors?.includes(AllowanceValidationErrorsEnum.Values["error.invalid.asset"]) || false;
  }
}
