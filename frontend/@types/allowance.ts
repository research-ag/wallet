import { z } from "zod";

const subAccount = z.object({
  name: z.string(),
  sub_account_id: z.string(),
  address: z.string(),
  amount: z.string(),
  currency_amount: z.string(),
  transaction_fee: z.string(),
  decimal: z.number(),
  symbol: z.string(),
});

export const allowanceSchemaSchema = z.object({
  id: z.string().optional(),
  asset: z.object({
    logo: z.string().optional(),
    subAccounts: z.array(subAccount),
    name: z.string(),
    symbol: z.string(),
    address: z.string(),
    decimal: z.string(),
    shortDecimal: z.string(),
    sort_index: z.number(),
    index: z.string().optional(),
    tokenName: z.string(),
    tokenSymbol: z.string(),
  }),
  subAccount,
  amount: z.string(),
  spender: z.object({
    name: z.string(),
    principal: z.string(),
    accountIdentifier: z.string().optional(),
  }),
  expiration: z.string().optional(),
  noExpire: z.boolean(),
});

export type TAllowance = z.infer<typeof allowanceSchemaSchema>;

export const AllowancesTableColumnsEnum = z.enum(["subAccount", "spender", "amount", "expiration", "action"]);
export type AllowancesTableColumns = z.infer<typeof AllowancesTableColumnsEnum>;

export const AllowanceErrorFieldsEnum = z.enum(["spender", "asset", "amount", "expiration", "subAccount"]);
export type AllowanceErrorFields = z.infer<typeof AllowanceErrorFieldsEnum>;
