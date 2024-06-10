import { ContactAccount } from "@redux/models/ContactsModels";

export interface RetrieveSubAccountsWithAllowanceArgs {
  accountPrincipal: string;
  subAccounts: ContactAccount[];
  assetAddress: string;
  assetDecimal: string;
}

export interface NewContactErrors {
  name: boolean;
  principal: boolean;
  message: string;
}
