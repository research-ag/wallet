import { Asset, SubAccount } from "@redux/models/AccountModels";
import { Contact } from "@redux/models/ContactsModels";

export interface Allowance {
  id?: string;
  asset: Asset;
  subAccount: SubAccount;
  spender: Contact;
  amount: string;
  expiration: string | undefined;
  noExpire: boolean;
}

export const enum AllowancesTableColumns {
  subAccount = "subAccount",
  spender = "spender",
  amount = "amount",
  expiration = "expiration",
  action = "action",
}

export const enum ErrorFields {
  spender = "spender",
  asset = "asset",
  amount = "amount",
  expiration = "expiration",
  subAccount = "subAccount",
};
