import { z } from "zod";

// Models

const SubAccountContact = z.object({
  name: z.string(),
  subaccount_index: z.string(),
});

export type SubAccountContact = z.infer<typeof SubAccountContact>;

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
