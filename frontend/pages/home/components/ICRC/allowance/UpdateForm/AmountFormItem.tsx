import { AllowanceErrorFieldsEnum, TAllowance } from "@/@types/allowance";
import { TErrorValidation } from "@/@types/common";
import { IconTypeEnum } from "@/const";
import { getAssetIcon } from "@/utils/icons";
import { CurrencyInput } from "@components/input";
import { Asset } from "@redux/models/AccountModels";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface IAmountFormItemProps {
  allowance: TAllowance;
  selectedAsset?: Asset | undefined;
  isLoading?: boolean;
  errors: TErrorValidation[];
  setAllowanceState: (allowanceData: Partial<TAllowance>) => void;
}

export default function AmountFormItem(props: IAmountFormItemProps) {
  const { t } = useTranslation();
  const { allowance, selectedAsset, isLoading, errors, setAllowanceState } = props;
  const { asset } = allowance;

  const error = errors?.filter((error) => error.field === AllowanceErrorFieldsEnum.Values.amount)[0];

  const { icon, symbol } = useMemo(() => {
    const symbol = asset?.tokenSymbol || selectedAsset?.tokenSymbol || "";
    const logo = asset?.logo || selectedAsset?.logo;
    return {
      icon: getAssetIcon(IconTypeEnum.Enum.ASSET, symbol, logo),
      symbol,
    };
  }, [allowance, selectedAsset]);

  const onAmountChange = (amount: string) => {
    setAllowanceState({ amount });
  };

  return (
    <div className="mt-4">
      <label htmlFor="Amount" className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {t("amount")}
      </label>
      <CurrencyInput
        onCurrencyChange={onAmountChange}
        currency={symbol}
        icon={icon}
        className="mt-2"
        isLoading={isLoading}
        value={allowance.amount}
        border={error ? "error" : undefined}
      />
    </div>
  );
}
