import { Asset, SubAccount } from "@redux/models/AccountModels";

// DATA SCHEMAS
export type SetSenderAsset = (asset: Asset) => void;
export type SetSenderSubAccount = (subAccount: SubAccount) => void;
export type SetSenderAllowanceContact = (allowanceContact: AllowanceContactSubAccount) => void;
export type SetSenderNewAllowanceContact = (newAllowanceContact: NewAllowanceContact) => void;

export interface AllowanceContactSubAccount {
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

export interface NewAllowanceContact {
  principal: string;
  subAccountId: string;
}

export interface SenderInitialState {
  asset: Asset;
  subAccount: SubAccount;
  allowanceContactSubAccount: AllowanceContactSubAccount;
  newAllowanceContact: NewAllowanceContact;
}

// CONSTANTS

export enum SenderActions {
  SET_SENDER_ASSET = "SET_SENDER_ASSET",
  SET_SENDER_SUB_ACCOUNT = "SET_SENDER_SUB_ACCOUNT",
  SET_SENDER_ALLOWANCE_CONTACT = "SET_SENDER_ALLOWANCE_CONTACT",
  SET_SENDER_NEW_ALLOWANCE_CONTACT = "SET_SENDER_NEW_ALLOWANCE_CONTACT",
}

export enum SenderOption {
  own = "Own",
  allowance = "Allowance",
}

export enum ReceiverOption {
  own = "Own",
  third = "Third",
}
