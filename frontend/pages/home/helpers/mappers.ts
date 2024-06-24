import {
  OperationStatusEnum,
  OperationTypeEnum,
  SpecialTxTypeEnum,
  TransactionType,
  TransactionTypeEnum,
} from "@/common/const";
import { Transaction, Operation, RosettaTransaction } from "@/redux/models/AccountModels";
import { subUint8ArrayToHex } from "@common/utils/unitArray";
import { Transaction as IcrcTransaction } from "@dfinity/ledger-icrc/dist/candid/icrc_index";
import { AccountIdentifier, SubAccount as SubAccountNNS } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import logger from "@/common/utils/logger";
import { Approve, Burn, Mint, Transfer } from "@candid/icrcLedger/icrcLedgerService";

export const MILI_PER_SECOND = 1000000;

export const formatIcpTransaccion = (
  accountId: string,
  rosettaTransaction: RosettaTransaction,
  blockHash: string,
): Transaction => {
  const {
    operations,
    metadata: { timestamp, block_height },
    transaction_identifier: { hash },
  } = rosettaTransaction;

  const transaction = { status: OperationStatusEnum.Enum.COMPLETED } as Transaction;
  operations?.forEach((operation: Operation, i: number) => {
    const value = BigInt(operation.amount.value);
    const amount = value.toString();
    if (operation.type === OperationTypeEnum.Enum.FEE) {
      transaction.fee = amount;
      return;
    }

    if (value > 0) {
      transaction.to = operation.account.address;
    } else if (value < 0) {
      transaction.from = operation.account.address;
    } else {
      if (i === 0) {
        transaction.from = operation.account.address;
      }
      if (i === 1) {
        transaction.to = operation.account.address;
      }
    }

    if (
      transaction.status === OperationStatusEnum.Enum.COMPLETED &&
      operation.status !== OperationStatusEnum.Enum.COMPLETED
    )
      transaction.status = operation.status;

    transaction.type = transaction.to === accountId ? TransactionTypeEnum.Enum.RECEIVE : TransactionTypeEnum.Enum.SEND;
    transaction.amount = amount;
    transaction.canisterId = import.meta.env.VITE_ICP_LEDGER_CANISTER_ID;
    transaction.idx = block_height.toString();
    transaction.symbol = operation.amount.currency.symbol;
  });

  return {
    ...transaction,
    hash: hash + "-" + blockHash,
    timestamp: Math.floor(timestamp / MILI_PER_SECOND),
  } as Transaction;
};

interface FormatBTCArgs {
  ckBTCTransaction: IcrcTransaction;
  id: bigint;
  principal: string;
  symbol: string;
  canister: string;
  subNumber?: string;
}

function mintMapper(mint: Mint[], initial: Transaction): Transaction {
  return mint.reduce((acc, current) => {
    const amount = current.amount.toString();
    const toOwner = current.to.owner;
    const toSubAccount = current.to.subaccount.length
      ? `0x${subUint8ArrayToHex((current.to.subaccount as [Uint8Array])[0])}`
      : "0x0";
    const from = "";
    const fromSub = "";

    let subaccTo: SubAccountNNS | undefined = undefined;
    try {
      subaccTo = SubAccountNNS.fromBytes((current.to.subaccount as [Uint8Array])[0]) as SubAccountNNS;
    } catch (error) {
      logger.debug("Error parsing subaccount", error);
      subaccTo = undefined;
    }

    const identityTo = AccountIdentifier.fromPrincipal({
      principal: current.to.owner as Principal,
      subAccount: subaccTo,
    }).toHex();

    const type = TransactionTypeEnum.Enum.RECEIVE;

    return {
      ...acc,
      amount,
      to: toOwner.toString(),
      toSub: toSubAccount,
      from,
      fromSub,
      identityTo,
      type,
    };
  }, initial);
}

function burnMapper(burn: Burn[], initial: Transaction): Transaction {
  return burn.reduce((acc, current) => {
    const amount = current.amount.toString();
    const fromOwner = current.from.owner;
    const fromSubAccount = current.from.subaccount.length
      ? `0x${subUint8ArrayToHex((current.from.subaccount as [Uint8Array])[0])}`
      : "0x0";
    const to = "";
    const toSub = "";

    let subaccFrom: SubAccountNNS | undefined = undefined;
    try {
      subaccFrom = SubAccountNNS.fromBytes((current.from.subaccount as [Uint8Array])[0]) as SubAccountNNS;
    } catch (error) {
      logger.debug("Error parsing subaccount", error);
      subaccFrom = undefined;
    }

    const identityFrom = AccountIdentifier.fromPrincipal({
      principal: current.from.owner as Principal,
      subAccount: subaccFrom,
    }).toHex();

    return {
      ...acc,
      amount,
      from: fromOwner.toString(),
      fromSub: fromSubAccount,
      to,
      toSub,
      identityFrom: identityFrom,
      type: TransactionTypeEnum.Enum.SEND,
    };
  }, initial);
}

function approveMapper(approve: Approve[], initial: Transaction): Transaction {
  return approve.reduce((acc, current) => {
    const amount = current.amount.toString();
    const fee = current.fee.toString();
    const from = current.from.owner.toString();
    const fromSubAccount = current.from.subaccount.length
      ? `0x${subUint8ArrayToHex((current.from.subaccount as [Uint8Array])[0])}`
      : "0x0";

    const to = current.spender.owner.toString();
    const toSubAccount = current.spender.subaccount.length
      ? `0x${subUint8ArrayToHex((current.spender.subaccount as [Uint8Array])[0])}`
      : "0x0";

    return {
      ...acc,
      amount,
      fee,
      from,
      fromSub: fromSubAccount,
      to,
      toSub: toSubAccount,
      type: TransactionTypeEnum.Enum.APPROVE,
    };
  }, initial);
}

interface MapperArgs {
  principal: string;
  subNumber: string | undefined;
}

function transferMapper(transfer: Transfer[], initial: Transaction, options: MapperArgs): Transaction {
  return transfer.reduce((acc, current) => {
    const amount = current.amount.toString();
    const toOwner = current.to.owner;
    const fromOwner = current.from.owner;
    const toSubAccount = current.to.subaccount.length
      ? `0x${subUint8ArrayToHex((current.to.subaccount as [Uint8Array])[0])}`
      : "0x0";

    const fromSubAccount = current.from.subaccount.length
      ? `0x${subUint8ArrayToHex((current.from.subaccount as [Uint8Array])[0])}`
      : "0x0";

    const subCheck = options.subNumber;

    let type: TransactionType = TransactionTypeEnum.Enum.RECEIVE;
    if (fromOwner.toString() === options.principal && fromSubAccount === subCheck) {
      type = TransactionTypeEnum.Enum.SEND;
    }

    let subaccTo: SubAccountNNS | undefined = undefined;
    try {
      if (current.to.subaccount.length) {
        subaccTo = SubAccountNNS.fromBytes((current.to.subaccount as [Uint8Array])[0]) as SubAccountNNS;
      } else {
        subaccTo = undefined;
      }
    } catch (error) {
      logger.debug("HERE 1: Error parsing subaccount", error);
      subaccTo = undefined;
    }

    const identityTo = AccountIdentifier.fromPrincipal({
      principal: current.to.owner as Principal,
      subAccount: subaccTo,
    }).toHex();

    // Get AccountIdentifier of Sender
    let subaccFrom: SubAccountNNS | undefined = undefined;
    try {
      if (current.to.subaccount.length) {
        subaccFrom = SubAccountNNS.fromBytes((current.to.subaccount as [Uint8Array])[0]) as SubAccountNNS;
      } else {
        subaccFrom = undefined;
      }
    } catch (error) {
      logger.debug("HERE 2: Error parsing subaccount", error);
      subaccFrom = undefined;
    }
    const identityFrom = AccountIdentifier.fromPrincipal({
      principal: current.from.owner as Principal,
      subAccount: subaccFrom,
    }).toHex();

    return {
      ...acc,
      amount,
      to: toOwner.toString(),
      toSub: toSubAccount,
      from: fromOwner.toString(),
      fromSub: fromSubAccount,
      identityTo,
      identityFrom,
      type,
    };
  }, initial);
}

export const formatckBTCTransaccion = (args: FormatBTCArgs): Transaction => {
  const { ckBTCTransaction, id, principal, symbol, canister, subNumber } = args;
  const { approve, burn, kind, mint, timestamp, transfer } = ckBTCTransaction;

  const initialTransaction: Transaction = {
    idx: id.toString(),
    from: "",
    fromSub: "",
    to: "",
    toSub: "",
    amount: "",
    canisterId: canister,
    status: OperationStatusEnum.Enum.COMPLETED,
    type: "NONE",
    symbol,
    identityTo: "",
    identityFrom: "",
    kind,
    hash: "",
    timestamp: Math.floor(Number(timestamp) / MILI_PER_SECOND),
    fee: "",
  };

  switch (kind) {
    case SpecialTxTypeEnum.Enum.mint:
      return mintMapper(mint, initialTransaction);
    case SpecialTxTypeEnum.Enum.burn:
      return burnMapper(burn, initialTransaction);
    case SpecialTxTypeEnum.Enum.approve:
      return approveMapper(approve, initialTransaction);
    case SpecialTxTypeEnum.Enum.transfer:
      return transferMapper(transfer, initialTransaction, { principal, subNumber });
    default:
      logger.debug(`formatckBTCTransaccion: unknown transaction type ${kind}`);
      return initialTransaction;
  }
};

export function chunkTransactions(options: { transactions: Transaction[]; chunkSize: number }) {
  const { transactions, chunkSize } = options;
  const transactionsChunks: Array<Transaction[]> = [];

  for (let i = 0; i < transactions.length; i += chunkSize) {
    const chunk = transactions.slice(i, i + chunkSize);
    transactionsChunks.push(chunk);
  }

  return transactionsChunks;
}

interface deChunkTransactionsParams {
  transactions: Array<Transaction[]>;
  chunkNumber: number;
  from: number;
}

export function deChunkTransactions(options: deChunkTransactionsParams): Transaction[] {
  const { transactions, chunkNumber, from } = options;
  const transactionsMerged: Transaction[] = [];

  if (transactions.length === 0) return [];
  if (transactions.length === 1) return transactions[0];

  if (chunkNumber <= 0 || from <= 0) {
    logger.debug("Error: chunkNumber and from must be positive integers.");
    return [];
  }

  if (chunkNumber > transactions.length) {
    logger.debug(`Error: chunkNumber ${chunkNumber} exceeds total chunks (${transactions.length}).`);
    return [];
  }

  const chunkIndex = chunkNumber - 1;
  const fromIndex = from - 1;

  if (fromIndex < 0 || fromIndex >= transactions[chunkIndex].length) {
    logger.debug(`Error: from index ${fromIndex} is invalid for chunk ${chunkNumber}.`);
    return [];
  }

  for (let index = fromIndex; index <= chunkIndex; index++) {
    transactionsMerged.push(...transactions[index]);
  }

  return transactionsMerged;
}
