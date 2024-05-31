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
