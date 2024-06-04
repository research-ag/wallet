export interface ContactAllowance {
  expiration: string;
  amount: string;
}

export interface ContactAccount {
  name: string;
  subaccount: string;
  subaccountId: string;
  tokenSymbol: string;
  allowance?: ContactAllowance;
}

export interface Contact {
  name: string;
  principal: string;
  accountIdentifier: string;
  accounts: ContactAccount[];
}

// ----------------------------- Args -----------------------------

export interface RetrieveSubAccountsWithAllowanceArgs {
  accountPrincipal: string;
  subAccounts: ContactAccount[];
  assetAddress: string;
  assetDecimal: string;
}

// ----------------------------- Errors -----------------------------

export interface NewContactErrors {
  name: boolean;
  principal: boolean;
  message: string;
}
