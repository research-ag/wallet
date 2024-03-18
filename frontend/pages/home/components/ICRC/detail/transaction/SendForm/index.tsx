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
import Button from "@components/button/Button";
import useSend from "@pages/home/hooks/useSend";
import SenderAsset from "./SenderAsset";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@redux/Store";
import { TransactionValidationErrorsEnum, transactionErrors } from "@/@types/transactions";
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
        <Button className="min-w-[5rem] mr-2 font-bold bg-secondary-color-2 text-md" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button className="min-w-[5rem] font-bold bg-primary-color text-md" onClick={onNext}>
          {t("next")}
        </Button>
      </div>
    </div>
  );

  async function onNext() {
    try {
      setIsLoadingAction(true);

      if (!sender?.asset?.tokenSymbol)
        return setErrorAction(TransactionValidationErrorsEnum.Values["error.asset.empty"]);
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.asset.empty"]);

      if (!isSenderValid) return setErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.sender"]);
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.sender"]);

      if (!isReceiverValid) return setErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.receiver"]);
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.receiver"]);

      if (!isSender) return setErrorAction(TransactionValidationErrorsEnum.Values["error.sender.empty"]);
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.sender.empty"]);

      if (!isReceiver) setErrorAction(TransactionValidationErrorsEnum.Values["error.receiver.empty"]);
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.receiver.empty"]);

      if (isSenderSameAsReceiver())
        setErrorAction(TransactionValidationErrorsEnum.Values["error.same.sender.receiver"]);
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.same.sender.receiver"]);

      if (isSenderAllowanceOwn())
        setErrorAction(TransactionValidationErrorsEnum.Values["error.own.sender.not.allowed"]);
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.own.sender.not.allowed"]);

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
    if (!errors || !errors?.length) return "";
    const error = transactionErrors[errors[0]];
    if (error) return error;
    return "";
  }
}
