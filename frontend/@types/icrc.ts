import { AssetContactSchema, SubAccountContactSchema } from "@redux/models/ContactsModels";
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

const HasAssetAllowanceParamsSchema = z.object({
  accountPrincipal: z.string(),
  subAccounts: z.array(SubAccountContactSchema),
  assetAddress: z.string(),
  assetDecimal: z.string(),
});
export type HasSubAccountsParams = z.infer<typeof HasAssetAllowanceParamsSchema>;

const HasAssetAllowanceParamSchema = z.object({
  accountPrincipal: z.string(),
  assets: z.array(AssetContactSchema),
});
export type HasAssetAllowanceParams = z.infer<typeof HasAssetAllowanceParamSchema>;

const GetBalanceParamsSchema = z.object({
  principal: z.string(),
  subAccount: z.string(),
  assetAddress: z.string(),
  assetDecimal: z.string(),
});
export type GetBalanceParams = z.infer<typeof GetBalanceParamsSchema>;

const CheckAllowanceParamsSchema = z.object({
  spenderPrincipal: z.string().optional(),
  spenderSubaccount: z.string(),
  accountPrincipal: z.string().optional(),
  assetAddress: z.string(),
  assetDecimal: z.string(),
});
export type CheckAllowanceParams = z.infer<typeof CheckAllowanceParamsSchema>;

export const SupportedStandardEnum = z.enum(["ICRC-1", "ICRC-2"]);
export type SupportedStandard = z.infer<typeof SupportedStandardEnum>;
