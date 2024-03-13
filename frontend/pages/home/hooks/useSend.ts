import { toFullDecimal } from "@/utils";
import { useAppSelector } from "@redux/Store";
import { useEffect, useMemo, useState } from "react";
import { getAllowanceDetails, getTransactionFeeFromLedger } from "../helpers/icrc/";
import { TransactionSenderOptionEnum } from "@/@types/transactions";
import { validatePrincipal } from "@/utils/identity";
import { isHexadecimalValid } from "@/utils/checkers";
import { Asset } from "@redux/models/AccountModels";

export default function useSend() {
  const [transactionFee, setTransactionFee] = useState<string>("0");
  const { userPrincipal } = useAppSelector((state) => state.auth);
  const { assets } = useAppSelector((state) => state.asset);
  const {
    sender,
    receiver,
    amount,
    sendingStatus,
    errors,
    initTime,
    endTime
  } = useAppSelector((state) => state.transaction);

  /**
   * Calculates the latest and updated asset information based on the selected asset in the transaction state.
   *
   * @returns {Asset} The matching asset object or undefined if not found.
   */
  const updateAsset = useMemo(
    () => assets.find((asset) => asset?.tokenSymbol === sender?.asset?.tokenSymbol),
    [assets, sender],
  ) as Asset;

  /**
   * Calculates the latest and updated sender sub-account information based on the selected sub-account in the transaction state.
   *
   * @returns {SubAccount | undefined} The matching sub-account object or undefined if not found.
   */
  const updateSubAccount = useMemo(
    () =>
      updateAsset?.subAccounts.find((subAccount) => subAccount?.sub_account_id === sender?.subAccount?.sub_account_id),
    [updateAsset, sender],
  );

  /**
   * Calculates the transaction fee formatted as a full decimal string.
   *
   * @returns {Promise<string>} A Promise that resolves to the transaction fee formatted as a full decimal string.
   */
  const getTransactionFee = async () => {
    let transactionFee = updateAsset?.subAccounts[0]?.transaction_fee || "0";
    const decimalPlaces = updateAsset?.decimal ?? 0;

    if (transactionFee == "0" && updateAsset?.address && decimalPlaces) {
      transactionFee = await getTransactionFeeFromLedger({
        assetAddress: updateAsset.address,
        assetDecimal: decimalPlaces,
      }) || "0";

      return transactionFee;
    }

    return toFullDecimal(transactionFee, Number(decimalPlaces));
  };

  // Sender
  /**
   * Determines and returns the principal identifier for the transaction sender.
   *
   * This function helps in identifying the correct principal associated with the transaction sender.
   *
   * @returns {string} The principal identifier for the transaction sender or an empty string.
   */
  function getSenderPrincipal() {
    if (sender?.newAllowanceContact?.principal) return sender?.newAllowanceContact?.principal;
    if (sender?.allowanceContactSubAccount?.contactPrincipal)
      return sender?.allowanceContactSubAccount?.contactPrincipal;
    if (sender?.subAccount?.sub_account_id) return userPrincipal.toText();
    return "";
  }

  /**
   * Determines and returns the sub-account identifier for the transaction sender.
   *
   * This function ensures that the transaction operation targets the appropriate sub-account based on the sender's setup.
   *
   * @param {TransactionState} sender - The current transaction state object.
   * @returns {string} The sub-account ID associated with the transaction sender or an empty string.
   */
  function getSenderSubAccount() {
    if (sender?.newAllowanceContact?.subAccountId) return sender?.newAllowanceContact?.subAccountId;
    if (sender?.allowanceContactSubAccount?.subAccountId) return sender?.allowanceContactSubAccount?.subAccountId;
    if (sender?.subAccount?.sub_account_id) return sender?.subAccount?.sub_account_id;
    return "";
  }


  /**
   * Validates the transaction sender configuration.
   * The function returns `true` if both principal and sub-account are valid, otherwise it returns `false`.
   * This function helps ensure that transactions are initiated from a valid sender with proper identification.
   *
   * @returns {boolean} `true` if the sender configuration is valid, `false` otherwise.
   */
  function getSenderValid(): boolean {
    const principal = getSenderPrincipal();
    if (!validatePrincipal(principal)) {
      return false;
    }

    const subaccount = getSenderSubAccount();
    return isHexadecimalValid(subaccount);
  }

  /**
   * Asynchronously retrieves the available balance for the transaction sender.
   * 
   * In case of errors during the allowance request, it logs the error and returns "0" as a fallback.
   *
   * This function ensures accurate balance representation for the transaction sender, considering different sender setups.
   *
   * @returns {Promise<string>} A Promise that resolves to the sender's balance, formatted as a string.
   */
  async function getSenderMaxAmount(): Promise<string> {
    try {
      if (sender?.senderOption === TransactionSenderOptionEnum.Values.own) {
        return toFullDecimal(updateSubAccount?.amount || "0", Number(updateAsset?.decimal));
      }

      const principal = getSenderPrincipal();
      const subAccount = getSenderSubAccount();
      const assetAddress = sender?.asset?.address;
      const decimal = sender?.asset?.decimal;

      const response = await getAllowanceDetails({
        spenderSubaccount: subAccount,
        accountPrincipal: principal,
        assetAddress,
        assetDecimal: decimal,
      });

      return response?.allowance || "0";
    } catch (error) {
      console.warn("Error fetching sender balance:", error);
      return "0";
    }
  }

  /**
   * Determines if the sender configuration utilizes an allowance.
   *
   * This function returns `true` if the sender's setup employs an allowance, otherwise it returns `false`.
   * It helps in identifying the type of sender configuration and its associated permissions.
   *
   * @returns {boolean} `true` if the sender uses an allowance, `false` otherwise.
   */
  function isSenderAllowance(): boolean {
    return sender?.senderOption === TransactionSenderOptionEnum.Values.allowance;
  }

  /**
   * Determines if the sender and receiver are the same entity.
   *
   * This function returns `true` if the sender and receiver share the same principal and sub-account, otherwise it returns `false`.
   * It helps in identifying the sender and receiver relationship and prevents self-transactions.
   *
   * @returns {boolean} `true` if the sender and receiver are the same, `false` otherwise.
   */
  function isSenderSameAsReceiver() {
    const senderPrincipal = getSenderPrincipal();
    const senderSubAccount = getSenderSubAccount();
    const receiverPrincipal = getReceiverPrincipal();
    const receiverSubAccount = getReceiverSubAccount();
    return senderPrincipal === receiverPrincipal && senderSubAccount === receiverSubAccount;
  }

  /**
   * Determines if the selected sender utilizes an allowance owned by the current account owner.
   * This function is only applicable when the sender configuration utilizes an allowance.
   * The function returns `true` if the sender is an allowance and the sender's principal matches the account owner's principal, indicating ownership. Otherwise, it returns `false`.
   * This function helps identify if a transaction involves an allowance owned by the user itself, which might have restrictions depending on your application logic.
   *
   * @returns {boolean} `true` if the sender uses an owned allowance, `false` otherwise.
   */
  function isSenderAllowanceOwn() {
    const senderPrincipal = getSenderPrincipal();
    const ownerPrincipal = userPrincipal.toText();
    const isAllowance = isSenderAllowance();
    return senderPrincipal === ownerPrincipal && isAllowance;
  }

  const isSender = useMemo(
    () => Boolean(getSenderPrincipal() && getSenderSubAccount() && sender?.asset?.tokenSymbol),
    [sender],
  );

  // Receiver
  /**
   * Determines and returns the principal identifier for the transaction receiver.
   *
   * This function helps in identifying the correct principal associated with the transaction receiver.
   *
   * @returns {string} The principal identifier for the transaction receiver or an empty string.
   */
  function getReceiverPrincipal() {
    if (receiver?.thirdContactSubAccount?.contactPrincipal) return receiver?.thirdContactSubAccount?.contactPrincipal;
    if (receiver?.thirdNewContact?.principal) return receiver?.thirdNewContact?.principal;
    if (receiver?.ownSubAccount?.sub_account_id) return userPrincipal.toText();
    return "";
  }


  /**
   * Determines and returns the sub-account identifier for the transaction receiver.
   *
   * This function ensures that the transaction operation targets the appropriate sub-account based on the receiver's setup.
   *
   * @returns {string} The sub-account ID associated with the transaction receiver or an empty string.
   */
  function getReceiverSubAccount() {
    if (receiver?.thirdContactSubAccount?.subAccountId) return receiver?.thirdContactSubAccount?.subAccountId;
    if (receiver?.thirdNewContact?.subAccountId) return receiver?.thirdNewContact?.subAccountId;
    if (receiver?.ownSubAccount?.sub_account_id) return receiver?.ownSubAccount?.sub_account_id;
    return "";
  }

  /**
   * Validates the transaction receiver configuration.
   *
   * The function returns `true` if both principal and sub-account are valid, otherwise it returns `false`.
   *
   * This function helps ensure that transactions are directed towards a valid receiver with proper identification.
   *
   * @returns {boolean} `true` if the receiver configuration is valid, `false` otherwise.
   */
  function getReceiverValid(): boolean {
    const principal = getReceiverPrincipal();
    if (!validatePrincipal(principal)) return false;

    const subaccount = getReceiverSubAccount();
    if (!isHexadecimalValid(subaccount)) return false;

    return true;
  }

  const isReceiver = useMemo(() => Boolean(getReceiverPrincipal() && getReceiverSubAccount()), [receiver]);

  /**
   * Determines if the selected receiver is the current account owner's own sub-account.
   *
   * This function compares the receiver's principal identifier with the current account owner's principal obtained from `userPrincipal.toText()`.
   *
   * It returns `true` if the receiver principal matches the owner's principal, indicating the receiver is the user's own sub-account. Otherwise, it returns `false`.
   *
   * This function can be helpful in specific scenarios where transactions to the user's own sub-account might require different handling.
   *
   * @returns {boolean} `true` if the receiver is the user's own sub-account, `false` otherwise.
   */
  function isReceiverOwn() {
    const receiverPrincipal = getReceiverPrincipal();
    const ownerPrincipal = userPrincipal.toText();
    return receiverPrincipal === ownerPrincipal;
  };


  /**
   * Calculates whether a transaction can be enabled based on sender, receiver, amount, and asset information.
   *
   * This hook utilizes `useMemo` to memoize the result based on changes in the `sender`, `receiver`, `amount`, and potentially `asset` state values.
   *
   * The function returns `true` if all conditions are met, indicating a valid transaction configuration for sending. Otherwise, it returns `false`.
   *
   * This memoized value can be used throughout the component to conditionally enable transaction actions or display informative messages to the user.
   *
   * @param {TransactionState} sender - The current transaction state object (includes sender information).
   * @param {TransactionState} receiver - The current transaction state object (includes receiver information).
   * @param {string} amount - The transaction amount as a string.
   * @returns {boolean} `true` if the transaction can be enabled, `false` otherwise.
   */
  const enableSend = useMemo(
    () =>
      Boolean(
        sender?.asset?.address &&
        sender?.asset?.decimal &&
        amount &&
        getSenderSubAccount() &&
        getSenderPrincipal() &&
        getReceiverPrincipal() &&
        getReceiverSubAccount(),
      ),
    [sender, receiver, amount],
  );

  useEffect(() => {
    (async () => {
      const fee = await getTransactionFee();
      console.log(fee)
      setTransactionFee(fee);
    })();
  }, [sender]);

  return {
    receiverPrincipal: getReceiverPrincipal(),
    receiverSubAccount: getReceiverSubAccount(),
    senderPrincipal: getSenderPrincipal(),
    senderSubAccount: getSenderSubAccount(),
    isSenderValid: getSenderValid(),
    isReceiverValid: getReceiverValid(),
    isReceiverOwnSubAccount: isReceiverOwn(),
    transactionFee,
    getSenderMaxAmount,
    isSenderAllowance,
    isSenderSameAsReceiver,
    isSenderAllowanceOwn,
    sender,
    amount,
    enableSend,
    isSender,
    isReceiver,
    sendingStatus,
    errors,
    initTime,
    endTime,
  };
}
