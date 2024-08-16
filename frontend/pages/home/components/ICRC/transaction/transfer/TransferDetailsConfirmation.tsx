import { BasicButton } from "@components/button";
import { TransferFromTypeEnum, TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import logger from "@/common/utils/logger";
import SenderDetails from "@/pages/home/components/ICRC/transaction/transfer/SenderDetail";
import ReceiverDetails from "@/pages/home/components/ICRC/transaction/transfer/ReceiverDetails";
import AmountDetails from "@/pages/home/components/ICRC/transaction/transfer/AmountDetails";
import { toHoleBigInt, validateAmount } from "@common/utils/amount";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { Principal } from "@dfinity/principal";
import { hexadecimalToUint8Array, hexToUint8Array } from "@common/utils/hexadecimal";
import ICRC1BalanceOf from "@common/libs/icrcledger/ICRC1BalanceOf";
import ICRC2Allowance from "@common/libs/icrcledger/ICRC2Allowance";
import ICRC1Tranfer from "@common/libs/icrcledger/ICRC1Tranfer";
import ICRC2TransferForm from "@common/libs/icrcledger/ICRC2TransferForm";
import ICRCXWithdraw from "@common/libs/icrcledger/ICRCXTransfer";
import { updateServiceAssetAmounts } from "@redux/services/ServiceReducer";
import { getElapsedSecond } from "@common/utils/datetimeFormaters";
import { TransferStatus, useTransferStatus } from "@pages/home/contexts/TransferStatusProvider";
import { TransferView, useTransferView } from "@pages/home/contexts/TransferViewProvider";
import { LoadingLoader } from "@components/loader";
import reloadBallance from "@pages/helpers/reloadBalance";

interface ErrorResult {
  isError: boolean;
  message: string;
}

export default function TransferDetailsConfirmation() {
  const { t } = useTranslation();
  const { transferState, setTransferState } = useTransfer();
  const { setView } = useTransferView();
  const { setStatus } = useTransferStatus();
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  //
  const { userAgent, userPrincipal, authClient } = useAppSelector((state) => state.auth);
  //
  const assets = useAppSelector((state) => state.asset.list.assets);
  const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol);
  //
  const services = useAppSelector((state) => state.services.services);
  const serviceReceiver = services.find((service) => service.principal === transferState.toPrincipal);
  const serviceReceiverAsset = serviceReceiver?.assets.find((asset) => asset.principal === currentAsset?.address);

  const serviceSender = services.find((service) => service.principal === transferState.fromPrincipal);
  const serviceSenderAsset = serviceSender?.assets.find((asset) => asset.principal === currentAsset?.address);
  //

  return (
    <div className="space-y-[1rem] mt-[3rem]">
      <SenderDetails />
      <ReceiverDetails />
      <AmountDetails />

      <div className="flex items-center justify-end mt-6 max-w-[23rem] mx-auto">
        {!isLoading && <p className="mr-4 text-md text-slate-color-error text-right">{errorMessage}</p>}
        {isLoading && <LoadingLoader />}

        <BasicButton className="w-1/6 mr-2 font-bold bg-secondary-color-2" onClick={onBack} disabled={isLoading}>
          {t("back")}
        </BasicButton>
        <BasicButton className="w-1/6 font-bold bg-primary-color" onClick={onTransfer} disabled={isLoading}>
          {t("submit")}
        </BasicButton>
      </div>
    </div>
  );

  function onBack() {
    setView(TransferView.SEND_FORM);
  }

  function onTransfer() {
    setErrorMessage("");

    if (transferState.amount === "") {
      setErrorMessage(t("error.transfer.invalid.amount"));
      throw new Error("onTransfer: Amount format is invalid");
    }

    const isAmountValid = validateAmount(transferState.amount, Number(currentAsset?.decimal || "8"));

    if (!isAmountValid) {
      setErrorMessage(t("error.transfer.invalid.decimal.amount"));
      throw new Error("onTransfer: Amount decial is invalid");
    }

    if (transferState.fromType === TransferFromTypeEnum.own) transferFromOwn();

    if (
      transferState.fromType === TransferFromTypeEnum.allowanceManual ||
      transferState.fromType === TransferFromTypeEnum.allowanceContactBook
    )
      transferFromAllowance();

    if (transferState.fromType === TransferFromTypeEnum.service) transferFromService();
  }

  // ------------------ ALLOWANCE ------------------

  async function validateAllowanceAmount(): Promise<ErrorResult> {
    try {
      if (!currentAsset) {
        return {
          isError: true,
          message: t("error.transfer.invalid.asset"),
        };
      }

      const fee = BigInt(currentAsset.subAccounts[0].transaction_fee);
      const amount = toHoleBigInt(transferState.amount, Number(currentAsset?.decimal || "8"));

      // allowance account balance
      const balance = await ICRC1BalanceOf({
        agent: userAgent,
        canisterId: Principal.fromText(currentAsset.address),
        owner: Principal.fromText(transferState.fromPrincipal),
        subaccount: [new Uint8Array(hexToUint8Array(transferState.fromSubAccount))],
      });

      // allowance amount assigned
      const allowance = await ICRC2Allowance({
        agent: userAgent,
        canisterId: Principal.fromText(currentAsset.address),
        account: {
          owner: Principal.fromText(transferState.fromPrincipal),
          subaccount: [new Uint8Array(hexToUint8Array(transferState.fromSubAccount))],
        },
        spender: {
          owner: userPrincipal,
          subaccount: [],
        },
      });
      const allowanceAmount = allowance.allowance;

      // case 1: allowance amount assigned === 0 (allowance not assigned or expired)
      if (allowanceAmount === BigInt(0)) {
        return {
          isError: true,
          message: t("error.transfer.allowance.not.exist.expired"),
        };
      }

      // case 2: user input amount + fee <= allowance account assigned (allowance is not enough)
      if (amount + fee > allowanceAmount) {
        return {
          isError: true,
          message: t("error.transfer.allowance.insufficient"),
        };
      }

      // case 3: user input amount + free <= allowance account balance (allowance sub account balance is not enough)
      if (amount + fee > balance) {
        return {
          isError: true,
          message: t("error.transfer.allowance.subaccount.balance.insufficient"),
        };
      }

      // case 4: (receiver service) user input amount => min deposit amount (more equal than or more than)
      if (transferState.toType === TransferToTypeEnum.thirdPartyService) {
        if (!serviceReceiverAsset) {
          return {
            isError: true,
            message: t("error.transfer.to.service.invalid"),
          };
        }

        const minDeposit = BigInt(serviceReceiverAsset.depositFee);
        if (amount <= minDeposit) {
          return {
            isError: true,
            message: t("error.transfer.amount.less.minimun.deposit"),
          };
        }
      }

      return { isError: false, message: "" };
    } catch (error) {
      logger.debug(error);
      return { isError: true, message: "" };
    }
  }

  async function transferFromAllowance() {
    const initTime = new Date();
    setIsLoading(true);
    setErrorMessage("");
    const validationResult = await validateAllowanceAmount();

    try {
      if (validationResult.isError) {
        setErrorMessage(validationResult.message);
        throw new Error(validationResult.message);
      }

      setIsLoading(false);
      setStatus(TransferStatus.SENDING);

      // INFO: at this point the asset information is valid
      await ICRC2TransferForm({
        agent: userAgent,
        canisterId: Principal.fromText(currentAsset?.address || ""),
        from: {
          owner: Principal.fromText(transferState.fromPrincipal),
          subaccount: [hexToUint8Array(transferState.fromSubAccount)],
        },
        to: {
          owner: Principal.fromText(transferState.toPrincipal),
          subaccount: [hexToUint8Array(transferState.toSubAccount)],
        },
        amount: toHoleBigInt(transferState.amount, Number(currentAsset?.decimal || "8")),
        fee: [],
        spender_subaccount: [],
        memo: [],
        created_at_time: [],
      });

      setStatus(TransferStatus.DONE);
    } catch (error) {
      logger.debug(error);
      setIsLoading(false);

      const isUserVisibleError = validationResult.message.length > 0 && validationResult.isError;
      if (!isUserVisibleError) setStatus(TransferStatus.ERROR);
    } finally {
      const endTime = new Date();
      const duration = getElapsedSecond(initTime, endTime);
      setTransferState((prev) => ({ ...prev, duration }));
      await reloadBallance();
    }
  }

  // ------------------ OWN SUB ACCOUNT ------------------

  async function validateOwnAmount(): Promise<ErrorResult> {
    try {
      // case 1: input user amount + fee <= own subaccount balance
      const currentSubAccount = currentAsset?.subAccounts.find(
        (subAccount) => subAccount.sub_account_id === transferState.fromSubAccount,
      );

      if (!currentSubAccount || !currentAsset) {
        return {
          isError: true,
          message: t("error.transfer.from.invalid"),
        };
      }

      // allowance account balance
      const balance = await ICRC1BalanceOf({
        agent: userAgent,
        canisterId: Principal.fromText(currentAsset.address),
        owner: Principal.fromText(transferState.fromPrincipal),
        subaccount: [new Uint8Array(hexToUint8Array(transferState.fromSubAccount))],
      });

      const fee = BigInt(currentSubAccount.transaction_fee);
      const amount = toHoleBigInt(transferState.amount, Number(currentAsset?.decimal || "8"));

      if (amount + fee > balance) {
        return {
          isError: true,
          message: t("error.transfer.from.no.enough.balance"),
        };
      }

      // case 3 (receiver service) if user input amount >= min deposit amount (more equal than or more than)
      if (transferState.toType === TransferToTypeEnum.thirdPartyService) {
        if (!serviceReceiverAsset) {
          return {
            isError: true,
            message: t("error.transfer.to.service.invalid"),
          };
        }

        const minDeposit = BigInt(serviceReceiverAsset.depositFee);
        const amount = toHoleBigInt(transferState.amount, Number(currentAsset?.decimal || "8"));

        if (amount <= minDeposit) {
          return {
            isError: true,
            message: t("error.transfer.amount.less.minimun.deposit"),
          };
        }
      }

      return { isError: false, message: "" };
    } catch (error) {
      logger.debug(error);
      return { isError: true, message: "" };
    }
  }

  async function transferFromOwn() {
    const initTime = new Date();
    setIsLoading(true);
    setErrorMessage("");
    const validationResult = await validateOwnAmount();

    try {
      if (validationResult.isError) {
        setErrorMessage(validationResult.message);
        throw new Error(validationResult.message);
      }

      setIsLoading(false);
      setStatus(TransferStatus.SENDING);

      // INFO: at this point the asset information is valid
      await ICRC1Tranfer({
        canisterId: Principal.fromText(currentAsset?.address || ""),
        agent: userAgent,
        from_subaccount: hexadecimalToUint8Array(transferState.fromSubAccount),
        to: {
          owner: Principal.fromText(transferState.toPrincipal),
          subaccount: [hexToUint8Array(transferState.toSubAccount)],
        },
        amount: toHoleBigInt(transferState.amount, Number(currentAsset?.decimal || "8")),
        fee: [],
        memo: [],
        created_at_time: [],
      });

      setStatus(TransferStatus.DONE);
    } catch (error) {
      logger.debug(error);
      setIsLoading(false);

      const isUserVisibleError = validationResult.message.length > 0 && validationResult.isError;
      if (!isUserVisibleError) setStatus(TransferStatus.ERROR);
    } finally {
      const endTime = new Date();
      const duration = getElapsedSecond(initTime, endTime);
      setTransferState((prev) => ({ ...prev, duration }));
      await reloadBallance();
    }
  }

  // ------------------ SERVICE ------------------

  async function validateServiceAmount(): Promise<ErrorResult> {
    // case 1: if user input amount >= min withdraw amount (more equal than or more than)
    if (!serviceSenderAsset) {
      return { isError: true, message: t("error.transfer.from.service.invalid") };
    }

    const minWithdraw = BigInt(serviceSenderAsset.withdrawFee);
    const amount = toHoleBigInt(transferState.amount, Number(currentAsset?.decimal || "8"));
    const max = BigInt(serviceSenderAsset.credit);

    if (amount <= minWithdraw) {
      return { isError: true, message: t("error.transfer.amount.less.minimun.withdrawl") };
    }

    if (amount > max) {
      return {
        isError: true,
        message: t("error.transfer.from.no.enough.balance"),
      };
    }

    return { isError: false, message: "" };
  }

  async function transferFromService() {
    const initTime = new Date();

    setIsLoading(true);
    setErrorMessage("");
    const validationResult = await validateServiceAmount();

    try {
      if (validationResult.isError) {
        setErrorMessage(validationResult.message);
        throw new Error(validationResult.message);
      }

      setIsLoading(false);
      setStatus(TransferStatus.SENDING);

      const res = (await ICRCXWithdraw({
        agent: userAgent,
        canisterId: Principal.fromText(transferState.fromPrincipal),
        token: Principal.fromText(currentAsset?.address || ""),
        amount: toHoleBigInt(transferState.amount, Number(currentAsset?.decimal || "8")),
        to: { owner: Principal.fromText(authClient), subaccount: [hexToUint8Array(transferState.toSubAccount)] },
        expected_fee: [],
      })) as any;

      if (res.data) {
        dispatch(
          updateServiceAssetAmounts(
            transferState.fromPrincipal,
            currentAsset?.address || "",
            res.data.credit,
            res.data.balance,
          ),
        );
        setStatus(TransferStatus.DONE);
        reloadBallance();
      } else if (res.err) {
        logger.debug(res.err);
        setIsLoading(false);
        const isUserVisibleError = validationResult.message.length > 0 && validationResult.isError;
        if (!isUserVisibleError) setStatus(TransferStatus.ERROR);
      }
    } catch (error) {
      logger.debug(error);
      setIsLoading(false);
      const isUserVisibleError = validationResult.message.length > 0 && validationResult.isError;
      if (!isUserVisibleError) setStatus(TransferStatus.ERROR);
    } finally {
      const endTime = new Date();
      const duration = getElapsedSecond(initTime, endTime);
      setTransferState((prev) => ({ ...prev, duration }));
    }
  }
}
