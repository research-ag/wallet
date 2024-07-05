import { TAllowance, AllowanceValidationErrorsEnum } from "@/@types/allowance";
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
  setAllowanceState: (allowanceData: Partial<TAllowance>) => void;
  isLoading?: boolean;
}

export default function AmountFormItem(props: IAmountFormItemProps) {
  const { t } = useTranslation();
  const { errors } = useAppSelector((state) => state.allowance);
  const { assets } = useAppSelector((state) => state.asset.list);
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

  const assetSymbol = useMemo(() => {
    return assets.find((asset) => asset.tokenSymbol === allowance?.asset?.tokenSymbol)?.symbol;
  }, [allowance, assets]);

  return (
    <div className="mx-auto mt-4 w-[22rem]">
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
