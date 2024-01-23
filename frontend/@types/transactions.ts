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
  // TODO: validate principal
  principal: z.string(),
  // TODO: validate subaccount id
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
  receiverOption: ReceiverOption;
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

export enum ValidationErrors {
  INVALID_SENDER = "invalid.sender",
  INVALID_RECEIVER = "invalid.receiver",
  INVALID_SENDER_PRINCIPAL = "invalid.sender.principal",
  INVALID_SENDER_SUB_ACCOUNT = "invalid.sender.subaccount",
  INVALID_RECEIVER_PRINCIPAL = "invalid.receiver.principal",
  INVALID_RECEIVER_SUB_ACCOUNT = "invalid-receiver.subaccount",
  OWN_SENDER_NOT_ALLOWED = "own.sender.not.allowed",
  SENDER_INVALID_ALLOWANCE = "sender.allowance.invalid",
  BALANCE_NOT_ENOUGH = "not.enough.balance",
  INVALID_AMOUNT = "invalid.amount",
}

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
]);
export type ValidationErrorsType = z.infer<typeof ValidationErrorsEnum>;

export const TransactionSenderOptionEnum = z.enum(["own", "allowance"]);
export type TransactionSenderOption = z.infer<typeof TransactionSenderOptionEnum>;

export const TransactionReceiverOptionEnum = z.enum(["own", "third"]);
export type TransactionReceiverOption = z.infer<typeof TransactionReceiverOptionEnum>;
export enum ReceiverOption {
  own = "Own",
  third = "Third",
}

export const TransactionScannerOptionEnum = z.enum(["sender", "receiver", "none"]);
export type TransactionScannerOption = z.infer<typeof TransactionScannerOptionEnum>;
export enum ScannerOption {
  sender = "sender",
  receiver = "receiver",
  none = "none",
}
