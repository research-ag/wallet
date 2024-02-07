import SenderItem from "./SenderItem";
import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
import ReceiverItem from "./ReceiverItem";
import {
  removeErrorAction,
  resetSendStateAction,
  setErrorAction,
  setIsInspectDetailAction,
  setIsLoadingAction,
} from "@redux/transaction/TransactionActions";
import { Button } from "@components/button";
import useSend from "@pages/home/hooks/useSend";
import SenderAsset from "./SenderAsset";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@redux/Store";
import { ValidationErrorsEnum } from "@/@types/transactions";
import LoadingLoader from "@components/Loader";

interface SendFormProps {
  setDrawerOpen(value: boolean): void;
}

export default function SendForm({ setDrawerOpen }: SendFormProps) {
  const { t } = useTranslation();
  const { isLoading, errors, sender } = useAppSelector((state) => state.transaction);
  const { isSender, isReceiver, isSenderSameAsReceiver, isSenderAllowanceOwn, isSenderValid, isReceiverValid } =
    useSend();

  return (
    <div className={`w-full ${isLoading ? "opacity-50 pointer-events-none" : ""} `}>
      <SenderAsset />
      <SenderItem />
      <DownAmountIcon className="w-full mt-4" />
      <ReceiverItem />
      <div className="flex items-center justify-end mt-6">
        <p className="mr-4 text-sm text-slate-color-error">{t(getError())}</p>
        {isLoading && <LoadingLoader className="mr-4" />}
        <Button className="w-1/6 mr-2 font-bold bg-secondary-color-2" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button className="w-1/6 font-bold bg-primary-color" onClick={onNext}>
          {t("next")}
        </Button>
      </div>
    </div>
  );

  async function onNext() {
    try {
      setIsLoadingAction(true);

      if (!sender?.asset?.tokenSymbol) return setErrorAction(ValidationErrorsEnum.Values["error.asset.empty"]);
      removeErrorAction(ValidationErrorsEnum.Values["error.asset.empty"]);

      if (!isSenderValid) return setErrorAction(ValidationErrorsEnum.Values["error.invalid.sender"]);
      removeErrorAction(ValidationErrorsEnum.Values["error.invalid.sender"]);

      if (!isReceiverValid) return setErrorAction(ValidationErrorsEnum.Values["error.invalid.receiver"]);
      removeErrorAction(ValidationErrorsEnum.Values["error.invalid.receiver"]);

      if (!isSender) return setErrorAction(ValidationErrorsEnum.Values["error.sender.empty"]);
      removeErrorAction(ValidationErrorsEnum.Values["error.sender.empty"]);

      if (!isReceiver) setErrorAction(ValidationErrorsEnum.Values["error.receiver.empty"]);
      removeErrorAction(ValidationErrorsEnum.Values["error.receiver.empty"]);

      if (isSenderSameAsReceiver()) setErrorAction(ValidationErrorsEnum.Values["error.same.sender.receiver"]);
      removeErrorAction(ValidationErrorsEnum.Values["error.same.sender.receiver"]);

      if (isSenderAllowanceOwn()) setErrorAction(ValidationErrorsEnum.Values["error.own.sender.not.allowed"]);
      removeErrorAction(ValidationErrorsEnum.Values["error.own.sender.not.allowed"]);

      setIsInspectDetailAction(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAction(false);
    }
  }

  function onCancel() {
    setDrawerOpen(false);
    resetSendStateAction();
  }

  function getError() {
    switch (true) {
      case errors?.includes(ValidationErrorsEnum.Values["error.asset.empty"]):
        return ValidationErrorsEnum.Values["error.asset.empty"];
      case errors?.includes(ValidationErrorsEnum.Values["error.invalid.sender"]):
        return ValidationErrorsEnum.Values["error.invalid.sender"];
      case errors?.includes(ValidationErrorsEnum.Values["error.invalid.receiver"]):
        return ValidationErrorsEnum.Values["error.invalid.receiver"];
      case errors?.includes(ValidationErrorsEnum.Values["error.sender.empty"]):
        return ValidationErrorsEnum.Values["error.sender.empty"];
      case errors?.includes(ValidationErrorsEnum.Values["error.receiver.empty"]):
        return ValidationErrorsEnum.Values["error.receiver.empty"];
      case errors?.includes(ValidationErrorsEnum.Values["error.own.sender.not.allowed"]):
        return ValidationErrorsEnum.Values["error.own.sender.not.allowed"];
      case errors?.includes(ValidationErrorsEnum.Values["error.same.sender.receiver"]):
        return ValidationErrorsEnum.Values["error.same.sender.receiver"];
      default:
        return "";
    }
  }
}
