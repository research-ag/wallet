import { TransactionValidationErrorsEnum } from "@/@types/transactions";
import { LoadingLoader } from "@components/loader";
import useTransactionAmount from "@pages/home/hooks/useTransactionAmount";
import { useAppSelector } from "@redux/Store";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";

export default function TransactionAmount() {
  const { maxAmount, transactionFee, onChangeAmount, onMaxAmount } = useTransactionAmount();
  const { sender, errors, amount } = useAppSelector((state) => state.transaction);
  const { t } = useTranslation();

  return (
    <>
      <p className="font-bold bg-transparent opacity-50 text-md text-start">{t("amount")}</p>
      <div
        className={clsx(
          getAmountInputStyles(
            errors?.includes(TransactionValidationErrorsEnum.Values["error.invalid.amount"]) || false,
          ),
        )}
      >
        <input
          type="text"
          className="w-full px-4 py-2 ml-1 bg-transparent outline-none h-14"
          placeholder={`0 ${sender?.asset?.tokenSymbol}`}
          onChange={onChangeAmount}
          value={amount || ""}
        />
        {maxAmount.isLoading && <LoadingLoader className="mr-4" />}
        {!maxAmount.isLoading && (
          <button
            className="flex items-center justify-center p-1 mr-2 rounded cursor-pointer bg-RadioCheckColor"
            onClick={onMaxAmount}
          >
            <p className="text-sm text-PrimaryTextColor">{t("max")}</p>
          </button>
        )}
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex">
          {maxAmount.isAmountFromMax && !maxAmount.isLoading && (
            <div className="flex">
              <p className="mr-1 text-sm text-primary-color">{t("max")}: </p>
              <p className="mr-2 text-sm text-primary-color">{maxAmount.transactionAmountWithoutFee}</p>
            </div>
          )}

          {maxAmount.isAmountFromMax && !maxAmount.isLoading && maxAmount.showAvailable && (
            <p className="text-sm text-primary-color">
              ({maxAmount.allowanceSubAccountBalance} {t("available")})
            </p>
          )}
        </div>

        <div className="flex">
          <p className="mr-1 text-sm text-gray-400 ">{t("fee")}</p>
          <p className="text-sm text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            {transactionFee} {sender?.asset?.tokenSymbol || "-"}
          </p>
        </div>
      </div>
    </>
  );
}

function getAmountInputStyles(hasError: boolean) {
  return clsx(
    "flex",
    "justify-start",
    "items-center",
    "rounded-md",
    "h-14",
    "bg-ThemeColorSelectorLight dark:bg-SecondaryColor",
    "text-PrimaryTextColorLight dark:text-PrimaryTextColor",
    "border",
    hasError ? "border-slate-color-error" : "border-BorderColorLight dark:border-BorderColor",
  );
}
