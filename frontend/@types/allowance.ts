import { z } from "zod";

export const allowanceSchemaSchema = z.object({
  id: z.string().optional(),
  // asset: Asset,
  // subAccount: SubAccount,
  // spender: ContactSchema,
  amount: z.string(),
  expiration: z.string().optional(),
  noExpire: z.boolean(),
});

export type TAllowance = z.infer<typeof allowanceSchemaSchema>;

export const AllowancesTableColumnsSchema = z.enum(["subAccount", "spender", "amount", "expiration", "action"]);

export const ErrorFieldsSchema = z.enum(["spender", "asset", "amount", "expiration", "subAccount"]);
