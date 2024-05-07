import { SupportedStandardEnum } from "@/@types/icrc";
import { OperationStatusEnum, OperationTypeEnum, TransactionTypeEnum } from "@/common/const";
import { z } from "zod";

// Models
const SubAccount = z.object({
  name: z.string(),
  sub_account_id: z.string(),
  address: z.string(),
  amount: z.string(),
  currency_amount: z.string(),
  transaction_fee: z.string(),
  decimal: z.number(),
  symbol: z.string(),
});

export type SubAccount = z.infer<typeof SubAccount>;

const ICPSubAccount = z.object({
  legacy: z.string(),
  sub_account_id: z.string(),
});

export type ICPSubAccount = z.infer<typeof ICPSubAccount>;
export const AssetSchema = z.object({
  sortIndex: z.number(),
  logo: z.string().optional(),
  // INFO: name and symbol are custom from user
  name: z.string(),
  symbol: z.string(),
  address: z.string(),
  decimal: z.string(),
  shortDecimal: z.string(),
  index: z.string().optional(),
  // INFO: tokenName and tokenSymbol are default
  tokenName: z.string(),
  tokenSymbol: z.string(),
  subAccounts: z.array(SubAccount),
  supportedStandards: z.array(SupportedStandardEnum),
});

export type Asset = z.infer<typeof AssetSchema>;

const Transaction = z.object({
  idx: z.string().optional(),
  hash: z.string().optional(),
  timestamp: z.number(),
  from: z.string().optional(),
  fromSub: z.string().optional(),
  to: z.string().optional(),
  toSub: z.string().optional(),
  fee: z.string().optional(),
  amount: z.string(),
  canisterId: z.string().optional(),
  status: OperationStatusEnum,
  type: TransactionTypeEnum,
  symbol: z.string(),
  identityTo: z.string().optional(),
  identityFrom: z.string().optional(),
  kind: z.string().optional(),
});

export type Transaction = z.infer<typeof Transaction>;

// Rosetta Transaction
const Operation = z.object({
  account: z.object({
    address: z.string(),
  }),
  amount: z.object({
    value: z.string(),
    currency: z.object({
      symbol: z.string(),
      decimals: z.number(),
    }),
  }),
  operation_identifier: z.object({
    index: z.number(),
  }),
  status: OperationStatusEnum,
  type: OperationTypeEnum,
});

export type Operation = z.infer<typeof Operation>;

const RosettaTransaction = z.object({
  metadata: z.object({
    block_height: z.number(),
    memo: z.number(),
    timestamp: z.number(),
    lockTime: z.number(),
  }),
  operations: z.array(Operation),
  transaction_identifier: z.object({
    hash: z.string(),
  }),
});

export type RosettaTransaction = z.infer<typeof RosettaTransaction>;

// Local Storage
const TransactionList = z.object({
  symbol: z.string(),
  tokenSymbol: z.string(),
  subaccount: z.string(),
  tx: z.array(Transaction),
});

export type TransactionList = z.infer<typeof TransactionList>;

// Process Interfaces
const AssetToAdd = z.object({
  symbol: z.string(),
  tokenSymbol: z.string(),
  logo: z.string().optional(),
  address: z.string(),
  decimal: z.string(),
  shortDecimal: z.string(),
  supportedStandards: z.array(SupportedStandardEnum),
});
export type AssetToAdd = z.infer<typeof AssetToAdd>;
