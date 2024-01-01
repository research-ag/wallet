import { Allowance } from "@/@types/allowance";
import { IconTypeEnum } from "@/const";
import { getAssetIcon } from "@/utils/icons";
import { CurrencyInput } from "@components/core/input";
import { Asset } from "@redux/models/AccountModels";
import { useMemo } from "react";

interface IAmountFormItemProps {
  allowance: Allowance;
  selectedAsset?: Asset | undefined;
  setAllowanceState: (allowanceData: Partial<Allowance>) => void;
  isLoading?: boolean;
}

export default function AmountFormItem(props: IAmountFormItemProps) {
  const { allowance, selectedAsset, setAllowanceState, isLoading } = props;
  const { asset } = allowance;

  const { icon, symbol } = useMemo(() => {
    const symbol = asset?.tokenSymbol || selectedAsset?.tokenSymbol || "";
    const logo = asset?.logo || selectedAsset?.logo;
    return {
      icon: getAssetIcon(IconTypeEnum.Enum.ASSET, symbol, logo),
      symbol,
    };
  }, [allowance, selectedAsset]);

  const onAmountChange = (value: string) => {
    const amount = value;
    setAllowanceState({ amount });
  };

  return (
    <div className="mt-4">
      <label htmlFor="Amount" className="text-lg">
        Amount
      </label>
      <CurrencyInput
        onCurrencyChange={onAmountChange}
        currency={symbol}
        icon={icon}
        className="mt-2"
        isLoading={isLoading}
      />
    </div>
  );
}
