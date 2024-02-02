import { AssetSchema } from "@redux/models/AccountModels";
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

export const allowanceSchema = z.object({
  id: z.string().optional(),
  asset: AssetSchema,
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

export type TAllowance = z.infer<typeof allowanceSchema>;

export const AllowancesTableColumnsEnum = z.enum(["subAccount", "spender", "amount", "expiration", "action"]);
export type AllowancesTableColumns = z.infer<typeof AllowancesTableColumnsEnum>;

export const AllowanceErrorFieldsEnum = z.enum(["spender", "asset", "amount", "expiration", "subAccount"]);
export type AllowanceErrorFields = z.infer<typeof AllowanceErrorFieldsEnum>;
