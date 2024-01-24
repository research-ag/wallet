import { validateAmount } from "@/utils";
import { CustomInput } from "@components/Input";
import { useAppSelector } from "@redux/Store";
import { setAmountAction } from "@redux/transaction/TransactionActions";
import clsx from "clsx";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

export default function TransactionAmount() {
  const { amount, sender } = useAppSelector((state) => state.transaction);
  const { t } = useTranslation();

  return (
    <>
      <p className="font-bold opacity-50 text-md text-start">Amount</p>
      <div className={clsx(sendBox, "border-BorderColorLight dark:border-BorderColor", "items-center", "!mb-1")}>
        <div className={clsx(accountInfo)} lang="en-US">
          <CustomInput
            intent={"primary"}
            placeholder={`0 ${sender?.asset?.tokenSymbol} `}
            value={amount}
            border={"none"}
            onChange={onChangeAmount}
          />
        </div>
        {/* <button
          className="flex items-center justify-center p-1 rounded cursor-pointer bg-RadioCheckColor"
          onClick={onMaxAmount}
        >
          <p className="text-sm text-PrimaryTextColor">{t("max")}</p>
        </button>
        <ExchangeIcon /> */}
      </div>
      {/* <div className="flex flex-row items-center justify-end gap-2 text-md whitespace-nowrap">
        <p className="opacity-60">{t("fee")}</p>
        <p>{}</p>
      </div> */}
    </>
  );

  function onChangeAmount(e: ChangeEvent<HTMLInputElement>) {
    const amount = e.target.value.trim();
    const isValid = Number(amount) > 0 && amount !== "";
    const isValidAmount = validateAmount(amount, Number(sender.asset.decimal || "8"));
    if (isValid && isValidAmount) setAmountAction(amount);
    // TODO: amount less that balance + fee
    // TODO: how validation error as bordered
  }

  function onMaxAmount() {
    // TODO: set as amount the balance - transaction fee
    // TODO: if it's allowance set the allowance amount - fee
    // TODO: if it's not allowance the the sub account balance - fee
    console.log("Search the max amout and set it");
  }
}

const sendBox = clsx(
  "flex",
  "flex-row",
  "w-full",
  "justify-between",
  "items-start",
  "rounded",
  "border",
  "p-3",
  "mb-4",
);

const accountInfo = clsx("flex", "flex-col", "justify-start", "items-start", "w-full", "pl-2", "pr-2");
