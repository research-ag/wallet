import { TAllowance, AllowanceErrorFieldsEnum } from "@/@types/allowance";
import { ValidationErrors } from "@/@types/common";
import { IconTypeEnum } from "@/const";
import { getAssetIcon } from "@/utils/icons";
import { CurrencyInput } from "@components/input";
import { Asset } from "@redux/models/AccountModels";
import { useMemo } from "react";

interface IAmountFormItemProps {
  allowance: TAllowance;
  selectedAsset?: Asset | undefined;
  setAllowanceState: (allowanceData: Partial<TAllowance>) => void;
  isLoading?: boolean;
  errors?: ValidationErrors[];
}

export default function AmountFormItem(props: IAmountFormItemProps) {
  const { allowance, setAllowanceState, isLoading, errors } = props;
  const error = errors?.filter((error) => error.field === AllowanceErrorFieldsEnum.Values.amount)[0];
  const { asset } = allowance;

  const { icon, symbol } = useMemo(() => {
    const symbol = asset?.tokenSymbol;
    const logo = asset?.logo;
    return {
      icon: getAssetIcon(IconTypeEnum.Enum.ASSET, symbol, logo),
      symbol,
    };
  }, [allowance]);

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
        border={error ? "error" : undefined}
      />
    </div>
  );
}
