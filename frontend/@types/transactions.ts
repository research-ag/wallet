import { Transaction, TransactionList } from "@redux/models/AccountModels";
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
      amount: z.string(),
      expiration: z.string(),
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

export const ServiceSubAccountSchema = z.object({
  serviceName: z.string(),
  servicePrincipal: z.string(),
  assetLogo: z.string().optional(),
  assetSymbol: z.string().optional(),
  assetTokenSymbol: z.string().optional(),
  assetAddress: z.string().optional(),
  assetDecimal: z.string().optional(),
  assetShortDecimal: z.string().optional(),
  assetName: z.string().optional(),
  subAccountIndex: z.string().optional(),
  subAccountId: z.string(),
  depositFee: z.string(),
  withdrawFee: z.string(),
});

/**
 * Interface representing a validated ServiceSubAccount object structure.
 *
 * This type is inferred from the `ServiceSubAccountSchema` Zod schema.
 * It ensures type safety and clarity when working with contact sub-account data.
 *
 * @typedef {Object} ServiceSubAccount
 * @property {string} serviceName - The name of the contact.
 * @property {string} servicePrincipal - The principal identifier of the contact.
 * @property {string} [assetLogo] - Optional URL or path to the asset's logo.
 * @property {string} [assetSymbol] - Optional symbol representation of the asset.
 * @property {string} [assetTokenSymbol] - Optional token symbol of the asset (if applicable).
 * @property {string} [assetAddress] - Optional address of the asset contract (if applicable).
 * @property {string} [assetDecimal] - Optional number of decimal places for the asset.
 * @property {string} [assetShortDecimal] - Optional shortened representation of asset decimals.
 * @property {string} [assetName] - Optional full name of the asset.
 * @property {string} [subAccountIndex] - Optional index of the sub-account within the contact.
 * @property {string} subAccountId - Required identifier for the sub-account.
 * @property {string} minDeposit - Minumum deposit amount.
 * @property {string} minWithdraw -  Minumum withdraw amount.
 * @property {string} depositFee -  Fee for deposit transaction.
 * @property {string} withdrawFee -  Fee for withdraw transaction.
 */
export type ServiceSubAccount = z.infer<typeof ServiceSubAccountSchema>;

export enum TransactionDrawer {
  SEND = "SEND",
  RECEIVE = "RECEIVE",
  INSPECT = "INSPECT",
  NONE = "NONE",
}

export interface TransactionState {
  isInspectTransference: boolean;
  transactionDrawer: TransactionDrawer;
  selectedTransaction: Transaction | undefined;
  list: {
    txLoad: boolean;
    txWorker: Array<TransactionList>;
    transactions: Array<Transaction[]>;
  };
}
