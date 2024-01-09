import { z } from "zod";

// Models

const SubAccountContact = z.object({
  name: z.string(),
  subaccount_index: z.string(),
});

export type SubAccountContact = z.infer<typeof SubAccountContact>;

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

const AssetContact = z.object({
  symbol: z.string(),
  tokenSymbol: z.string(),
  logo: z.string().optional(),
  subaccounts: z.array(SubAccountContact),
});

export type AssetContact = z.infer<typeof AssetContact>;

const Contact = z.object({
  name: z.string(),
  principal: z.string(),
  assets: z.array(AssetContact),
  accountIdentier: z.string().optional(),
});

export type Contact = z.infer<typeof Contact>;

const ContactErr = z.object({
  name: z.boolean(),
  principal: z.boolean(),
});

export type ContactErr = z.infer<typeof ContactErr>;
