import { TAllowance, AllowanceValidationErrorsEnum } from "@/@types/allowance";
import { SelectOption } from "@/@types/components";
import { SupportedStandardEnum } from "@/@types/icrc";
import { IconTypeEnum } from "@/common/const";
import { getAssetIcon } from "@/common/utils/icons";
import { BasicSelect } from "@components/select";
import { getAllowanceAsset } from "@pages/allowances/helpers/mappers";
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
          currentAsset.name.toLowerCase().includes(searchLower) ||
          currentAsset.symbol.toLowerCase().includes(searchLower)
        );
      })
      .map(formatAsset);
  }, [search, assets]);

  return (
    <div className="mx-auto mt-4 w-[22rem]">
      <label htmlFor="asset" className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {t("asset")}
      </label>
      <BasicSelect
        onSelect={onAssetChange}
        options={options}
        initialValue={selectedAsset?.tokenSymbol}
        currentValue={asset?.tokenSymbol}
        disabled={isLoading}
        border={isError() ? "error" : undefined}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
        componentWidth="22rem"
      />
    </div>
  );

  function isError(): boolean {
    return errors?.includes(AllowanceValidationErrorsEnum.Values["error.invalid.asset"]) || false;
  }

  function formatAsset(asset: Asset) {
    return {
      value: asset?.tokenSymbol,
      label: `${asset?.name} / ${asset?.symbol}`,
      icon: getAssetIcon(IconTypeEnum.Enum.ASSET, asset?.tokenSymbol, asset?.logo),
    };
  }

  function onAssetChange(option: SelectOption) {
    setSearch(null);
    const fullAsset = assets.find((currentAsset) => currentAsset.tokenSymbol === option.value) as Asset;
    const asset = getAllowanceAsset(fullAsset);
    setAllowanceState({ asset, subAccountId: initialAllowanceState.subAccountId });
  }

  function onSearchChange(searchValue: string) {
    setSearch(searchValue);
  }

  function onOpenChange() {
    setSearch(null);
  }
}
