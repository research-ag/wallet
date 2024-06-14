import { BasicButton } from "@components/button";
import { TransferFromTypeEnum, TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import logger from "@/common/utils/logger";
import SenderDetails from "./SenderDetail";
import ReceiverDetails from "./ReceiverDetails";
import AmountDetails from "./AmountDetails";
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
import reloadBallance from "@pages/helpers/reloadBalance";

export default function TransferDetailsConfirmation() {
  const { t } = useTranslation();
  const { transferState, setTransferState } = useTransfer();
  const { setView } = useTransferView();
  const { setStatus } = useTransferStatus();
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();
  //
  const { userAgent, userPrincipal } = useAppSelector((state) => state.auth);
  //
  const assets = useAppSelector((state) => state.asset.list.assets);
  const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol);
  //
  const services = useAppSelector((state) => state.services.services);
  const serviceReceiver = services.find((service) => service.principal === transferState.toPrincipal);
  const serviceReceiverAsset = serviceReceiver?.assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol);

  const serviceSender = services.find((service) => service.principal === transferState.fromPrincipal);
  const serviceSenderAsset = serviceSender?.assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol);
  //

  return (
    <div className="space-y-[1rem] mt-[3rem]">
      <SenderDetails />
      <ReceiverDetails />
      <AmountDetails />

      <div className="flex items-center justify-end mt-6 max-w-[23rem] mx-auto">
        <p className="mr-4 text-md text-slate-color-error">{errorMessage}</p>
        <BasicButton className="w-1/6 mr-2 font-bold bg-secondary-color-2" onClick={onBack}>
          {t("back")}
        </BasicButton>
        <BasicButton className="w-1/6 font-bold bg-primary-color" onClick={onTransfer}>
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

    const isAmountValid = validateAmount(transferState.amount, Number(currentAsset?.decimal || "8"));
    if (transferState.amount === "" && !isAmountValid) {
      setErrorMessage("Invalid amount");
      throw new Error("onTransfer: Amount format is invalid");
    }

    if (transferState.fromType === TransferFromTypeEnum.own) transferFromOwn();

    if (
      transferState.fromType === TransferFromTypeEnum.allowanceManual ||
      transferState.fromType === TransferFromTypeEnum.allowanceContactBook
    )
      transferFromAllowance();

    if (transferState.fromType === TransferFromTypeEnum.service) transferFromService();
  }

  async function validateAllowanceAmount() {
    if (!currentAsset) {
      setErrorMessage("Invalid asset");
      throw new Error("validateAllowanceAmount: Asset not found");
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
      setErrorMessage("Allowance not assigned or expired");
      throw new Error("validateAllowanceAmount: Allowance not assigned or expired");
    }

    // case 2: user input amount + fee <= allowance account assigned (allowance is not enough)
    if (amount + fee > allowanceAmount) {
      setErrorMessage("Insufficient allowance");
      throw new Error("validateAllowanceAmount: Insufficient allowance");
    }

    // case 3: user input amount + free <= allowance account balance (allowance sub account balance is not enough)
    if (amount + fee > balance) {
      setErrorMessage("Insufficient balance");
      throw new Error("validateAllowanceAmount: Insufficient balance");
    }

    // case 4: (receiver service) user input amount => min deposit amount (more equal than or more than)
    if (transferState.toType === TransferToTypeEnum.thirdPartyService) {
      if (!serviceReceiverAsset) {
        setErrorMessage("TO service is not valid");
        throw new Error("validateAllowanceAmount: Receiver service not found");
      }

      const minDeposit = BigInt(serviceReceiverAsset.minDeposit);
      if (amount < minDeposit) {
        setErrorMessage("Amount is less than min deposit");
        throw new Error("validateAllowanceAmount: Amount is less than min deposit");
      }
    }
  }

  async function transferFromAllowance() {
    const initTime = new Date();
    try {
      setErrorMessage("");
      await validateAllowanceAmount();
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
      setStatus(TransferStatus.ERROR);
    } finally {
      const endTime = new Date();
      const duration = getElapsedSecond(initTime, endTime);
      setTransferState((prev) => ({ ...prev, duration }));
    }
  }

  async function validateOwnAmount() {
    // case 1: input user amount + fee <= own subaccount balance
    const currentSubAccount = currentAsset?.subAccounts.find(
      (subAccount) => subAccount.sub_account_id === transferState.fromSubAccount,
    );
    if (!currentSubAccount) {
      setErrorMessage("Invalid FROM sub account");
      throw new Error("validateOwnAmount: Sub account not found");
    }

    const balance = BigInt(currentSubAccount.amount);
    const fee = BigInt(currentSubAccount.transaction_fee);
    const amount = toHoleBigInt(transferState.amount, Number(currentAsset?.decimal || "8"));

    if (amount + fee > balance) {
      setErrorMessage("Insufficient balance");
      throw new Error("validateOwnAmount: Insufficient balance");
    }

    // case 3 (receiver service) if user input amount >= min deposit amount (more equal than or more than)
    if (transferState.toType === TransferToTypeEnum.thirdPartyService) {
      if (!serviceReceiverAsset) {
        setErrorMessage("TO service is not valid");
        throw new Error("validateOwnAmount: Receiver service not found");
      }

      const minDeposit = BigInt(serviceReceiverAsset.minDeposit);
      const amount = toHoleBigInt(transferState.amount, Number(currentAsset?.decimal || "8"));

      if (amount < minDeposit) {
        setErrorMessage("Amount is less than min deposit");
        throw new Error("validateOwnAmount: Amount is less than min deposit");
      }
    }
  }

  async function transferFromOwn() {
    const initTime = new Date();
    try {
      await validateOwnAmount();

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
      setStatus(TransferStatus.ERROR);
    } finally {
      const endTime = new Date();
      const duration = getElapsedSecond(initTime, endTime);
      setTransferState((prev) => ({ ...prev, duration }));
      await reloadBallance();
    }
  }

  async function validateServiceAmount() {
    // case 1: if user input amount >= min withdraw amount (more equal than or more than)
    if (!serviceSenderAsset) {
      setErrorMessage("FROM service is not valid");
      throw new Error("validateServiceAmount: Sender service not found");
    }

    const minWithdraw = BigInt(serviceSenderAsset.minWithdraw);
    const amount = toHoleBigInt(transferState.amount, Number(currentAsset?.decimal || "8"));
    if (amount < minWithdraw) {
      setErrorMessage("Amount is less than min withdraw");
      throw new Error("validateServiceAmount: Amount is less than min withdraw");
    }
  }

  async function transferFromService() {
    const initTime = new Date();
    try {
      setErrorMessage("");
      await validateServiceAmount();

      setStatus(TransferStatus.SENDING);

      const res = await ICRCXWithdraw({
        agent: userAgent,
        canisterId: Principal.fromText(transferState.fromPrincipal),
        token: Principal.fromText(currentAsset?.address || ""),
        amount: toHoleBigInt(transferState.amount, Number(currentAsset?.decimal || "8")),
        to_subaccount: [hexToUint8Array(transferState.toSubAccount)],
      });

      if (res.data) {
        dispatch(
          updateServiceAssetAmounts(
            transferState.fromPrincipal,
            currentAsset?.address || "",
            res.data.credit,
            res.data.balance,
          ),
        );
      }

      setStatus(TransferStatus.DONE);
    } catch (error) {
      logger.debug(error);
      setStatus(TransferStatus.ERROR);
    } finally {
      const endTime = new Date();
      const duration = getElapsedSecond(initTime, endTime);
      setTransferState((prev) => ({ ...prev, duration }));
    }
  }
}
