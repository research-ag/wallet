import { TransactionValidationErrorsEnum } from "@/@types/transactions";
import { toFullDecimal, toHoleBigInt, validateAmount } from "@/utils";
import { getSubAccountBalance } from "@pages/home/helpers/icrc";
import useSend from "@pages/home/hooks/useSend";
import { useAppSelector } from "@redux/Store";
import { removeErrorAction, setAmountAction, setErrorAction } from "@redux/transaction/TransactionActions";
import { ChangeEvent, useState } from "react";

interface MaxAmount {
  transactionAmount: string;
  transactionAmountWithoutFee: string;
  transactionFee: string;
  showAvailable: boolean;
  allowanceSubAccountBalance?: string;
  isLoading: boolean;
  isAmountFromMax: boolean;
}

const maxAmountInitialState: MaxAmount = {
  transactionAmount: "0",
  transactionAmountWithoutFee: "0",
  transactionFee: "0",
  showAvailable: false,
  // available amount less fee
  allowanceSubAccountBalance: "0",
  isLoading: false,
  isAmountFromMax: false,
};

export default function useTransactionAmount() {
  const [maxAmount, setMaxAmount] = useState<MaxAmount>(maxAmountInitialState);
  const { sender } = useAppSelector((state) => state.transaction);
  const { transactionFee, getSenderMaxAmount, isSenderAllowance, senderPrincipal, senderSubAccount } = useSend();

  function onChangeAmount(e: ChangeEvent<HTMLInputElement>) {
    const amount = e.target.value.trim();
    setAmountAction(amount);
    setMaxAmount(maxAmountInitialState);
    const isValidAmount = validateAmount(amount, Number(sender.asset.decimal));

    if (!isValidAmount || Number(amount) === 0) {
      setErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.amount"]);
      return;
    }

    removeErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.amount"]);
  }

  async function onMaxAmount() {
    try {
      setMaxAmount({ ...maxAmount, isLoading: true });
      // INFO: as allowance the fee is covered by the allowance sub account balance, not included in the allowance (probably)
      // INFO: both can be from sub account balance of from allowance
      let transactionAmount = "";
      let transactionAmountWithoutFee = "";

      if (isSenderAllowance()) {
        const params = {
          principal: senderPrincipal,
          subAccount: senderSubAccount,
          assetAddress: sender?.asset?.address,
        };

        // INFO: get the balance of the person's sub account who has given the allowance
        const allowanceBigintBalance = await getSubAccountBalance(params);
        const allowanceSubaccountBalance = toFullDecimal(allowanceBigintBalance, Number(sender?.asset?.decimal));

        // INFO: get the allowance amount guaranteed
        transactionAmount = await getSenderMaxAmount();

        // INFO: reduce the fee to the allowance amount
        const bigintFee = toHoleBigInt(transactionFee || "0", Number(sender?.asset?.decimal));
        const bigintTransactionAmount = toHoleBigInt(transactionAmount || "0", Number(sender?.asset?.decimal));

        if (bigintTransactionAmount + bigintFee > allowanceBigintBalance) {
          // INFO: allowance + fee is greater than the balance, show Max: 1.9 (available 0.1) where 1.9 is the allowance and 0.1 is the sub account balance

          const availableAmount =
            allowanceBigintBalance > bigintFee
              ? toFullDecimal(allowanceBigintBalance - bigintFee, Number(sender.asset.decimal))
              : "0";

          setMaxAmount({
            transactionAmount: toFullDecimal(bigintTransactionAmount - bigintFee, Number(sender.asset.decimal)),
            transactionAmountWithoutFee: transactionAmount,
            transactionFee: transactionFee || "0",
            showAvailable: true,
            allowanceSubAccountBalance: availableAmount,
            isLoading: false,
            isAmountFromMax: true,
          });
          setAmountAction(transactionAmount);
        } else {
          // INFO: allowance + fee is less than the balance, set Max: 1.9 where 1.9 is the allowance
          transactionAmountWithoutFee = toFullDecimal(bigintTransactionAmount, Number(sender?.asset?.decimal));

          setMaxAmount({
            transactionAmount,
            transactionAmountWithoutFee: transactionAmount,
            transactionFee: transactionFee || "0",
            showAvailable: allowanceBigintBalance < bigintTransactionAmount,
            allowanceSubAccountBalance: allowanceSubaccountBalance,
            isLoading: false,
            isAmountFromMax: true,
          });

          setAmountAction(transactionAmountWithoutFee);
        }
      } else {
        transactionAmount = await getSenderMaxAmount();

        // INFO: reduce the fee to the sub account balance
        const bigintFee = toHoleBigInt(transactionFee || "0", Number(sender?.asset?.decimal));
        const bigintTransactionAmount = toHoleBigInt(transactionAmount || "0", Number(sender?.asset?.decimal));

        // INFO: get the amount without the fee
        transactionAmountWithoutFee = toFullDecimal(
          bigintTransactionAmount - bigintFee,
          Number(sender?.asset?.decimal),
        );

        setMaxAmount({
          transactionAmount,
          transactionAmountWithoutFee,
          showAvailable: false,
          transactionFee: transactionFee || "0",
          isLoading: false,
          isAmountFromMax: true,
        });

        setAmountAction(transactionAmountWithoutFee);
      }
    } catch (error) {
      console.log(error);
      setMaxAmount(maxAmountInitialState);
    } finally {
      removeErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.amount"]);
    }
  }

  return { maxAmount, transactionFee, onChangeAmount, onMaxAmount };
}
