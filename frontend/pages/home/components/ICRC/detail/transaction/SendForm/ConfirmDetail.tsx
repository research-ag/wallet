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
import { getSubAccountBalance, transferTokens, transferTokensFromAllowance } from "@pages/home/helpers/icrc";
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
        <Button className="w-1/6 font-bold bg-primary-color" onClick={handleTransaction}>
          {t("next")}
        </Button>
      </div>
    </div>
  );

  async function validateBalance() {
    const balance = await getSenderBalance();
    const maxAmount = Number(balance) - Number(transactionFee);

    if (!(Number(balance) >= maxAmount)) {
      setErrorAction(ValidationErrorsEnum.Values["error.not.enough.balance"]);
      return;
    }
    removeErrorAction(ValidationErrorsEnum.Values["error.not.enough.balance"]);
  }

  async function validateSubAccountBalance() {
    const subAccountBalance = await getSubAccountBalance({
      assetAddress: sender?.asset?.address,
      assetDecimal: sender?.asset?.decimal,
      principal: senderPrincipal,
      subAccount: senderSubAccount,
    });

    if (Number(subAccountBalance) < Number(amount)) {
      setErrorAction(ValidationErrorsEnum.Values["error.allowance.subaccount.not.enough"]);
      throw new Error("error.allowance.subaccount.not.enough");
    }
    removeErrorAction(ValidationErrorsEnum.Values["error.allowance.subaccount.not.enough"]);
  }

  async function handleTransaction() {
    try {
      setIsLoadingAction(true);
      const assetAddress = sender.asset.address;
      const decimal = sender.asset.decimal;

      if (enableSend && !errors?.length) {
        await validateBalance();

        if (assetAddress && decimal && senderSubAccount && receiverPrincipal && receiverSubAccount && amount) {
          setSendingStatusAction(SendingStatusEnum.Values.sending);
          showConfirmationModal(true);

          await validateSubAccountBalance();

          if (isSenderAllowance()) {
            await transferTokensFromAllowance({
              receiverPrincipal,
              senderPrincipal,
              assetAddress,
              transferAmount: amount,
              decimal,
              fromSubAccount: senderSubAccount,
              toSubAccount: receiverSubAccount,
              transactionFee,
            });
          } else {
            await transferTokens({
              receiverPrincipal,
              assetAddress,
              transferAmount: amount,
              decimal,
              fromSubAccount: senderSubAccount,
              toSubAccount: receiverSubAccount,
            });
          }
        }
        setSendingStatusAction(SendingStatusEnum.Values.done);
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
      case errors?.includes(ValidationErrorsEnum.Values["error.not.enough.balance"]):
        return ValidationErrorsEnum.Values["error.not.enough.balance"];
      default:
        return "";
    }
  }
}
