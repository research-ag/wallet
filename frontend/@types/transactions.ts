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

export const TransactionValidationErrorsEnum = z.enum([
  "error.asset.empty",
  "error.sender.empty",
  "error.receiver.empty",
  "error.sender.not.active.allowance",
  "error.own.sender.not.allowed",
  "error.same.sender.receiver",
  "error.invalid.sender.principal",
  "error.invalid.sender.subaccount",
  "error.invalid.receiver.principal",
  "error.invalid.receiver.subaccount",
  "invalid.receiver.identifier",
  "error.invalid.sender",
  "error.invalid.receiver",
  "error.invalid.amount",
  "error.not.enough.balance",
  "error.allowance.subaccount.not.enough",
]);
export type TransactionValidationErrorsType = z.infer<typeof TransactionValidationErrorsEnum>;

// SENDER ERROR

export const TransactionSenderOptionEnum = z.enum(["own", "allowance"]);
export type TransactionSenderOption = z.infer<typeof TransactionSenderOptionEnum>;

export const TransactionReceiverOptionEnum = z.enum(["own", "third"]);
export type TransactionReceiverOption = z.infer<typeof TransactionReceiverOptionEnum>;

export const TransactionScannerOptionEnum = z.enum(["sender", "receiver", "none"]);
export type TransactionScannerOption = z.infer<typeof TransactionScannerOptionEnum>;
