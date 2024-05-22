import { OperationStatusEnum, OperationTypeEnum, SpecialTxTypeEnum, TransactionTypeEnum } from "@/common/const";
import { Transaction, Operation, RosettaTransaction } from "@/redux/models/AccountModels";
import { subUint8ArrayToHex } from "@common/utils/unitArray";
import { Account, Transaction as IcrcTransaction } from "@dfinity/ledger-icrc/dist/candid/icrc_index";
import { AccountIdentifier, SubAccount as SubAccountNNS } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import logger from "@/common/utils/logger";

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

export const formatckBTCTransaccion = (
  ckBTCTransaction: IcrcTransaction,
  id: bigint,
  principal: string,
  symbol: string,
  canister: string,
  subNumber?: string,
): Transaction => {
  const { timestamp, transfer, mint, burn, kind } = ckBTCTransaction;
  const trans = { status: OperationStatusEnum.Enum.COMPLETED, kind: kind } as Transaction;
  // Check Tx type ["transfer", "mint", "burn"]
  if (kind === SpecialTxTypeEnum.Enum.mint)
    mint.forEach(
      (operation: {
        to: Account;
        memo: [] | [Uint8Array | number[]];
        created_at_time: [] | [bigint];
        amount: bigint;
      }) => {
        // Get Tx data from Mint record
        const value = operation.amount;
        const amount = value.toString();
        trans.to = (operation.to.owner as Principal).toString();
        if (operation.to.subaccount.length > 0)
          trans.toSub = `0x${subUint8ArrayToHex((operation.to.subaccount as [Uint8Array])[0])}`;
        else trans.toSub = "0x0";
        trans.from = "";
        trans.fromSub = "";
        trans.canisterId = canister;
        trans.symbol = symbol;
        trans.amount = amount;

        // Get AccountIdentifier of Receiver
        let subaccTo: SubAccountNNS | undefined = undefined;
        try {
          subaccTo = SubAccountNNS.fromBytes((operation.to.subaccount as [Uint8Array])[0]) as SubAccountNNS;
        } catch (error) {
          logger.debug("Error parsing subaccount", error);
          subaccTo = undefined;
        }
        trans.idx = id.toString();
        trans.identityTo = AccountIdentifier.fromPrincipal({
          principal: operation.to.owner as Principal,
          subAccount: subaccTo,
        }).toHex();
        trans.type = TransactionTypeEnum.Enum.RECEIVE;
      },
    );
  else if (kind === SpecialTxTypeEnum.Enum.burn)
    burn.forEach(
      // Get Tx data from Burn record
      /**
       * INFO: memo type modified from [] | [Uint8Array] to [] | [Uint8Array | number[]] on ledger-icrc
       * References:
       * - https://forum.dfinity.org/t/breaking-changes-in-ledger-icrc-icp-javascript-libraries/23465
       * - https://github.com/dfinity/ic-js/blob/bf808fef5e3dbe4c3662abe8b350a04ba684619d/packages/ledger-icrc/candid/icrc_ledger.d.ts#L148
       */
      (operation: {
        from: Account;
        memo: [] | [Uint8Array | number[]];
        created_at_time: [] | [bigint];
        amount: bigint;
      }) => {
        const value = operation.amount;
        const amount = value.toString();
        trans.from = (operation.from.owner as Principal).toString();
        if (operation.from.subaccount.length > 0)
          trans.fromSub = `0x${subUint8ArrayToHex((operation.from.subaccount as [Uint8Array])[0])}`;
        else trans.fromSub = "0x0";
        trans.to = "";
        trans.toSub = "";
        trans.canisterId = canister;
        trans.symbol = symbol;
        trans.amount = amount;

        // Get AccountIdentifier of Sender
        let subaccFrom: SubAccountNNS | undefined = undefined;
        try {
          subaccFrom = SubAccountNNS.fromBytes((operation.from.subaccount as [Uint8Array])[0]) as SubAccountNNS;
        } catch (error) {
          logger.debug("Error parsing subaccount", error);
          subaccFrom = undefined;
        }
        trans.idx = id.toString();
        trans.identityFrom = AccountIdentifier.fromPrincipal({
          principal: operation.from.owner as Principal,
          subAccount: subaccFrom,
        }).toHex();
        trans.type = TransactionTypeEnum.Enum.SEND;
      },
    );
  else
    transfer?.forEach((operation: any) => {
      // Get Tx data from transfer record
      const value = operation.amount;
      const amount = value.toString();
      trans.to = (operation.to.owner as Principal).toString();
      trans.from = (operation.from.owner as Principal).toString();

      if (operation.to.subaccount.length > 0)
        trans.toSub = `0x${subUint8ArrayToHex((operation.to.subaccount as [Uint8Array])[0])}`;
      else trans.toSub = "0x0";

      if (operation.from.subaccount.length > 0)
        trans.fromSub = `0x${subUint8ArrayToHex((operation.from.subaccount as [Uint8Array])[0])}`;
      else trans.fromSub = "0x0";

      const subCheck = subNumber;
      if (trans.from === principal && trans.fromSub === subCheck) {
        trans.type = TransactionTypeEnum.Enum.SEND;
      } else {
        trans.type = TransactionTypeEnum.Enum.RECEIVE;
      }

      trans.canisterId = canister;
      trans.symbol = symbol;
      trans.amount = amount;
      trans.idx = id.toString();

      // Get AccountIdentifier of Receiver
      let subaccTo: SubAccountNNS | undefined = undefined;
      try {
        subaccTo = SubAccountNNS.fromBytes((operation.to.subaccount as [Uint8Array])[0]) as SubAccountNNS;
      } catch (error) {
        logger.debug("Error parsing subaccount", error);
        subaccTo = undefined;
      }
      trans.identityTo = AccountIdentifier.fromPrincipal({
        principal: operation.to.owner as Principal,
        subAccount: subaccTo,
      }).toHex();

      // Get AccountIdentifier of Sender
      let subaccFrom: SubAccountNNS | undefined = undefined;
      try {
        subaccFrom = SubAccountNNS.fromBytes((operation.to.subaccount as [Uint8Array])[0]) as SubAccountNNS;
      } catch (error) {
        logger.debug("Error parsing subaccount", error);
        subaccFrom = undefined;
      }
      trans.identityFrom = AccountIdentifier.fromPrincipal({
        principal: operation.from.owner as Principal,
        subAccount: subaccFrom,
      }).toHex();
    });
  return {
    ...trans,
    timestamp: Math.floor(Number(timestamp) / MILI_PER_SECOND),
  } as Transaction;
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
