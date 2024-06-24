import { TransferFromTypeEnum, TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useAppSelector } from "@redux/Store";
import { toFullDecimal, validateAmount } from "@common/utils/amount";
import useTransferMaxAmount from "@pages/home/hooks/useTransferMaxAmount";
import { LoadingLoader } from "@components/loader";

export default function AmountDetails() {
  const { t } = useTranslation();
  const { transferState } = useTransfer();
  const { maxAmount, onMaxAmount, onChangeAmount } = useTransferMaxAmount();
  const assets = useAppSelector((state) => state.asset.list.assets);
  const services = useAppSelector((state) => state.services.services);
  const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol);
  //
  const senderService = services.find((service) => service.principal === transferState.fromPrincipal);
  const senderServiceAsset = senderService?.assets.find((asset) => asset.principal === currentAsset?.address);

  const receiverService = services.find((service) => service.principal === transferState.toPrincipal);
  const receiverServiceAsset = receiverService?.assets.find((asset) => asset.principal === currentAsset?.address);
  //
  const isReceiverService = transferState.toType === TransferToTypeEnum.thirdPartyService;
  const isSenderService = transferState.fromType === TransferFromTypeEnum.service;
  //
  const isToContact = transferState.toType === TransferToTypeEnum.thirdPartyContact;
  const isToOwnSubaccount = transferState.toType === TransferToTypeEnum.own;

  const isAmountValid = (() => {
    if (transferState.amount === "") return true;
    if (transferState.amount === undefined) return true;
    if (transferState.amount === "0") return false;
    return validateAmount(transferState.amount, Number(currentAsset?.decimal || "8"));
  })();

  return (
    <div className="max-w-[23rem] mx-auto space-y-[0.5rem]">
      <p className="font-bold bg-transparent opacity-50 text-md text-start">{t("amount.received")}</p>
      <div className={getAmountInputStyles(!isAmountValid)}>
        <input
          type="text"
          className="w-full px-4 py-2 ml-1 bg-transparent outline-none h-14"
          placeholder={`0 ${currentAsset?.symbol || ""}`}
          onChange={onChangeAmount}
          value={transferState.amount}
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

      {isReceiverService && (
        <p
          className={
            // TransactionValidationErrorsEnum.Values["error.lower.than.minimum.deposit"]
            getTextError(false)
          }
        >
          {t("minimun.deposit.is")}{" "}
          {toFullDecimal(
            receiverServiceAsset?.minDeposit || "0",
            Number(currentAsset?.decimal || "8"),
            Number(currentAsset?.shortDecimal || "8"),
          )}{" "}
          {currentAsset?.symbol || ""}
        </p>
      )}

      {isSenderService && (
        <p
          className={
            // TransactionValidationErrorsEnum.Values["error.lower.than.minimum.withdraw"]
            getTextError(false)
          }
        >
          {t("minimun.withdraw.is")}{" "}
          {toFullDecimal(
            senderServiceAsset?.minWithdraw || "0",
            Number(currentAsset?.decimal || "8"),
            Number(currentAsset?.shortDecimal || "8"),
          )}{" "}
          {currentAsset?.symbol || ""}
        </p>
      )}

      <div className="flex items-center justify-between w-full">
        <div className="flex">
          {!maxAmount.isLoading && maxAmount.isAmountFromMax && (
            <div className="flex">
              <p className="mr-1 text-sm text-primary-color">{t("max")}: </p>
              <p className="mr-2 text-sm text-primary-color">{maxAmount.maxAmount}</p>
            </div>
          )}

          {!maxAmount.isLoading && maxAmount.displayAvailable && maxAmount.isAmountFromMax && (
            <p className="text-sm text-primary-color">
              ({maxAmount.availableAmount} {t("available")})
            </p>
          )}
        </div>

        <div className="flex">
          <p className="mr-1 text-sm text-gray-400 ">
            {isReceiverService || isToContact || isToOwnSubaccount ? "Ledger " : ""} {t("fee")}
          </p>
          <p className="text-sm text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            {toFullDecimal(
              currentAsset?.subAccounts?.[0]?.transaction_fee || "0",
              Number(currentAsset?.decimal || "8"),
              Number(currentAsset?.shortDecimal || "8"),
            )}
            {currentAsset?.symbol || "-"}
          </p>
        </div>
      </div>

      {isReceiverService && (
        <div className="flex items-center justify-end w-full">
          <div className="flex">
            <p className="mr-1 text-sm text-gray-400 ">{t("deposit.fee")}</p>
            <p className="text-sm text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              {toFullDecimal(
                receiverServiceAsset?.depositFee || "0",
                Number(currentAsset?.decimal || "8"),
                Number(currentAsset?.shortDecimal || "8"),
              )}{" "}
              {currentAsset?.symbol || "-"}
            </p>
          </div>
        </div>
      )}

      {isSenderService && (
        <div className="flex items-center justify-end w-full">
          <div className="flex">
            <p className="mr-1 text-sm text-gray-400 ">{t("withdraw.fee")}</p>
            <p className="text-sm text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              {toFullDecimal(
                senderServiceAsset?.withdrawFee || "0",
                Number(currentAsset?.decimal || "8"),
                Number(currentAsset?.shortDecimal || "8"),
              )}{" "}
              {currentAsset?.symbol || "-"}
            </p>
          </div>
        </div>
      )}
    </div>
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

const getTextError = (error: boolean) =>
  clsx(
    "text-sm",
    "text-start",
    error ? "text-slate-color-error" : "text-PrimaryTextColorLight dark:text-PrimaryTextColor",
  );