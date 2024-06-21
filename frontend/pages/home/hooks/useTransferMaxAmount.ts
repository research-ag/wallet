import { ChangeEvent, useState } from "react";
import { TransferFromTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import { useAppSelector } from "@redux/Store";
import logger from "@/common/utils/logger";
import { toFullDecimal } from "@common/utils/amount";
import ICRC1BalanceOf from "@common/libs/icrcledger/ICRC1BalanceOf";
import { Principal } from "@dfinity/principal";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import ICRC2Allowance from "@common/libs/icrcledger/ICRC2Allowance";

interface MaxAmount {
  maxAmount: string;
  availableAmount: string;
  displayAvailable: boolean;
  isLoading: boolean;
  isAmountFromMax: boolean;
}

export default function useTransferMaxAmount() {
  const { transferState, setTransferState } = useTransfer();

  const [maxAmount, setMaxAmount] = useState<MaxAmount>({
    maxAmount: "0",
    availableAmount: "0",
    displayAvailable: false,
    isLoading: false,
    isAmountFromMax: false,
  });

  const { userAgent, userPrincipal } = useAppSelector((state) => state.auth);
  const services = useAppSelector((state) => state.services.services);

  const assets = useAppSelector((state) => state.asset.list.assets);
  const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol);

  async function onMaxAmount() {
    const isManualAllowance = transferState.fromType === TransferFromTypeEnum.allowanceManual;
    const isContactAllowance = transferState.fromType === TransferFromTypeEnum.allowanceContactBook;
    //
    if (isManualAllowance || isContactAllowance) await fromAllowanceMaxAmount();
    if (transferState.fromType === TransferFromTypeEnum.own) fromOwnBalanceMaxAmount();
    if (transferState.fromType === TransferFromTypeEnum.service) fromServiceMaxAmount();
  }

  function fromOwnBalanceMaxAmount() {
    if (!currentAsset) {
      logger.debug("current asset not found");
      return;
    }

    const subaccount = currentAsset.subAccounts.find(
      (subAccount) => subAccount.sub_account_id === transferState.fromSubAccount,
    );

    if (!subaccount) {
      logger.debug("subaccount not found");
      return;
    }

    const balance = BigInt(subaccount.amount);
    const fee = BigInt(currentAsset.subAccounts[0].transaction_fee);

    if (balance < fee) {
      setMaxAmount({
        maxAmount: "0",
        availableAmount: toFullDecimal(balance, Number(currentAsset.decimal)),
        displayAvailable: true,
        isLoading: false,
        isAmountFromMax: true,
      });
      setTransferState((prev) => ({ ...prev, amount: "0" }));
      // max: 0, available: balance
      return;
    }

    setMaxAmount({
      maxAmount: toFullDecimal(balance - fee, Number(currentAsset.decimal)),
      availableAmount: toFullDecimal(balance, Number(currentAsset.decimal)),
      displayAvailable: true,
      isLoading: false,
      isAmountFromMax: true,
    });
    setTransferState((prev) => ({
      ...prev,
      amount: toFullDecimal(balance - fee, Number(currentAsset.decimal)),
    }));
    // max: balance - fee, available: balance
  }

  async function fromAllowanceMaxAmount() {
    if (!currentAsset) {
      logger.debug("current asset not found");
      return;
    }

    const fee = BigInt(currentAsset.subAccounts[0].transaction_fee);

    const balance = await ICRC1BalanceOf({
      agent: userAgent,
      canisterId: Principal.fromText(currentAsset.address),
      owner: Principal.fromText(transferState.fromPrincipal),
      subaccount: [new Uint8Array(hexToUint8Array(transferState.fromSubAccount))],
    });

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

    if (balance >= allowanceAmount) {
      // INFO: The total allowance (allowance include the fee) can be covered by the balance
      setMaxAmount({
        maxAmount: toFullDecimal(allowanceAmount - fee, Number(currentAsset?.decimal || "8")),
        availableAmount: "0",
        displayAvailable: false,
        isLoading: false,
        isAmountFromMax: true,
      });
      setTransferState((prev) => ({
        ...prev,
        amount: toFullDecimal(allowanceAmount - fee, Number(currentAsset?.decimal || "8")),
      }));
      // max: (allowance - fee), available: 0 (not shown)
      return;
    } else {
      // INFO: The total allowance can not be covered by the balance
      if (balance < fee) {
        setMaxAmount({
          maxAmount: "0",
          availableAmount: toFullDecimal(balance, Number(currentAsset?.decimal || "8")),
          displayAvailable: true,
          isLoading: false,
          isAmountFromMax: true,
        });
        setTransferState((prev) => ({
          ...prev,
          amount: "0",
        }));
        // max: 0, available: (balance)
        return;
      }

      if (allowanceAmount < fee) {
        setMaxAmount({
          maxAmount: "0",
          availableAmount: toFullDecimal(balance, Number(currentAsset?.decimal || "8")),
          displayAvailable: true,
          isLoading: false,
          isAmountFromMax: true,
        });
        setTransferState((prev) => ({
          ...prev,
          amount: "0",
        }));
        // max: 0, available: (balance)
        return;
      }

      setMaxAmount({
        maxAmount: toFullDecimal(balance - fee, Number(currentAsset?.decimal || "8")),
        availableAmount: toFullDecimal(balance, Number(currentAsset?.decimal || "8")),
        displayAvailable: true,
        isLoading: false,
        isAmountFromMax: true,
      });
      setTransferState((prev) => ({
        ...prev,
        amount: toFullDecimal(balance - fee, Number(currentAsset?.decimal || "8")),
      }));
      // max: balance - fee, available: balance
    }
  }

  function fromServiceMaxAmount() {
    const service = services.find((srv) => srv.principal === transferState.fromPrincipal);

    if (!service) {
      logger.debug("service not found");
      return;
    }

    const asset = service.assets.find((ast) => ast.tokenSymbol === transferState.tokenSymbol);
    if (!asset) {
      logger.debug("asset not found");
      return;
    }

    const balance = BigInt(asset.credit);
    const fee = BigInt(currentAsset?.subAccounts[0].transaction_fee || "0");

    if (balance < fee) {
      setMaxAmount({
        maxAmount: "0",
        availableAmount: toFullDecimal(balance, Number(currentAsset?.decimal || "8")),
        displayAvailable: true,
        isLoading: false,
        isAmountFromMax: true,
      });
      setTransferState((prev) => ({
        ...prev,
        amount: "0",
      }));
      // max: 0, available: balance
      return;
    }

    setMaxAmount({
      maxAmount: toFullDecimal(balance - fee, Number(currentAsset?.decimal || "8")),
      availableAmount: toFullDecimal(balance, Number(currentAsset?.decimal || "8")),
      displayAvailable: true,
      isLoading: false,
      isAmountFromMax: true,
    });
    setTransferState((prev) => ({
      ...prev,
      amount: toFullDecimal(balance - fee, Number(currentAsset?.decimal || "8")),
    }));
  }

  function onChangeAmount(e: ChangeEvent<HTMLInputElement>) {
    const amount = e.target.value.trim().replace(/[^0-9.]/g, "");
    setMaxAmount((prev) => ({ ...prev, isAmountFromMax: false }));
    setTransferState({ ...transferState, amount });
  }

  return { maxAmount, onMaxAmount, setMaxAmount, onChangeAmount };
}
