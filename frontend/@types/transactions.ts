import { Asset, SubAccount } from "@redux/models/AccountModels";
import { z } from "zod";

export type SetSenderAsset = (asset: Asset) => void;
export type SetSenderSubAccount = (subAccount: SubAccount) => void;
export type SetSenderAllowanceContact = (allowanceContact: ContactSubAccount) => void;
export type SetSenderNewAllowanceContact = (newAllowanceContact: NewContact) => void;
export type SetReceiverOwnSubAccount = (subAccount: SubAccount) => void;
export type SetReceiverNewContact = (newContact: NewContact) => void;
export type SetReceiverThirdContactSubAccount = (subAccount: ContactSubAccount) => void;

export const ContactSubAccountSchema = z.object({
  contactName: z.string(),
  contactPrincipal: z.string(),
  contactAccountIdentifier: z.string().optional(),
  assetLogo: z.string().optional(),
  assetSymbol: z.string().optional(),
  assetTokenSymbol: z.string().optional(),
  assetAddress: z.string().optional(),
  assetDecimal: z.string().optional(),
  assetShortDecimal: z.string().optional(),
  assetName: z.string().optional(),
  subAccountIndex: z.string().optional(),
  subAccountId: z.string(),
  subAccountAllowance: z
    .object({
      allowance: z.string(),
      expires_at: z.string(),
    })
    .optional(),
  subAccountName: z.string(),
});
export type ContactSubAccount = z.infer<typeof ContactSubAccountSchema>;

export const NewContactSchema = z.object({
  principal: z.string(),
  subAccountId: z.string(),
});
export type NewContact = z.infer<typeof NewContactSchema>;

export const TransactionErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
});
export type TransactionError = z.infer<typeof TransactionErrorSchema>;

export interface ReceiverState {
  isManual: boolean;
  receiverOption: TransactionReceiverOption;
  ownSubAccount: SubAccount;
  thirdNewContact: NewContact;
  thirdContactSubAccount: ContactSubAccount;
}

export interface SenderState {
  asset: Asset;
  isNewSender: boolean;
  senderOption: TransactionSenderOption;
  allowanceContactSubAccount: ContactSubAccount;
  newAllowanceContact: NewContact;
  subAccount: SubAccount;
}

export interface KeyValidationErrors {
  [key: string]: string;
}

export const TransactionErrorFieldsEnum = z.enum(["sender", "receiver", "amount"]);
export type TransactionErrorFields = z.infer<typeof TransactionErrorFieldsEnum>;

export const ValidationErrorsEnum = z.enum([
  "invalid.sender",
  "invalid.receiver",
  "invalid.sender.principal",
  "invalid.sender.subaccount",
  "invalid.receiver.principal",
  "invalid.receiver.subaccount",
  "own.sender.not.allowed",
  "sender.allowance.invalid",
  "not.enough.balance",
  "invalid.amount",
  "invalid.same.receiver.sender"
]);
export type ValidationErrorsType = z.infer<typeof ValidationErrorsEnum>;

// SENDER ERROR

export const TransactionSenderOptionEnum = z.enum(["own", "allowance"]);
export type TransactionSenderOption = z.infer<typeof TransactionSenderOptionEnum>;

export const TransactionReceiverOptionEnum = z.enum(["own", "third"]);
export type TransactionReceiverOption = z.infer<typeof TransactionReceiverOptionEnum>;

export const TransactionScannerOptionEnum = z.enum(["sender", "receiver", "none"]);
export type TransactionScannerOption = z.infer<typeof TransactionScannerOptionEnum>;
