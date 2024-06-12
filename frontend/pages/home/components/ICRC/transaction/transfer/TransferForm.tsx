import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
//
import Receiver from "./Receiver";
import Sender from "./Sender";
import TransferAssetSelector from "./TransferAssetSelector";
import { useTranslation } from "react-i18next";
import { LoadingLoader } from "@components/loader";
import { BasicButton } from "@components/button";
import { useState } from "react";

export default function TransferForm() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="px-[1rem] pt-[1rem] space-y-[1rem]">
      <TransferAssetSelector />
      <Sender />
      <DownAmountIcon className="w-full mt-4" />
      <Receiver />


      <div className="flex items-center justify-end mt-6">
        <p className="mr-4 text-sm text-slate-color-error">
          {/* {t(getError())} */}
        </p>
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
    // try {
    //   setIsLoadingAction(true);

    //   if (!sender?.asset?.tokenSymbol)
    //     return setErrorAction(TransactionValidationErrorsEnum.Values["error.asset.empty"]);
    //   removeErrorAction(TransactionValidationErrorsEnum.Values["error.asset.empty"]);

    //   if (!isSenderValid) return setErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.sender"]);
    //   removeErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.sender"]);

    //   if (!isReceiverValid) return setErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.receiver"]);
    //   removeErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.receiver"]);

    //   if (!isSender) return setErrorAction(TransactionValidationErrorsEnum.Values["error.sender.empty"]);
    //   removeErrorAction(TransactionValidationErrorsEnum.Values["error.sender.empty"]);

    //   if (!isReceiver) return setErrorAction(TransactionValidationErrorsEnum.Values["error.receiver.empty"]);
    //   removeErrorAction(TransactionValidationErrorsEnum.Values["error.receiver.empty"]);

    //   if (isSenderSameAsReceiver())
    //     return setErrorAction(TransactionValidationErrorsEnum.Values["error.same.sender.receiver"]);
    //   removeErrorAction(TransactionValidationErrorsEnum.Values["error.same.sender.receiver"]);

    //   if (isSenderAllowanceOwn())
    //     return setErrorAction(TransactionValidationErrorsEnum.Values["error.own.sender.not.allowed"]);
    //   removeErrorAction(TransactionValidationErrorsEnum.Values["error.own.sender.not.allowed"]);

    //   if (isSenderAllowance()) {
    //     const allowanceGuaranteed = toHoleBigInt(await getAllowanceAmount(), Number(sender?.asset?.decimal));
    //     if (allowanceGuaranteed === BigInt(0)) {
    //       return setErrorAction(TransactionValidationErrorsEnum.Values["error.allowance.not.exist"]);
    //     }
    //     removeErrorAction(TransactionValidationErrorsEnum.Values["error.allowance.not.exist"]);
    //   }

    //   setIsInspectDetailAction(true);
    // } catch (error) {
    //   logger.debug(error);
    // } finally {
    //   setIsLoadingAction(false);
    // }
  }

  function onCancel() {
    // setTransactionDrawerAction(TransactionDrawer.NONE);
    // resetSendStateAction();
  }

  // function getError() {
  //   if (!errors || !errors?.length) return "";
  //   const error = transactionErrors[errors[0]];
  //   if (error) return error;
  //   return "";
  // }
}
