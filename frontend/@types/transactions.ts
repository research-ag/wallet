import { SendingStatus } from "@/const";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { z } from "zod";

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

/**
 * Interface representing a validated ContactSubAccount object structure.
 *
 * This type is inferred from the `ContactSubAccountSchema` Zod schema.
 * It ensures type safety and clarity when working with contact sub-account data.
 *
 * @typedef {Object} ContactSubAccount
 * @property {string} contactName - The name of the contact.
 * @property {string} contactPrincipal - The principal identifier of the contact.
 * @property {string} [contactAccountIdentifier] - Optional account identifier for the contact.
 * @property {string} [assetLogo] - Optional URL or path to the asset's logo.
 * @property {string} [assetSymbol] - Optional symbol representation of the asset.
 * @property {string} [assetTokenSymbol] - Optional token symbol of the asset (if applicable).
 * @property {string} [assetAddress] - Optional address of the asset contract (if applicable).
 * @property {string} [assetDecimal] - Optional number of decimal places for the asset.
 * @property {string} [assetShortDecimal] - Optional shortened representation of asset decimals.
 * @property {string} [assetName] - Optional full name of the asset.
 * @property {string} [subAccountIndex] - Optional index of the sub-account within the contact.
 * @property {string} subAccountId - Required identifier for the sub-account.
 * @property {Object} [subAccountAllowance] - Optional allowance information for the sub-account.
 *   @property {string} allowance - The allowance amount granted to the contact.
 *   @property {string} expires_at - The timestamp when the allowance expires (if applicable).
 * @property {string} subAccountName - Required name of the sub-account.
 */
export type ContactSubAccount = z.infer<typeof ContactSubAccountSchema>;

export const NewContactSchema = z.object({
  principal: z.string(),
  subAccountId: z.string(),
});

/**
 * Interface representing a validated NewContact object structure.
 *
 * This type is inferred from the `NewContactSchema` Zod schema.
 * It ensures type safety and clarity when working with new contact data.
 *
 * @typedef {Object} NewContact
 * @property {string} principal - The principal identifier of the new contact.
 * @property {string} subAccountId - The sub-account ID that will be associated with the new contact.
 */
export type NewContact = z.infer<typeof NewContactSchema>;

/**
 * Interface representing the state of a transaction receiver.
 *
 * This interface defines the properties that describe the receiver configuration
 * for a transaction within your application.
 *
 * @typedef {Object} ReceiverState
 * @property {boolean} isManual - Indicates whether the receiver selection is manual or automatic.
 * @property {TransactionReceiverOption} receiverOption - The chosen option for the receiver.
 * @property {SubAccount} ownSubAccount - The sender's own sub-account to be used (if applicable).
 * @property {NewContact} thirdNewContact - Information for a new contact to be created as a receiver (if applicable).
 * @property {ContactSubAccount} thirdContactSubAccount - Details of an existing third-party contact sub-account (if applicable).
 */
export interface ReceiverState {
  isManual: boolean;
  receiverOption: TransactionReceiverOption;
  ownSubAccount: SubAccount;
  thirdNewContact: NewContact;
  thirdContactSubAccount: ContactSubAccount;
}

/**
 * Interface representing the state of a transaction sender.
 *
 * This interface defines the properties that describe the sender configuration
 * for a transaction within your application.
 *
 * @typedef {Object} SenderState
 * @property {Asset} asset - The asset to be used for the transaction.
 * @property {boolean} isNewSender - Indicates whether the sender is a newly selected entity.
 * @property {TransactionSenderOption} senderOption - The chosen option for the sender.
 * @property {ContactSubAccount} allowanceContactSubAccount - Details of an existing contact sub-account with an allowance (if applicable).
 * @property {NewContact} newAllowanceContact - Information for a new contact to be created with an allowance (if applicable).
 * @property {SubAccount} subAccount - The sender's sub-account to be used (if applicable).
 */
export interface SenderState {
  asset: Asset;
  isNewSender: boolean;
  senderOption: TransactionSenderOption;
  allowanceContactSubAccount: ContactSubAccount;
  newAllowanceContact: NewContact;
  subAccount: SubAccount;
}

/**
 * Interface representing the state of a transaction within your redux store.
 *
 * This interface captures various properties that define the current stage and
 * details of a transaction. It provides a central location to manage transaction
 * data and facilitates communication between components before and after a transaction.
 *
 * @typedef {Object} TransactionState
 * @property {TransactionScannerOption} scannerActiveOption - The chosen option for the transaction scanner (if applicable).
 * @property {boolean} isLoading - Indicates whether the transaction is currently being loaded or processed.
 * @property {boolean} isInspectTransference - Indicates whether the user is inspecting a previous transaction.
 * @property {SendingStatus} sendingStatus - The current sending status of the transaction (if applicable).
 * @property {SenderState} sender - Details about the sender configuration for the transaction.
 * @property {ReceiverState} receiver - Details about the receiver configuration for the transaction.
 * @property {TransactionValidationErrorsType[]} [errors] - An optional array of validation errors encountered during transaction processing.
 * @property {string} [amount] - The transaction amount (if applicable).
 * @property {Date} initTime - The timestamp when the transaction was initiated.
 * @property {Date} endTime - The timestamp when the transaction was completed (or last updated).
 */

export enum TransactionDrawer {
  SEND = "SEND",
  RECEIVE = "RECEIVE",
  INSPECT = "INSPECT",
  NONE = "NONE",
}

export interface TransactionState {
  scannerActiveOption: TransactionScannerOption;
  isLoading: boolean;
  isInspectTransference: boolean;
  sendingStatus: SendingStatus;
  sender: SenderState;
  receiver: ReceiverState;
  errors?: TransactionValidationErrorsType[];
  amount?: string;
  initTime: Date;
  endTime: Date;
  transactionDrawer: TransactionDrawer;
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
  "error.allowance.not.enough",
  "error.allowance.not.exist",
]);
export type TransactionValidationErrorsType = z.infer<typeof TransactionValidationErrorsEnum>;

// SENDER ERROR

export const TransactionSenderOptionEnum = z.enum(["own", "allowance"]);
export type TransactionSenderOption = z.infer<typeof TransactionSenderOptionEnum>;

export const TransactionReceiverOptionEnum = z.enum(["own", "third"]);
export type TransactionReceiverOption = z.infer<typeof TransactionReceiverOptionEnum>;

export const TransactionScannerOptionEnum = z.enum(["sender", "receiver", "none"]);
export type TransactionScannerOption = z.infer<typeof TransactionScannerOptionEnum>;

export const transactionErrors: KeyValidationErrors = {
  [TransactionValidationErrorsEnum.Values["error.asset.empty"]]:
    TransactionValidationErrorsEnum.Values["error.asset.empty"],
  [TransactionValidationErrorsEnum.Values["error.sender.empty"]]:
    TransactionValidationErrorsEnum.Values["error.sender.empty"],
  [TransactionValidationErrorsEnum.Values["error.receiver.empty"]]:
    TransactionValidationErrorsEnum.Values["error.receiver.empty"],
  [TransactionValidationErrorsEnum.Values["error.own.sender.not.allowed"]]:
    TransactionValidationErrorsEnum.Values["error.own.sender.not.allowed"],
  [TransactionValidationErrorsEnum.Values["error.same.sender.receiver"]]:
    TransactionValidationErrorsEnum.Values["error.same.sender.receiver"],
  [TransactionValidationErrorsEnum.Values["error.invalid.sender.principal"]]:
    TransactionValidationErrorsEnum.Values["error.invalid.sender.principal"],
  [TransactionValidationErrorsEnum.Values["error.invalid.sender.subaccount"]]:
    TransactionValidationErrorsEnum.Values["error.invalid.sender.subaccount"],
  [TransactionValidationErrorsEnum.Values["error.invalid.receiver.principal"]]:
    TransactionValidationErrorsEnum.Values["error.invalid.receiver.principal"],
  [TransactionValidationErrorsEnum.Values["error.invalid.receiver.subaccount"]]:
    TransactionValidationErrorsEnum.Values["error.invalid.receiver.subaccount"],
  [TransactionValidationErrorsEnum.Values["invalid.receiver.identifier"]]:
    TransactionValidationErrorsEnum.Values["invalid.receiver.identifier"],
  [TransactionValidationErrorsEnum.Values["error.invalid.sender"]]:
    TransactionValidationErrorsEnum.Values["error.invalid.sender"],
  [TransactionValidationErrorsEnum.Values["error.invalid.receiver"]]:
    TransactionValidationErrorsEnum.Values["error.invalid.receiver"],
  [TransactionValidationErrorsEnum.Values["error.invalid.amount"]]:
    TransactionValidationErrorsEnum.Values["error.invalid.amount"],
  [TransactionValidationErrorsEnum.Values["error.not.enough.balance"]]:
    TransactionValidationErrorsEnum.Values["error.not.enough.balance"],
  [TransactionValidationErrorsEnum.Values["error.allowance.subaccount.not.enough"]]:
    TransactionValidationErrorsEnum.Values["error.allowance.subaccount.not.enough"],
};
