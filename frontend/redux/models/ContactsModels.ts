import { z } from "zod";

export const contactAllowanceSchema = z.object({
  expiration: z.string(),
  amount: z.string(),
});

export type ContactAllowance = z.infer<typeof contactAllowanceSchema>;

export const contactAccountSchema = z.object({
  name: z.string(),
<<<<<<< HEAD
  subaccount: z.string(),
  subaccountId: z.string(),
=======
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
>>>>>>> 5b62601c (refactor: Overweighted views and multilines if)
  tokenSymbol: z.string(),
  allowance: contactAllowanceSchema.optional(), // Allow optional allowance
});

export type ContactAccount = z.infer<typeof contactAccountSchema>;

export const contactSchema = z.object({
  name: z.string(),
  principal: z.string(),
  accountIdentifier: z.string(),
  accounts: z.array(contactAccountSchema),
});

<<<<<<< HEAD
export type Contact = z.infer<typeof contactSchema>;

export const defaultContactSubAccount: ContactAccount = {
  name: "",
  subaccountId: "",
  subaccount: "",
  tokenSymbol: "",
  allowance: undefined,
};
=======
export type Contact = z.infer<typeof Contact>;

const ContactErr = z.object({
  name: z.boolean(),
  principal: z.boolean(),
});

export type ContactErr = z.infer<typeof ContactErr>;
>>>>>>> 5b62601c (refactor: Overweighted views and multilines if)
