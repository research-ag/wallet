import SenderItem from "./SenderItem";
import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
import ReceiverItem from "./ReceiverItem";
import {
  removeErrorAction,
  resetSendStateAction,
  setErrorAction,
  setIsInspectDetailAction,
} from "@redux/transaction/TransactionActions";
import { Button } from "@components/button";
import useSend from "@pages/home/hooks/useSend";
import SenderAsset from "./SenderAsset";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@redux/Store";
import { ValidationErrorsEnum } from "@/@types/transactions";

interface SendFormProps {
  setDrawerOpen(value: boolean): void;
}

export default function SendForm({ setDrawerOpen }: SendFormProps) {
  const { t } = useTranslation();
  const { errors } = useAppSelector((state) => state.transaction);
  const { isSender, isReceiver, getSenderBalance, transactionFee, isSenderSameAsReceiver, isSenderAllowanceOwn } =
    useSend();

  return (
    <div className="w-full">
      <SenderAsset />
      <SenderItem />
      <DownAmountIcon className="w-full mt-4" />
      <ReceiverItem />
      <div className="flex items-center justify-end mt-6">
        <p className="mr-4 text-slate-color-error">{t(getError())}</p>
        <Button className="w-1/6 mr-2 font-bold bg-secondary-color-2" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button className="w-1/6 font-bold bg-primary-color" disabled={!(isReceiver && isSender)} onClick={onNext}>
          {t("next")}
        </Button>
      </div>
    </div>
  );

  async function onNext() {
    try {
      const balance = await getSenderBalance();
      const isBalanceEnough = Number(balance || 0) - Number(transactionFee) > 0;

      if (isSenderSameAsReceiver()) {
        setErrorAction(ValidationErrorsEnum.Values["invalid.same.receiver.sender"]);
        return;
      }

      if (!isReceiver) {
        setErrorAction(ValidationErrorsEnum.Values["invalid.receiver"]);
        return;
      }

      if (!isSender) {
        setErrorAction(ValidationErrorsEnum.Values["invalid.sender"]);
        return;
      }

      if (isSenderAllowanceOwn()) {
        setErrorAction(ValidationErrorsEnum.Values["own.sender.not.allowed"]);
        return;
      }

      if (!isBalanceEnough) {
        setErrorAction(ValidationErrorsEnum.Values["not.enough.balance"]);
        return;
      }

      removeErrorAction(ValidationErrorsEnum.Values["not.enough.balance"]);
      removeErrorAction(ValidationErrorsEnum.Values["invalid.receiver"]);
      removeErrorAction(ValidationErrorsEnum.Values["invalid.sender"]);
      removeErrorAction(ValidationErrorsEnum.Values["invalid.same.receiver.sender"]);
      removeErrorAction(ValidationErrorsEnum.Values["own.sender.not.allowed"]);
      setIsInspectDetailAction(true);
    } catch (error) {
      console.error(error);
    }
  }

  function onCancel() {
    setDrawerOpen(false);
    resetSendStateAction();
  }

  function getError() {
    switch (true) {
      case errors?.includes(ValidationErrorsEnum.Values["invalid.same.receiver.sender"]):
        return ValidationErrorsEnum.Values["invalid.same.receiver.sender"];
      case errors?.includes(ValidationErrorsEnum.Values["invalid.receiver"]):
        return ValidationErrorsEnum.Values["invalid.receiver"];
      case errors?.includes(ValidationErrorsEnum.Values["invalid.sender"]):
        return ValidationErrorsEnum.Values["invalid.sender"];
      case errors?.includes(ValidationErrorsEnum.Values["own.sender.not.allowed"]):
        return ValidationErrorsEnum.Values["own.sender.not.allowed"];
      case errors?.includes(ValidationErrorsEnum.Values["not.enough.balance"]):
        return ValidationErrorsEnum.Values["not.enough.balance"];
      default:
        return "";
    }
  }
}
