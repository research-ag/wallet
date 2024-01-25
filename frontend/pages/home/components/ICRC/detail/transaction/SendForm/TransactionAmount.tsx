import { ValidationErrorsEnum } from "@/@types/transactions";
import { validateAmount } from "@/utils";
import { ReactComponent as ExchangeIcon } from "@assets/svg/files/arrows-exchange-v.svg";
import useSend from "@pages/home/hooks/useSend";
import { useAppSelector } from "@redux/Store";
import { removeErrorAction, setAmountAction, setErrorAction } from "@redux/transaction/TransactionActions";
import clsx from "clsx";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

export default function TransactionAmount() {
  const { sender, errors, amount } = useAppSelector((state) => state.transaction);
  const { transactionFee, getSenderBalance } = useSend();
  const { t } = useTranslation();

  return (
    <>
      <p className="font-bold bg-transparent opacity-50 text-md text-start">{t("amount")}</p>
      <div
        className={clsx(getAmountInputStyles(errors?.includes(ValidationErrorsEnum.Values["invalid.amount"]) || false))}
      >
        <input
          type="text"
          className="w-full px-4 py-2 ml-1 bg-transparent outline-none h-14"
          placeholder={`0 ${sender?.asset?.tokenSymbol}`}
          onChange={onChangeAmount}
          value={amount || ""}
        />
        <button
          className="flex items-center justify-center p-1 rounded cursor-pointer bg-RadioCheckColor"
          onClick={onMaxAmount}
        >
          <p className="text-sm text-PrimaryTextColor">{t("max")}</p>
        </button>
        <ExchangeIcon />
      </div>
      <div className="flex flex-row items-center justify-end gap-2 text-md whitespace-nowrap">
        <p className="opacity-60">{t("fee")}</p>
        <p>
          {transactionFee} {sender?.asset?.tokenSymbol}
        </p>
      </div>
    </>
  );

  async function onChangeAmount(e: ChangeEvent<HTMLInputElement>) {
    try {
      const amount = e.target.value.trim();
      const isValid = Number(amount) >= 0 || amount !== "";

      if (!isValid) {
        setErrorAction(ValidationErrorsEnum.Values["invalid.amount"]);
        return;
      }
      setAmountAction(amount);

      const isValidAmount = validateAmount(amount, Number(sender.asset.decimal));

      if (!isValidAmount) {
        setErrorAction(ValidationErrorsEnum.Values["invalid.amount"]);
        return;
      }

      const balance = await getSenderBalance();
      const maxAmount = Number(balance) - Number(transactionFee);
      const isMaxValid = Number(amount) <= maxAmount;

      if (!isMaxValid) {
        setErrorAction(ValidationErrorsEnum.Values["invalid.amount"]);
        return;
      }

      if (isValid && isValidAmount && isMaxValid) {
        removeErrorAction(ValidationErrorsEnum.Values["invalid.amount"]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onMaxAmount() {
    try {
      const balance = await getSenderBalance();
      if (Number(balance) == 0) {
        setAmountAction("0");
        return;
      }
      const maxAmount = Number(balance) - Number(transactionFee);
      setAmountAction(String(maxAmount));
    } catch (error) {
      console.log(error);
    }
    removeErrorAction(ValidationErrorsEnum.Values["invalid.amount"]);
    return;
  }
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
