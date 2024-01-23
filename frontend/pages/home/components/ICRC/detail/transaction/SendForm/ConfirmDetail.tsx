import { ChangeEvent, useMemo, useTransition } from "react";
import { useAppSelector } from "@redux/Store";
import SubAccountContactBook from "./SubAccountContactBook";
import NewSender from "./NewSender";
import { ReactComponent as CheckIcon } from "@assets/svg/files/check.svg";
import { middleTruncation } from "@/utils/strings";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { ReactComponent as ExchangeIcon } from "@assets/svg/files/arrows-exchange-v.svg";
import { CustomInput } from "@components/Input";
import clsx from "clsx";
import { toFullDecimal, validateAmount } from "@/utils";
import { useTranslation } from "react-i18next";

export default function ConfirmDetail() {
  return (
    <div className="w-full px-[2rem] grid grid-cols-1 gap-y-2">
      {/* FROM */}
      <SenderDetail />
      {/* TO */}
      <ReceiverDetail />
      {/* AMOUNT */}
      <TransactionAmount />
    </div>
  );
}

function SenderDetail() {
  const { sender } = useAppSelector((state) => state.transaction);

  const isSubAccountOrContactBook = useMemo(() => {
    return Boolean(sender?.subAccount?.sub_account_id || sender?.allowanceContactSubAccount?.subAccountId);
  }, [sender]);

  return (
    <>
      <p className="font-bold opacity-50 text-md text-start">From</p>
      {isSubAccountOrContactBook ? <SubAccountContactBook /> : <NewSender />}
    </>
  );
}

function ReceiverDetail() {
  // TODO: if own sub account show account name and account id
  // TODO: if contact book, show contact name and sub account name, and ICRC account down.
  return (
    <>
      <p className="font-bold opacity-50 text-md text-start">To</p>
      <div className="relative flex px-3 py-2 border rounded-md border-slate-color-success bg-secondary-color-2">
        <CloseIcon className="absolute top-0 right-0 mt-1 mr-1 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor" />
        <div className="mr-2">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-color-success">
            <CheckIcon className="w-2.5 h-2.5" />
          </div>
        </div>
        <div className="text-start">
          <p className="text-md">0x6</p>
          <p className="opacity-50 text-md">
            {middleTruncation("3etep-celzb-5t4iw-swa7s-3yek6-g45iq-cuopt-6t3lp-phfdf-xh7va-gqe-7atwiha.1", 20, 20)}
          </p>
        </div>
      </div>
    </>
  );
}

function TransactionAmount() {
  const { sender } = useAppSelector((state) => state.transaction);
  const { t } = useTranslation();
  return (
    <>
      <p className="font-bold opacity-50 text-md text-start">Amount</p>
      <div className={clsx(sendBox, "border-BorderColorLight dark:border-BorderColor", "items-center", "!mb-1")}>
        <div className={clsx(accountInfo)} lang="en-US">
          <CustomInput
            intent={"primary"}
            placeholder={`0 ${sender?.asset?.tokenSymbol} `}
            value={"2000.33"}
            border={"none"}
            onChange={onChangeAmount}
          />
        </div>
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
        <p>3,3343</p>
      </div>
    </>
  );

  function onChangeAmount(e: ChangeEvent<HTMLInputElement>) {
    console.log("validate amount", e.target.value.trim());
  }
  function onMaxAmount() {
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
