import { z } from "zod";

const TransferTokensParamsSchema = z.object({
  receiverPrincipal: z.string(),
  assetAddress: z.string(),
  transferAmount: z.string(),
  decimal: z.string(),
  fromSubAccount: z.string(),
  toSubAccount: z.string(),
});
export type TransferTokensParams = z.infer<typeof TransferTokensParamsSchema>;

const TransferFromAllowanceParamsSchema = TransferTokensParamsSchema.extend({
  senderPrincipal: z.string(),
  transactionFee: z.string(),
});
export type TransferFromAllowanceParams = z.infer<typeof TransferFromAllowanceParamsSchema>;

const GetBalanceParamsSchema = z.object({
  principal: z.string().optional(),
  subAccount: z.string(),
  assetAddress: z.string(),
  assetDecimal: z.string().optional(),
});
export type GetBalanceParams = z.infer<typeof GetBalanceParamsSchema>;

const CheckAllowanceParamsSchema = z.object({
  spenderPrincipal: z.string().optional(),
  spenderSubaccount: z.string().optional(),
  allocatorSubaccount: z.string(),
  allocatorPrincipal: z.string().optional(),
  assetAddress: z.string(),
  assetDecimal: z.string(),
});
export type CheckAllowanceParams = z.infer<typeof CheckAllowanceParamsSchema>;

const TransactionFeeParamsParamsSchema = z.object({
  assetAddress: z.string(),
  assetDecimal: z.string(),
});
export type TransactionFeeParams = z.infer<typeof TransactionFeeParamsParamsSchema>;

export const SupportedStandardEnum = z.enum(["ICRC-1", "ICRC-2"]);
export type SupportedStandard = z.infer<typeof SupportedStandardEnum>;
