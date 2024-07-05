import {
  GetBalanceParams,
  TransactionFeeParams,
  TransferFromAllowanceParams,
  TransferTokensParams,
  SupportedStandard,
} from "@/@types/icrc";
import { Principal } from "@dfinity/principal";
import { IcrcLedgerCanister, TransferFromParams } from "@dfinity/ledger-icrc";
import store from "@redux/Store";
import { Asset } from "@redux/models/AccountModels";
import { AccountDefaultEnum } from "@/common/const";
import { hexadecimalToUint8Array, hexToUint8Array } from "@common/utils/hexadecimal";
import { getUSDFromToken, toFullDecimal, toHoleBigInt } from "@common/utils/amount";
import { getMetadataInfo } from "@common/utils/icrc";
import logger from "@common/utils/logger";
import { getCanister } from "./getIcrcCanister";
import { getIcrcActor } from "./getIcrcActor";
import { getICRCSupportedStandards } from "./getICRCSupportedStandards";

export async function getTransactionFeeFromLedger(params: TransactionFeeParams) {
  try {
    const { assetAddress, assetDecimal } = params;

    const canister = getCanister({ assetAddress });
    const result = await canister.transactionFee({});
    return toFullDecimal(result, Number(assetDecimal));
  } catch (error) {
    logger.debug(error);
  }
}

export async function transferTokens(params: TransferTokensParams) {
  const { receiverPrincipal, transferAmount, assetAddress, decimal, fromSubAccount, toSubAccount } = params;
  const amount = toHoleBigInt(transferAmount, Number(decimal));
  const agent = store.getState().auth.userAgent;

  const ledgerActor = getIcrcActor({
    agent,
    assetAddress,
  });

  await ledgerActor.icrc1_transfer({
    to: {
      owner: Principal.fromText(receiverPrincipal),
      subaccount: [hexToUint8Array(toSubAccount)],
    },
    amount,
    from_subaccount: hexadecimalToUint8Array(fromSubAccount),
    fee: [],
    memo: [],
    created_at_time: [],
  });
}

export async function transferTokensFromAllowance(params: TransferFromAllowanceParams) {
  const { receiverPrincipal, senderPrincipal, assetAddress, transferAmount, decimal, toSubAccount, fromSubAccount } =
    params;

  const canister = getCanister({ assetAddress });

  const transferParams: TransferFromParams = {
    from: {
      owner: Principal.fromText(senderPrincipal),
      subaccount: [hexToUint8Array(fromSubAccount)],
    },
    to: {
      owner: Principal.fromText(receiverPrincipal),
      subaccount: [hexToUint8Array(toSubAccount)],
    },
    amount: toHoleBigInt(transferAmount, Number(decimal)),
  };

  await canister.transferFrom(transferParams);
}

export async function getSubAccountBalance(params: GetBalanceParams) {
  try {
    const { principal, subAccount, assetAddress } = params;
    const sessionPrincipal = store.getState().auth.userPrincipal;
    const agent = store.getState().auth.userAgent;

    const ledgerActor = getIcrcActor({
      agent,
      assetAddress,
    });

    const balance = await ledgerActor.icrc1_balance_of({
      owner: principal ? Principal.fromText(principal) : sessionPrincipal,
      subaccount: [hexToUint8Array(subAccount)],
    });
    return balance;
  } catch (error) {
    logger.debug(error);
    return BigInt(0);
  }
}

interface DetailsParams {
  canisterId: Principal | string;
  includeDefault: boolean;
  customSymbol?: string;
  customName?: string;
  sortIndex?: number;
  supportedStandard?: SupportedStandard[];
  ledgerIndex?: string;
}
/**
 * Get asset details from the ledger (supported standards, symbol, name, logo, balance and usd amount)
 */
export async function getAssetDetails(params: DetailsParams): Promise<Asset | undefined> {
  try {
    const { canisterId, customSymbol, customName, sortIndex, supportedStandard: standard, ledgerIndex } = params;

    const { metadata } = IcrcLedgerCanister.create({
      agent: store.getState().auth.userAgent,
      canisterId: typeof canisterId === "string" ? Principal.fromText(canisterId) : canisterId,
    });

    const myMetadata = await metadata({
      certified: false,
    });

    let supportedStandards: SupportedStandard[] = [];

    if (!standard) {
      supportedStandards = await getICRCSupportedStandards({
        assetAddress: canisterId.toString(),
        agent: store.getState().auth.userAgent,
      });
    } else {
      supportedStandards = standard;
    }

    const { symbol, decimals, name, logo, fee } = getMetadataInfo(myMetadata);

    const balance = await getSubAccountBalance({
      assetAddress: canisterId.toString(),
      subAccount: "0x0",
    });

    const assetMarket = store.getState().asset.utilData.tokensMarket.find((token) => token.symbol === symbol);

    let USDAmount = "0";

    if (assetMarket) {
      USDAmount = getUSDFromToken(balance.toString(), assetMarket.price, decimals);
    }

    const asset: Asset = {
      sortIndex: sortIndex || 999,
      address: canisterId.toString(),
      index: ledgerIndex || "",
      tokenSymbol: symbol,
      tokenName: name,
      symbol: customSymbol || symbol,
      name: customName || name,
      logo,
      decimal: decimals.toFixed(0),
      shortDecimal: decimals.toFixed(0),
      supportedStandards,
      subAccounts: [
        {
          sub_account_id: "0x0",
          name: AccountDefaultEnum.Values.Default,
          amount: balance.toString(),
          currency_amount: USDAmount,
          address: "",
          decimal: decimals,
          symbol,
          transaction_fee: fee,
        },
      ],
    };

    return asset;
  } catch (error) {
    logger.debug(error);
  }
}
