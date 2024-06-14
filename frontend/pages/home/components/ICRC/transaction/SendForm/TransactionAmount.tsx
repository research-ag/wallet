import { TransactionSenderOptionEnum, TransactionValidationErrorsEnum } from "@/@types/transactions";
import { toFullDecimal } from "@common/utils/amount";
import { LoadingLoader } from "@components/loader";
import useTransactionAmount from "@pages/home/hooks/useTransactionAmount";
import { useAppSelector } from "@redux/Store";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";

export default function TransactionAmount() {
  const { maxAmount, transactionFee, onChangeAmount, onMaxAmount } = useTransactionAmount();
  const { sender, receiver, errors, amount } = useAppSelector((state) => state.transaction);
  const { t } = useTranslation();

  return (
    <>
      <p className="font-bold bg-transparent opacity-50 text-md text-start">{t("amount.received")}</p>
      <div
        className={clsx(
          getAmountInputStyles(
            errors?.includes(TransactionValidationErrorsEnum.Values["error.invalid.amount"]) ||
              errors?.includes(TransactionValidationErrorsEnum.Values["error.allowance.not.enough"]) ||
              errors?.includes(TransactionValidationErrorsEnum.Values["error.lower.than.minimum.deposit"]) ||
              errors?.includes(TransactionValidationErrorsEnum.Values["error.lower.than.minimum.withdraw"]) ||
              false,
          ),
        )}
      >
        <input
          type="text"
          className="w-full px-4 py-2 ml-1 bg-transparent outline-none h-14"
          placeholder={`0 ${sender?.asset?.symbol || "-"}`}
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

      {receiver.serviceSubAccount.servicePrincipal && (
        <p
          className={`text-sm text-start ${
            errors?.includes(TransactionValidationErrorsEnum.Values["error.lower.than.minimum.deposit"])
              ? "text-slate-color-error"
              : "text-PrimaryTextColorLight dark:text-PrimaryTextColor"
          }`}
        >{`${t("minimun.deposit.is")} ${toFullDecimal(
          receiver.serviceSubAccount.minDeposit,
          Number(receiver.serviceSubAccount.assetDecimal || "8"),
          Number(receiver.serviceSubAccount.assetShortDecimal || "8"),
        )} ${receiver.serviceSubAccount.assetSymbol || ""}`}</p>
      )}

      {sender.senderOption === TransactionSenderOptionEnum.Values.service && (
        <p
          className={`text-sm text-start ${
            errors?.includes(TransactionValidationErrorsEnum.Values["error.lower.than.minimum.withdraw"])
              ? "text-slate-color-error"
              : "text-PrimaryTextColorLight dark:text-PrimaryTextColor"
          }`}
        >{`${t("minimun.withdraw.is")} ${toFullDecimal(
          sender.serviceSubAccount.minWithdraw,
          Number(sender.serviceSubAccount.assetDecimal || "8"),
          Number(sender.serviceSubAccount.assetShortDecimal || "8"),
        )} ${sender.serviceSubAccount.assetSymbol || ""}`}</p>
      )}

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
          <p className="mr-1 text-sm text-gray-400 ">{`${
            receiver.serviceSubAccount.servicePrincipal ? "Ledger " : ""
          }${t("fee")}`}</p>
          <p className="text-sm text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            {transactionFee} {sender?.asset?.tokenSymbol || "-"}
          </p>
        </div>
      </div>

      {receiver.serviceSubAccount.servicePrincipal && (
        <div className="flex items-center justify-end w-full">
          <div className="flex">
            <p className="mr-1 text-sm text-gray-400 ">{t("deposit.fee")}</p>
            <p className="text-sm text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              {toFullDecimal(
                receiver.serviceSubAccount.depositFee,
                Number(sender.serviceSubAccount.assetDecimal || "8"),
                Number(sender.serviceSubAccount.assetShortDecimal || "8"),
              )}{" "}
              {sender?.asset?.tokenSymbol || "-"}
            </p>
          </div>
        </div>
      )}

      {sender.senderOption === TransactionSenderOptionEnum.Values.service && (
        <div className="flex items-center justify-end w-full">
          <div className="flex">
            <p className="mr-1 text-sm text-gray-400 ">{t("withdraw.fee")}</p>
            <p className="text-sm text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              {toFullDecimal(
                sender.serviceSubAccount.withdrawFee,
                Number(sender.serviceSubAccount.assetDecimal || "8"),
                Number(sender.serviceSubAccount.assetShortDecimal || "8"),
              )}{" "}
              {sender?.asset?.tokenSymbol || "-"}
            </p>
          </div>
        </div>
      )}
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
