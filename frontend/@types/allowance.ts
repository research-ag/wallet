import { z } from "zod";
import { SupportedStandardEnum } from "./icrc";

export const AllowanceAssetSchema = z.object({
  logo: z.string().optional(),
  // INFO: name and symbol are custom from user
  name: z.string(),
  symbol: z.string(),
  address: z.string(),
  decimal: z.string(),
  // INFO: tokenName and tokenSymbol are default
  tokenName: z.string(),
  tokenSymbol: z.string(),
  supportedStandards: z.array(SupportedStandardEnum),
});

export const allowanceSchema = z.object({
  id: z.string(),
  asset: AllowanceAssetSchema,
  subAccountId: z.string(),
  spender: z.string(),
  spenderSubaccount: z.string().optional(),
  amount: z.string().optional(),
  expiration: z.string().optional(),
});

export type TAllowance = z.infer<typeof allowanceSchema>;

export const AllowancesTableColumnsEnum = z.enum(["subAccountId", "spender", "amount", "expiration", "action"]);
export type AllowancesTableColumns = z.infer<typeof AllowancesTableColumnsEnum>;

export const AllowanceErrorFieldsEnum = z.enum(["spender", "asset", "amount", "expiration", "subAccount"]);
export type AllowanceErrorFields = z.infer<typeof AllowanceErrorFieldsEnum>;

export const AllowanceValidationErrorsEnum = z.enum([
  "error.invalid.asset",
  "error.invalid.spender.principal",
  "error.invalid.spender.beneficiary",
  "error.invalid.expiration",
  "error.expiration.required",
  "error.expiration.not.allowed",
  "error.before.present.expiration",
  "error.not.enough.balance",
  "error.invalid.amount",
  "error.allowance.duplicated",
  "warn.system.loading",
  "error.invalid.subaccount",
  "error.self.allowance",
]);
export type AllowanceValidationErrors = z.infer<typeof AllowanceValidationErrorsEnum>;
