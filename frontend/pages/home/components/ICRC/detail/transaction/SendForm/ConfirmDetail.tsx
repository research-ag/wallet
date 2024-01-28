import { Button } from "@components/button";
import SenderDetail from "./SenderDetail";
import ReceiverDetail from "./ReceiverDetail";
import TransactionAmount from "./TransactionAmount";
import { useAppSelector } from "@redux/Store";
import { Dispatch, SetStateAction } from "react";
import useSend from "@pages/home/hooks/useSend";
import {
  removeErrorAction,
  setErrorAction,
  setIsInspectDetailAction,
  setIsLoadingAction,
  setSendingStatusAction,
} from "@redux/transaction/TransactionActions";
import { useTranslation } from "react-i18next";
import { ValidationErrorsEnum } from "@/@types/transactions";
import { SendingStatusEnum } from "@/const";
import { AssetHook } from "@pages/home/hooks/assetHook";
import { transferAmount, transferFromAllowance } from "@pages/home/helpers/icrc";
import LoadingLoader from "@components/Loader";

interface ConfirmDetailProps {
  showConfirmationModal: Dispatch<SetStateAction<boolean>>;
}

export default function ConfirmDetail({ showConfirmationModal }: ConfirmDetailProps) {
  const { reloadBallance } = AssetHook();
  const { t } = useTranslation();
  const { sender, errors, isLoading } = useAppSelector((state) => state.transaction);
  const {
    receiverPrincipal,
    receiverSubAccount,
    senderSubAccount,
    amount,
    enableSend,
    transactionFee,
    getSenderBalance,
    isSenderAllowance,
    senderPrincipal,
  } = useSend();

  return (
    <div className={`grid w-full grid-cols-1 gap-y-2 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
      <SenderDetail />
      <ReceiverDetail />
      <TransactionAmount />
      <div className="flex items-center justify-end mt-6">
        <p className="mr-4 text-md text-slate-color-error">{t(getError())}</p>
        {isLoading && <LoadingLoader className="mr-4" />}
        <Button className="w-1/6 mr-2 font-bold bg-secondary-color-2" onClick={OnBack}>
          {t("back")}
        </Button>
        <Button className="w-1/6 font-bold bg-primary-color" onClick={onDone} disabled={!enableSend}>
          {t("next")}
        </Button>
      </div>
    </div>
  );

  async function onDone() {
    try {
      setIsLoadingAction(true);
      const assetAddress = sender.asset.address;
      const decimal = sender.asset.decimal;

      if (enableSend) {
        const balance = await getSenderBalance();
        const maxAmount = Number(balance) - Number(transactionFee);

        if (!(Number(balance) >= maxAmount)) {
          setErrorAction(ValidationErrorsEnum.Values["not.enough.balance"]);
          return;
        }
        removeErrorAction(ValidationErrorsEnum.Values["not.enough.balance"]);

        if (assetAddress && decimal && senderSubAccount && receiverPrincipal && receiverSubAccount && amount) {
          setSendingStatusAction(SendingStatusEnum.Values.sending);
          // showConfirmationModal(true);

          console.log("transactionFee", transactionFee);

          if (isSenderAllowance()) {
            await transferFromAllowance({
              receiverPrincipal,
              senderPrincipal,
              assetAddress,
              transferAmount: amount,
              decimal,
              fromSubAccount: senderSubAccount,
              toSubAccount: receiverSubAccount,
              transactionFee,
            });
            // console.log("Sending allowance");
          } else {
            await transferAmount({
              receiverPrincipal,
              assetAddress,
              transferAmount: amount,
              decimal,
              fromSubAccount: senderSubAccount,
              toSubAccount: receiverSubAccount,
            });
            // console.log("Sending no allowance");
          }
          // setSendingStatusAction(SendingStatusEnum.Values.done);
        }
      }
    } catch (error) {
      setSendingStatusAction(SendingStatusEnum.Values.error);
    } finally {
      reloadBallance();
      setIsLoadingAction(false);
    }
  }

  function OnBack() {
    setIsInspectDetailAction(false);
  }

  function getError() {
    switch (true) {
      case errors?.includes(ValidationErrorsEnum.Values["not.enough.balance"]):
        return ValidationErrorsEnum.Values["not.enough.balance"];
      default:
        return "";
    }
  }
}
