import { AllowanceValidationErrorsEnum, TAllowance } from "@/@types/allowance";
import { IconTypeEnum } from "@/common/const";
import { getAssetIcon } from "@/common/utils/icons";
import CurrencyInput from "@components/input/CurrencyInput";
import { useAppSelector } from "@redux/Store";
import { removeAllowanceErrorAction, setAllowanceErrorAction } from "@redux/allowance/AllowanceActions";
import { Asset } from "@redux/models/AccountModels";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { validateAmount } from "@common/utils/amount";

interface IAmountFormItemProps {
  allowance: TAllowance;
  selectedAsset?: Asset | undefined;
  isLoading?: boolean;
  setAllowanceState: (allowanceData: Partial<TAllowance>) => void;
}

export default function AmountFormItem(props: IAmountFormItemProps) {
  const { t } = useTranslation();
  const { errors } = useAppSelector((state) => state.allowance);
  const { allowance, selectedAsset, isLoading, setAllowanceState } = props;
  const { assets } = useAppSelector((state) => state.asset.list);
  const { asset } = allowance;

  const { icon, symbol } = useMemo(() => {
    const symbol = asset?.tokenSymbol || selectedAsset?.tokenSymbol || "";
    const logo = asset?.logo || selectedAsset?.logo;
    return {
      icon: getAssetIcon(IconTypeEnum.Enum.ASSET, symbol, logo),
      symbol,
    };
  }, [allowance, selectedAsset]);

  const assetSymbol = useMemo(() => {
    return assets.find((asset) => asset.tokenSymbol === allowance?.asset?.tokenSymbol)?.symbol;
  }, [allowance, assets]);

  return (
    <div className="mt-4">
      <label htmlFor="Amount" className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {t("amount")}
      </label>
      <CurrencyInput
        onCurrencyChange={onAmountChange}
        currency={assetSymbol || symbol}
        icon={icon}
        className="mt-2"
        isLoading={isLoading}
        value={allowance.amount}
        border={getError() ? "error" : undefined}
      />
    </div>
  );

  function getError(): boolean {
    return errors?.includes(AllowanceValidationErrorsEnum.Values["error.invalid.amount"]) || false;
  }

  function onAmountChange(value: string) {
    const amount = value.trim().replace(/[^0-9.]/g, "");
    setAllowanceState({ amount });
    const isValid = validateAmount(amount, Number(allowance.asset.decimal));
    if (!isValid) {
      setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.amount"]);
      return;
    }
    removeAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.amount"]);
  }
}
