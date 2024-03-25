import { z } from "zod";

export const SubAccountContactSchema = z.object({
  name: z.string(),
  subaccount_index: z.string(),
  sub_account_id: z.string(),
  allowance: z
    .object({
      allowance: z.string().default(""),
      expires_at: z.string().default(""),
    })
    .optional(),
});

export type SubAccountContact = z.infer<typeof SubAccountContactSchema>;

const SubAccountContactErr = z.object({
  name: z.boolean(),
  subaccount_index: z.boolean(),
});

export type SubAccountContactErr = z.infer<typeof SubAccountContactErr>;

const NewContactSubAccount = z.object({
  principal: z.string(),
  name: z.string(),
  tokenSymbol: z.string(),
  symbol: z.string(),
  subaccIdx: z.string(),
  subaccName: z.string(),
  totalAssets: z.number(),
  TotalSub: z.number(),
});

export type NewContactSubAccount = z.infer<typeof NewContactSubAccount>;

export const AssetContactSchema = z.object({
  symbol: z.string(),
  tokenSymbol: z.string(),
  logo: z.string().optional(),
  subaccounts: z.array(SubAccountContactSchema),
  address: z.string(),
  decimal: z.string(),
  shortDecimal: z.string(),
  supportedStandards: z.array(z.enum(["ICRC-1", "ICRC-2"])),
});
export type AssetContact = z.infer<typeof AssetContactSchema>;

const Contact = z.object({
  name: z.string(),
  principal: z.string(),
  assets: z.array(AssetContactSchema),
  accountIdentier: z.string().optional(),
});

export type Contact = z.infer<typeof Contact>;

const ContactErr = z.object({
  name: z.boolean(),
  principal: z.boolean(),
});

export type ContactErr = z.infer<typeof ContactErr>;
