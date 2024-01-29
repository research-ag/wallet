import { AssetContact, SubAccountContact } from "@redux/models/ContactsModels";

export interface TransferAmountParams {
  receiverPrincipal: string;
  assetAddress: string;
  transferAmount: string;
  decimal: string;
  fromSubAccount: string;
  toSubAccount: string;
}
export interface TransferFromAllowanceParams extends TransferAmountParams {
  senderPrincipal: string;
  transactionFee: string;
}
export interface HasSubAccountsParams {
  accountPrincipal: string;
  subAccounts: SubAccountContact[];
  assetAddress: string;
  assetDecimal: string;
}
export interface HasAssetAllowanceParams {
  accountPrincipal: string;
  assets: AssetContact[];
}
