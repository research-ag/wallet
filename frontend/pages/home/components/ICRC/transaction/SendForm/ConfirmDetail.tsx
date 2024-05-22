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
import { SendingStatusEnum } from "@/common/const";
import { getSubAccountBalance, transferTokens, transferTokensFromAllowance } from "@/common/libs/icrc";
import { LoadingLoader } from "@components/loader";
import reloadBallance from "@pages/helpers/reloadBalance";
import { toHoleBigInt, validateAmount } from "@common/utils/amount";
import logger from "@/common/utils/logger";

interface ConfirmDetailProps {
  showConfirmationModal: Dispatch<SetStateAction<boolean>>;
}

export default function ConfirmDetail({ showConfirmationModal }: ConfirmDetailProps) {
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
    getAllowanceAmount,
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
        <BasicButton className="w-1/6 mr-2 font-bold bg-secondary-color-2" onClick={onBack}>
          {t("back")}
        </BasicButton>
        <BasicButton className="w-1/6 font-bold bg-primary-color" onClick={handleTransaction}>
          {t("submit")}
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

    if (bigintAmount > bigintMaxAmount || bigintSenderMaxAmountBalance === BigInt(0)) {
      setErrorAction(TransactionValidationErrorsEnum.Values["error.not.enough.balance"]);
      return false;
    }

    removeErrorAction(TransactionValidationErrorsEnum.Values["error.not.enough.balance"]);
    return true;
  }

  async function validateSubAccountBalance() {
    removeErrorAction(TransactionValidationErrorsEnum.Values["error.allowance.not.exist"]);
    removeErrorAction(TransactionValidationErrorsEnum.Values["error.allowance.not.enough"]);
    removeErrorAction(TransactionValidationErrorsEnum.Values["error.allowance.subaccount.not.enough"]);

    const balance = await getSubAccountBalance({
      assetAddress: sender?.asset?.address,
      assetDecimal: sender?.asset?.decimal,
      principal: senderPrincipal,
      subAccount: senderSubAccount,
    });

    const allowanceGuaranteed = toHoleBigInt(await getAllowanceAmount(), Number(sender?.asset?.decimal));

    const bigintFee = toHoleBigInt(transactionFee || "0", Number(sender?.asset?.decimal));
    const bigintAmount = toHoleBigInt(amount || "0", Number(sender?.asset?.decimal));

    // INFO: allowance guaranteed must cover the fee
    const isAllowanceCoveringFee = bigintAmount <= allowanceGuaranteed - bigintFee;
    // INFO: the allowance sub account balance must cover the amount and the fee
    const isAvailableAmountEnough = bigintAmount <= balance - bigintFee;

    if (allowanceGuaranteed === BigInt(0)) {
      setErrorAction(TransactionValidationErrorsEnum.Values["error.allowance.not.exist"]);
      throw new Error(TransactionValidationErrorsEnum.Values["error.allowance.not.exist"]);
    }

    if (allowanceGuaranteed < bigintAmount) {
      setErrorAction(TransactionValidationErrorsEnum.Values["error.allowance.not.enough"]);
      throw new Error(TransactionValidationErrorsEnum.Values["error.allowance.not.enough"]);
    }

    if (!isAllowanceCoveringFee || !isAvailableAmountEnough) {
      setErrorAction(TransactionValidationErrorsEnum.Values["error.allowance.subaccount.not.enough"]);
      throw new Error("error.allowance.subaccount.not.enough");
    }

    removeErrorAction(TransactionValidationErrorsEnum.Values["error.allowance.not.exist"]);
    removeErrorAction(TransactionValidationErrorsEnum.Values["error.allowance.not.enough"]);
    removeErrorAction(TransactionValidationErrorsEnum.Values["error.allowance.subaccount.not.enough"]);
  }

  async function handleTransaction() {
    try {
      setSendingStatusAction(SendingStatusEnum.Values.none);
      const assetAddress = sender.asset.address;
      const decimal = sender.asset.decimal;

      if (!amount || Number(amount) <= 0 || !validateAmount(amount || "", Number(decimal))) {
        setErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.amount"]);
        return;
      }
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.amount"]);

      setInitTxTime(new Date());
      // INFO: enabled verify all the fields were filled
      if (enableSend) {
        if (assetAddress && decimal && senderSubAccount && receiverPrincipal && receiverSubAccount && amount) {
          if (isSenderAllowance()) {
            await validateSubAccountBalance();

            setSendingStatusAction(SendingStatusEnum.Values.sending);
            showConfirmationModal(true);
            setIsLoadingAction(true);

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
            if (!isValid) return;
            setSendingStatusAction(SendingStatusEnum.Values.sending);
            showConfirmationModal(true);
            setIsLoadingAction(true);

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
      logger.debug("Error sending transaction", error);
      setSendingStatusAction(SendingStatusEnum.Values.error);
      setEndTxTime(new Date());
    } finally {
      await reloadBallance();
      setIsLoadingAction(false);
    }
  }

  function onBack() {
    setFullErrorsAction([]);
    setIsInspectDetailAction(false);
  }

  function getError() {
    switch (true) {
      case errors?.includes(TransactionValidationErrorsEnum.Values["error.not.enough.balance"]):
        return TransactionValidationErrorsEnum.Values["error.not.enough.balance"];

      case errors?.includes(TransactionValidationErrorsEnum.Values["error.allowance.not.exist"]):
        return TransactionValidationErrorsEnum.Values["error.allowance.not.exist"];

      case errors?.includes(TransactionValidationErrorsEnum.Values["error.allowance.not.enough"]):
        return TransactionValidationErrorsEnum.Values["error.allowance.not.enough"];

      case errors?.includes(TransactionValidationErrorsEnum.Values["error.allowance.subaccount.not.enough"]):
        return TransactionValidationErrorsEnum.Values["error.allowance.subaccount.not.enough"];
      default:
        return "";
    }
  }
}
