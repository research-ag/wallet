import { Asset, SubAccount } from "@redux/models/AccountModels";

export enum ReceiverActions {
  SET_RECEIVER_OWN_SUB_ACCOUNT = "SET_OWN_SUB_ACCOUNT",
  SET_RECEIVER_THIRD_NEW_CONTACT = "SET_RECEIVER_THIRD_NEW_CONTACT",
  SET_RECEIVER_THIRD_CONTACT_SUB_ACCOUNT = "SET_RECEIVER_THIRD_CONTACT_SUB_ACCOUNT",
  SET_RECEIVER_ICRC_SCANNER_CONTACT = "SET_RECEIVER_ICRC_SCANNER_CONTACT",
}

// DATA SCHEMAS
export type SetSenderAsset = (asset: Asset) => void;
export type SetSenderSubAccount = (subAccount: SubAccount) => void;
export type SetSenderAllowanceContact = (allowanceContact: ContactSubAccount) => void;
export type SetSenderNewAllowanceContact = (newAllowanceContact: NewContact) => void;
export type SetReceiverOwnSubAccount = (subAccount: SubAccount) => void;
export type SetReceiverNewContact = (newContact: NewContact) => void;
export type SetReceiverThirdContactSubAccount = (subAccount: ContactSubAccount) => void;

export interface ContactSubAccount {
  contactName: string;
  contactPrincipal: string;
  contactAccountIdentifier: string | undefined;
  assetLogo: string | undefined;
  assetSymbol: string | undefined;
  assetTokenSymbol: string | undefined;
  assetAddress: string | undefined;
  assetDecimal: string | undefined;
  assetShortDecimal: string | undefined;
  assetName: string | undefined;
  subAccountIndex: string | undefined;
  subAccountId: string;
  subAccountAllowance: { allowance: string; expires_at: string } | undefined;
  subAccountName: string;
}

export interface NewContact {
  principal: string;
  subAccountId: string;
}

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
  senderOption: SenderOption;
  allowanceContactSubAccount: ContactSubAccount;
  newAllowanceContact: NewContact;
  subAccount: SubAccount;
}

// CONSTANTS

export enum SenderActions {
  SET_SENDER_ASSET = "SET_SENDER_ASSET",
  SET_SENDER_SUB_ACCOUNT = "SET_SENDER_SUB_ACCOUNT",
  SET_SENDER_ALLOWANCE_CONTACT = "SET_SENDER_ALLOWANCE_CONTACT",
  SET_SENDER_NEW_ALLOWANCE_CONTACT = "SET_SENDER_NEW_ALLOWANCE_CONTACT",
  SET_SENDER_ICRC_SCANNER_CONTACT = "SET_SENDER_ICRC_SCANNER_CONTACT",
}

export enum SenderOption {
  own = "Own",
  allowance = "Allowance",
}

export enum ReceiverOption {
  own = "Own",
  third = "Third",
}

export enum ScannerOption {
  sender = "sender",
  receiver = "receiver",
  none = "none",
}
