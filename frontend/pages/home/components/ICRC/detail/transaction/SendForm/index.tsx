import SenderItem from "./SenderItem";
import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
import ReceiverItem from "./ReceiverItem";
import {
  removeErrorAction,
  resetSendStateAction,
  setErrorAction,
  setIsInspectDetailAction,
  setIsLoadingAction,
  setTransactionDrawerAction,
} from "@redux/transaction/TransactionActions";
import { BasicButton } from "@components/button";
import useSend from "@pages/home/hooks/useSend";
import SenderAsset from "./SenderAsset";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@redux/Store";
import { TransactionDrawer, TransactionValidationErrorsEnum, transactionErrors } from "@/@types/transactions";
import { LoadingLoader } from "@components/loader";
import { toHoleBigInt } from "@/utils";

export default function SendForm() {
  const { t } = useTranslation();
  const { isLoading, errors, sender } = useAppSelector((state) => state.transaction);
  const { isSender, isReceiver, isSenderSameAsReceiver, isSenderAllowanceOwn, isSenderValid, isReceiverValid, getAllowanceAmount } =
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
        <BasicButton className="min-w-[5rem] mr-2 font-bold bg-secondary-color-2 text-md" onClick={onCancel}>
          {t("cancel")}
        </BasicButton>
        <BasicButton className="min-w-[5rem] font-bold bg-primary-color text-md" onClick={onNext}>
          {t("next")}
        </BasicButton>
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

      if (!isReceiver) return setErrorAction(TransactionValidationErrorsEnum.Values["error.receiver.empty"]);
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.receiver.empty"]);

      if (isSenderSameAsReceiver())
        return setErrorAction(TransactionValidationErrorsEnum.Values["error.same.sender.receiver"]);
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.same.sender.receiver"]);

      if (isSenderAllowanceOwn())
        return setErrorAction(TransactionValidationErrorsEnum.Values["error.own.sender.not.allowed"]);
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.own.sender.not.allowed"]);

      const allowanceGuaranteed = toHoleBigInt(await getAllowanceAmount(), Number(sender?.asset?.decimal));
      if (allowanceGuaranteed === BigInt(0)) {
        return setErrorAction(TransactionValidationErrorsEnum.Values["error.allowance.not.exist"]);
      }
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.allowance.not.exist"]);


      setIsInspectDetailAction(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAction(false);
    }
  }

  function onCancel() {
    setTransactionDrawerAction(TransactionDrawer.NONE);
    resetSendStateAction();
  }

  function getError() {
    if (!errors || !errors?.length) return "";
    const error = transactionErrors[errors[0]];
    if (error) return error;
    return "";
  }
}
