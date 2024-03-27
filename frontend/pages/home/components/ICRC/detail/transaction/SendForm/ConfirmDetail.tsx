import { BasicButton } from "@components/button";
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
  setInitTxTime,
  setEndTxTime,
  setFullErrorsAction,
} from "@redux/transaction/TransactionActions";
import { useTranslation } from "react-i18next";
import { TransactionValidationErrorsEnum } from "@/@types/transactions";
import { SendingStatusEnum } from "@/const";
import { AssetHook } from "@pages/home/hooks/assetHook";
import { getSubAccountBalance, transferTokens, transferTokensFromAllowance } from "@pages/home/helpers/icrc";
import { LoadingLoader } from "@components/loader";
import { toHoleBigInt } from "@/utils";

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
    getSenderMaxAmount,
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
        {isLoading && <LoadingLoader color="dark:border-secondary-color-1-light border-black-color mr-2" />}
        <BasicButton className="w-1/6 mr-2 font-bold bg-secondary-color-2" onClick={OnBack}>
          {t("back")}
        </BasicButton>
        <BasicButton className="w-1/6 font-bold bg-primary-color" onClick={handleTransaction}>
          {t("next")}
        </BasicButton>
      </div>
    </div>
  );

  async function validateBalance() {
    const senderMaxAmount = await getSenderMaxAmount();
    const bigintSenderMaxAmountBalance = toHoleBigInt(senderMaxAmount || "0", Number(sender?.asset?.decimal));
    const bigintFee = toHoleBigInt(transactionFee || "0", Number(sender?.asset?.decimal));
    const bigintAmount = toHoleBigInt(amount || "0", Number(sender?.asset?.decimal));

    const bigintMaxAmount = bigintSenderMaxAmountBalance - bigintFee;

    if (bigintAmount > bigintMaxAmount) {
      setErrorAction(TransactionValidationErrorsEnum.Values["error.not.enough.balance"]);
      return false;
    }

    removeErrorAction(TransactionValidationErrorsEnum.Values["error.not.enough.balance"]);
    return true;
  }

  async function validateSubAccountBalance() {
    const balance = await getSubAccountBalance({
      assetAddress: sender?.asset?.address,
      assetDecimal: sender?.asset?.decimal,
      principal: senderPrincipal,
      subAccount: senderSubAccount,
    });

    const allowanceGuaranteed = toHoleBigInt(
      await getSenderMaxAmount(),
      Number(sender?.asset?.decimal)
    );

    const bigintFee = toHoleBigInt(transactionFee || "0", Number(sender?.asset?.decimal));
    const bigintAmount = toHoleBigInt(amount || "0", Number(sender?.asset?.decimal));

    // INFO: allowance guaranteed must cover the fee
    const isAllowanceCoveringFee = bigintAmount <= allowanceGuaranteed - bigintFee;
    // INFO: the allowance sub account balance must cover the amount and the fee
    const isAvailableAmountEnough = bigintAmount <= (balance - bigintFee);

    if (!isAllowanceCoveringFee || !isAvailableAmountEnough) {
      setErrorAction(TransactionValidationErrorsEnum.Values["error.allowance.subaccount.not.enough"]);
      throw new Error("error.allowance.subaccount.not.enough");
    }
    removeErrorAction(TransactionValidationErrorsEnum.Values["error.allowance.subaccount.not.enough"]);
  }

  async function handleTransaction() {
    try {
      setInitTxTime(new Date());
      setIsLoadingAction(true);
      const assetAddress = sender.asset.address;
      const decimal = sender.asset.decimal;

      if (!amount || Number(amount) <= 0) {
        setErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.amount"]);
        return;
      }
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.amount"]);

      if (enableSend && !errors?.length) {

        if (assetAddress && decimal && senderSubAccount && receiverPrincipal && receiverSubAccount && amount) {
          setSendingStatusAction(SendingStatusEnum.Values.sending);
          showConfirmationModal(true);


          if (isSenderAllowance()) {
            await validateSubAccountBalance();
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

            const isValid = await validateBalance();
            if (!isValid) {
              setIsLoadingAction(false);
              return;
            }

            await transferTokens({
              receiverPrincipal,
              assetAddress,
              transferAmount: amount,
              decimal,
              fromSubAccount: senderSubAccount,
              toSubAccount: receiverSubAccount,
            });
          }

          setSendingStatusAction(SendingStatusEnum.Values.done);
          setEndTxTime(new Date());
        }
      }
    } catch (error) {
      setSendingStatusAction(SendingStatusEnum.Values.error);
      setEndTxTime(new Date());
    } finally {
      reloadBallance();
      setIsLoadingAction(false);
    }
  }

  function OnBack() {
    setFullErrorsAction([]);
    setIsInspectDetailAction(false);
  }

  function getError() {
    switch (true) {
      case errors?.includes(TransactionValidationErrorsEnum.Values["error.not.enough.balance"]):
        return TransactionValidationErrorsEnum.Values["error.not.enough.balance"];
      default:
        return "";
    }
  }
}
