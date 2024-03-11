import { TransactionValidationErrorsEnum } from "@/@types/transactions";
import { toFullDecimal, toHoleBigInt, validateAmount } from "@/utils";
import LoadingLoader from "@components/Loader";
import useSend from "@pages/home/hooks/useSend";
import { useAppSelector } from "@redux/Store";
import { removeErrorAction, setAmountAction, setErrorAction } from "@redux/transaction/TransactionActions";
import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";

export default function TransactionAmount() {
  const [isMaxAmountLoading, setMaxAmountLoading] = useState(false);
  const { sender, errors, amount } = useAppSelector((state) => state.transaction);
  const { transactionFee, getSenderBalance } = useSend();
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
        {isMaxAmountLoading && <LoadingLoader className="mr-2" />}
        {!isMaxAmountLoading && (
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
          <p className="mr-1 text-md">Max: </p>
          <p className="mr-2 text-md">0</p>
          <p className="text-gray-400 text-md">(0.5 available)</p>
        </div>
        <div className="flex">
          <p className="mr-1 text-gray-400 text-md">{t("fee")}</p>
          <p className="text-md">
            {transactionFee} {sender?.asset?.tokenSymbol || "-"}
          </p>
        </div>
      </div>
    </>
  );

  function onChangeAmount(e: ChangeEvent<HTMLInputElement>) {
    const amount = e.target.value.trim();
    setAmountAction(amount);
    const isValidAmount = validateAmount(amount, Number(sender.asset.decimal));

    if (!isValidAmount || Number(amount) === 0) {
      setErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.amount"]);
      return;
    }

    removeErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.amount"]);
  }

  async function onMaxAmount() {
    try {
      setMaxAmountLoading(true);
      const balance = await getSenderBalance();
      const bigintBalance = toHoleBigInt(balance || "0", Number(sender?.asset?.decimal));
      const bigintFee = toHoleBigInt(transactionFee || "0", Number(sender?.asset?.decimal));
      const bigintMaxAmount = bigintBalance - bigintFee;

      if (bigintBalance <= bigintFee) {
        setErrorAction(TransactionValidationErrorsEnum.Values["error.not.enough.balance"]);
        return;
      }
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.not.enough.balance"]);
      const maxAmount = toFullDecimal(bigintMaxAmount, Number(sender?.asset?.decimal));
      setAmountAction(maxAmount);
    } catch (error) {
      console.log(error);
    } finally {
      setMaxAmountLoading(false);
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.amount"]);
    }
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
