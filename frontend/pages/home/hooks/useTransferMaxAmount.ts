import { ChangeEvent, useState } from "react";
import { TransferFromTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import { useAppSelector } from "@redux/Store";
import logger from "@/common/utils/logger";
import { getTokenFromUSD, getUSDFromToken, toFullDecimal, toHoleBigInt } from "@common/utils/amount";
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
  const markets = useAppSelector((state) => state.asset.utilData.tokensMarket);
  const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol);
  const currentMarket = markets.find((asset) => asset.symbol === transferState.tokenSymbol);

  async function onMaxAmount(noMax?: boolean) {
    const isManualAllowance = transferState.fromType === TransferFromTypeEnum.allowanceManual;
    const isContactAllowance = transferState.fromType === TransferFromTypeEnum.allowanceContactBook;
    //
    if (isManualAllowance || isContactAllowance) await fromAllowanceMaxAmount(noMax);
    if (transferState.fromType === TransferFromTypeEnum.own) fromOwnBalanceMaxAmount(noMax);
    if (transferState.fromType === TransferFromTypeEnum.service) fromServiceMaxAmount(noMax);
  }

  function fromOwnBalanceMaxAmount(noMax?: boolean) {
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
        displayAvailable: false,
        isLoading: false,
        isAmountFromMax: !noMax,
      });
      !noMax && setTransferState((prev) => ({ ...prev, amount: "0", usdAmount: "0" }));
      // max: 0, available: balance
      return;
    }

    setMaxAmount({
      maxAmount: toFullDecimal(balance - fee, Number(currentAsset.decimal)),
      availableAmount: toFullDecimal(balance, Number(currentAsset.decimal)),
      displayAvailable: false,
      isLoading: false,
      isAmountFromMax: !noMax,
    });
    const amount1 = toFullDecimal(balance - fee, Number(currentAsset.decimal));
    const bigintAmount1 = toHoleBigInt(amount1, Number(currentAsset?.decimal || "8"));
    const usdAmount1 = currentMarket
      ? getUSDFromToken(bigintAmount1.toString(), currentMarket.price, currentAsset.decimal || 8)
      : "";
    !noMax &&
      setTransferState((prev) => ({
        ...prev,
        amount: amount1,
        usdAmount: usdAmount1,
      }));
    // max: balance - fee, available: balance
  }

  async function fromAllowanceMaxAmount(noMax?: boolean) {
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
      if (allowanceAmount <= fee) {
        setMaxAmount({
          maxAmount: "0",
          availableAmount: "0",
          displayAvailable: false,
          isLoading: false,
          isAmountFromMax: !noMax,
        });
        !noMax &&
          setTransferState((prev) => ({
            ...prev,
            amount: "0",
            usdAmount: "0",
          }));
        // max: 0, available: (balance)
        return;
      }

      // INFO: The total allowance (allowance include the fee) can be covered by the balance
      setMaxAmount({
        maxAmount: toFullDecimal(allowanceAmount - fee, Number(currentAsset?.decimal || "8")),
        availableAmount: "0",
        displayAvailable: false,
        isLoading: false,
        isAmountFromMax: !noMax,
      });
      const amount2 = toFullDecimal(allowanceAmount - fee, Number(currentAsset?.decimal || "8"));
      const bigintAmount2 = toHoleBigInt(amount2, Number(currentAsset?.decimal || "8"));
      const usdAmount2 = currentMarket
        ? getUSDFromToken(bigintAmount2.toString(), currentMarket.price, currentAsset.decimal || 8)
        : "";
      !noMax &&
        setTransferState((prev) => ({
          ...prev,
          amount: toFullDecimal(allowanceAmount - fee, Number(currentAsset?.decimal || "8")),
          usdAmount: usdAmount2,
        }));
      // max: (allowance - fee), available: 0 (not shown)
      return;
    } else {
      // INFO: The total allowance can not be covered by the balance
      if (balance <= fee) {
        setMaxAmount({
          maxAmount: "0",
          availableAmount: toFullDecimal(balance, Number(currentAsset?.decimal || "8")),
          displayAvailable: true,
          isLoading: false,
          isAmountFromMax: !noMax,
        });
        !noMax &&
          setTransferState((prev) => ({
            ...prev,
            amount: "0",
            usdAmount: "0",
          }));
        // max: 0, available: (balance)
        return;
      }

      if (allowanceAmount <= fee) {
        setMaxAmount({
          maxAmount: "0",
          availableAmount: "0",
          displayAvailable: false,
          isLoading: false,
          isAmountFromMax: !noMax,
        });
        !noMax &&
          setTransferState((prev) => ({
            ...prev,
            amount: "0",
            usdAmount: "0",
          }));

        // max: 0, available: (balance)
        return;
      }

      setMaxAmount({
        maxAmount: toFullDecimal(balance - fee, Number(currentAsset?.decimal || "8")),
        availableAmount: toFullDecimal(balance, Number(currentAsset?.decimal || "8")),
        displayAvailable: true,
        isLoading: false,
        isAmountFromMax: !noMax,
      });
      const amount3 = toFullDecimal(balance - fee, Number(currentAsset?.decimal || "8"));
      const bigintAmount3 = toHoleBigInt(amount3, Number(currentAsset?.decimal || "8"));
      const usdAmount3 = currentMarket
        ? getUSDFromToken(bigintAmount3.toString(), currentMarket.price, currentAsset.decimal || 8)
        : "";
      !noMax &&
        setTransferState((prev) => ({
          ...prev,
          amount: toFullDecimal(balance - fee, Number(currentAsset?.decimal || "8")),
          usdAmount: usdAmount3,
        }));
      // max: balance - fee, available: balance
    }
  }

  function fromServiceMaxAmount(noMax?: boolean) {
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
    const minWithdraw = BigInt(asset?.withdrawFee || "0");

    if (balance <= minWithdraw) {
      setMaxAmount({
        maxAmount: "0",
        availableAmount: toFullDecimal(balance, Number(currentAsset?.decimal || "8")),
        displayAvailable: false,
        isLoading: false,
        isAmountFromMax: !noMax,
      });
      !noMax &&
        setTransferState((prev) => ({
          ...prev,
          amount: "0",
        }));
      // max: 0, available: balance
      return;
    }

    setMaxAmount({
      maxAmount: toFullDecimal(balance, Number(currentAsset?.decimal || "8")),
      availableAmount: toFullDecimal(balance, Number(currentAsset?.decimal || "8")),
      displayAvailable: false,
      isLoading: false,
      isAmountFromMax: !noMax,
    });
    !noMax &&
      setTransferState((prev) => ({
        ...prev,
        amount: toFullDecimal(balance, Number(currentAsset?.decimal || "8")),
      }));
  }

  function onChangeAmount(e: ChangeEvent<HTMLInputElement>) {
    const amount = e.target.value.trim().replace(/[^0-9.]/g, "");
    setMaxAmount((prev) => ({ ...prev, isAmountFromMax: false }));
    if (currentMarket && currentAsset) {
      if (amount.trim() === "") setTransferState({ ...transferState, amount, usdAmount: "" });
      else if (Number(amount) === 0) setTransferState({ ...transferState, amount, usdAmount: "0" });
      else {
        const bigintAmount = toHoleBigInt(amount, Number(currentAsset?.decimal || "8"));
        const usdAmount = getUSDFromToken(bigintAmount.toString(), currentMarket.price, currentAsset.decimal || 8);
        setTransferState({ ...transferState, amount, usdAmount });
      }
    } else {
      setTransferState({ ...transferState, amount });
    }
  }

  function onChangeUSDAmount(e: ChangeEvent<HTMLInputElement>) {
    const usdAmount = e.target.value.trim().replace(/[^0-9.]/g, "");
    setMaxAmount((prev) => ({ ...prev, isAmountFromMax: false }));
    if (currentAsset && currentMarket) {
      if (usdAmount.trim() === "") setTransferState({ ...transferState, amount: "", usdAmount });
      if (Number(usdAmount) === 0) setTransferState({ ...transferState, amount: "0", usdAmount });
      else {
        const amount = getTokenFromUSD(usdAmount, currentMarket.price, currentAsset.decimal || 8);
        setTransferState({ ...transferState, usdAmount, amount });
      }
    }
  }

  return { maxAmount, onMaxAmount, setMaxAmount, onChangeAmount, onChangeUSDAmount };
}
