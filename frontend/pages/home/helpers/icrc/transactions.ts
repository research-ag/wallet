import { getIcrcActor } from "@/pages/home/helpers/icrc";
import {
  GetBalanceParams,
  TransactionFeeParams,
  TransferFromAllowanceParams,
  TransferTokensParams,
} from "@/@types/icrc";
import { getCanister } from "./getIcrcCanister";
import { hexToUint8Array, hexadecimalToUint8Array, toFullDecimal, toHoleBigInt } from "@/utils";
import { Principal } from "@dfinity/principal";
import { TransferFromParams } from "@dfinity/ledger-icrc";
import store from "@redux/Store";

export async function getTransactionFeeFromLedger(params: TransactionFeeParams) {
  try {
    const { assetAddress, assetDecimal } = params;

    const canister = getCanister(assetAddress);
    const result = await canister.transactionFee({});
    return toFullDecimal(result, Number(assetDecimal));
  } catch (error) {
    console.error(error);
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

  const canister = getCanister(assetAddress);

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
    console.error(error);
    return BigInt(0);
  }
}
