import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

type Allowance = {
  allowance: string;
  expires_at: string;
};

export interface ContactDocument {
  name: string;
  principal: string;
  assets: Array<{
    symbol: string;
    tokenSymbol: string;
    logo: string;
    subaccounts: Array<{
      name: string;
      subaccount_index: string;
      sub_account_id: string;
      allowance?: Allowance;
    }>;
    address: string;
    decimal: string;
    shortDecimal: string;
    supportedStandards: ["ICRC-1" | "ICRC-2"];
  }>;
  accountIdentier: string;
  updatedAt: number;
  deleted: boolean;
}

export interface TokenDocument {
  id_number: number;
  address: string;
  symbol: string;
  name: string;
  tokenName: string;
  tokenSymbol: string;
  decimal: string;
  shortDecimal: string;
  subAccounts: Array<{
    name: string;
    numb: string;
    amount: string;
    currency_amount: string;
  }>;
  fee: string;
  index: string;
  logo: string;
  supportedStandards: ["ICRC-1" | "ICRC-2"];
  deleted: boolean;
  updatedAt: number;
}
export interface WalletDatabase {
  dump: ActorMethod<[], Array<[Principal, [Array<[] | [TokenDocument]>, Array<[] | [ContactDocument]>]]>>;
  pullContacts: ActorMethod<[number, [] | [string], bigint], Array<ContactDocument>>;
  pullTokens: ActorMethod<[number, [] | [string], bigint], Array<TokenDocument>>;
  pushContacts: ActorMethod<[Array<ContactDocument>], Array<ContactDocument>>;
  pushTokens: ActorMethod<[Array<TokenDocument>], Array<TokenDocument>>;
}
export type _SERVICE = WalletDatabase;

export const idlFactory = ({ IDL }: { IDL: any }) => {
  const TokenDocument = IDL.Record({
    deleted: IDL.Bool,
    logo: IDL.Text,
    name: IDL.Text,
    tokenName: IDL.Text,
    tokenSymbol: IDL.Text,
    updatedAt: IDL.Nat32,
    address: IDL.Text,
    index: IDL.Text,
    decimal: IDL.Text,
    shortDecimal: IDL.Text,
    id_number: IDL.Nat32,
    subAccounts: IDL.Vec(
      IDL.Record({
        name: IDL.Text,
        numb: IDL.Text,
        amount: IDL.Text,
        currency_amount: IDL.Text,
      }),
    ),
    fee: IDL.Text,
    symbol: IDL.Text,
    supportedStandards: IDL.Vec(IDL.Text),
  });

  const ContactDocument = IDL.Record({
    principal: IDL.Text,
    deleted: IDL.Bool,
    name: IDL.Text,
    assets: IDL.Vec(
      IDL.Record({
        subaccounts: IDL.Vec(
          IDL.Record({
            name: IDL.Text,
            subaccount_index: IDL.Text,
            sub_account_id: IDL.Text,
            allowance: IDL.Opt(
              IDL.Vec(
                IDL.Record({
                  allowance: IDL.Text,
                  expires_at: IDL.Text,
                }),
              ),
            ),
          }),
        ),
        logo: IDL.Text,
        tokenSymbol: IDL.Text,
        symbol: IDL.Text,
        address: IDL.Text,
        decimal: IDL.Text,
        shortDecimal: IDL.Text,
        supportedStandards: IDL.Vec(IDL.Text),
      }),
    ),
    updatedAt: IDL.Nat32,
    accountIdentier: IDL.Text,
  });

  const WalletDatabase = IDL.Service({
    dump: IDL.Func(
      [],
      [
        IDL.Vec(
          IDL.Tuple(IDL.Principal, IDL.Tuple(IDL.Vec(IDL.Opt(TokenDocument)), IDL.Vec(IDL.Opt(ContactDocument)))),
        ),
      ],
      ["query"],
    ),
    pullContacts: IDL.Func([IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat], [IDL.Vec(ContactDocument)], ["query"]),
    pullTokens: IDL.Func([IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat], [IDL.Vec(TokenDocument)], ["query"]),
    pushContacts: IDL.Func([IDL.Vec(ContactDocument)], [IDL.Vec(ContactDocument)], []),
    pushTokens: IDL.Func([IDL.Vec(TokenDocument)], [IDL.Vec(TokenDocument)], []),
  });
  return WalletDatabase;
};

export const init = () => {
  return [];
};
