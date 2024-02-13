import { TAllowance, AllowanceValidationErrorsEnum } from "@/@types/allowance";
import { IconTypeEnum } from "@/const";
import { getAssetIcon } from "@/utils/icons";
import { CurrencyInput } from "@components/input";
import { useAppSelector } from "@redux/Store";
import { Asset } from "@redux/models/AccountModels";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface IAmountFormItemProps {
  allowance: TAllowance;
  selectedAsset?: Asset | undefined;
  setAllowanceState: (allowanceData: Partial<TAllowance>) => void;
  isLoading?: boolean;
}

export default function AmountFormItem(props: IAmountFormItemProps) {
  const { t } = useTranslation();
  const { errors } = useAppSelector((state) => state.allowance);
  const { allowance, setAllowanceState, isLoading } = props;
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
      <label htmlFor="Amount" className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {t("amount")}
      </label>
      <CurrencyInput
        onCurrencyChange={onAmountChange}
        currency={symbol}
        icon={icon}
        className="mt-2"
        isLoading={isLoading}
        value={allowance.amount || ""}
        border={getError() ? "error" : undefined}
      />
    </div>
  );

  function getError(): boolean {
    return errors?.includes(AllowanceValidationErrorsEnum.Values["error.invalid.amount"]) || false;
  }
}
