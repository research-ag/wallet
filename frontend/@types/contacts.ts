export interface ContactAccount {
  name: string;
  subaccount: string;
  subaccountId: string;
  tokenSymbol: string;
}

export interface ContactAllowance {
  expiration: string;
  amount: string;
}

export interface Contact {
  name: string;
  principal: string;
  accountIdentifier: string;
  accounts: ContactAccount[];
  allowances?: ContactAllowance;
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
}
