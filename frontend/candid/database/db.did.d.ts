import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface AllowanceDocument {
  id: string;
  deleted: boolean;
  asset: {
    logo: string;
    name: string;
    tokenSymbol: string;
    supportedStandards: Array<string>;
    address: string;
    tokenName: string;
    decimal: string;
    symbol: string;
  };
  updatedAt: number;
  expiration: string;
  amount: string;
  subAccountId: string;
  spender: string;
}
export interface ContactDocument {
  principal: string;
  deleted: boolean;
  name: string;
  assets: Array<{
    subaccounts: Array<{
      name: string;
      sub_account_id: string;
      subaccount_index: string;
      allowance: [] | [{ allowance: string; expires_at: string }];
    }>;
    logo: string;
    tokenSymbol: string;
    supportedStandards: Array<string>;
    address: string;
    shortDecimal: string;
    decimal: string;
    symbol: string;
  }>;
  updatedAt: number;
  accountIdentier: string;
}
export interface TokenDocument {
  fee: string;
  deleted: boolean;
  logo: string;
  name: string;
  tokenSymbol: string;
  updatedAt: number;
  supportedStandards: Array<string>;
  address: string;
  tokenName: string;
  index: string;
  shortDecimal: string;
  decimal: string;
  id_number: number;
  subAccounts: Array<{
    currency_amount: string;
    name: string;
    numb: string;
    amount: string;
  }>;
  symbol: string;
}
export interface WalletDatabase {
  doesStorageExist: ActorMethod<[], boolean>;
  dump: ActorMethod<
    [],
    Array<[Principal, [Array<[] | [TokenDocument]>, Array<[] | [ContactDocument]>, Array<[] | [AllowanceDocument]>]]>
  >;
  pullAllowances: ActorMethod<[number, [] | [string], bigint], Array<AllowanceDocument>>;
  pullContacts: ActorMethod<[number, [] | [string], bigint], Array<ContactDocument>>;
  pullTokens: ActorMethod<[number, [] | [string], bigint], Array<TokenDocument>>;
  pushAllowances: ActorMethod<[Array<AllowanceDocument>], Array<AllowanceDocument>>;
  pushContacts: ActorMethod<[Array<ContactDocument>], Array<ContactDocument>>;
  pushTokens: ActorMethod<[Array<TokenDocument>], Array<TokenDocument>>;
}
export interface _SERVICE extends WalletDatabase {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
