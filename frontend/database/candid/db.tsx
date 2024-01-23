import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export interface ContactDocument {
  principal: string;
  deleted: boolean;
  name: string;
  assets: Array<{
    subaccounts: Array<{ name: string; subaccount_index: string }>;
    logo: [] | [string];
    tokenSymbol: string;
    symbol: string;
  }>;
  updatedAt: number;
  accountIdentier: [] | [string];
}
export interface TokenDocument {
  id: string;
  deleted: boolean;
  logo: [] | [string];
  name: string;
  updatedAt: number;
  address: string;
  index: [] | [string];
  decimal: string;
  id_number: bigint;
  subAccounts: Array<{ name: string; numb: string }>;
  symbol: string;
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
    id: IDL.Text,
    deleted: IDL.Bool,
    logo: IDL.Opt(IDL.Text),
    name: IDL.Text,
    updatedAt: IDL.Nat32,
    address: IDL.Text,
    index: IDL.Opt(IDL.Text),
    decimal: IDL.Text,
    id_number: IDL.Nat64,
    subAccounts: IDL.Vec(IDL.Record({ name: IDL.Text, numb: IDL.Text })),
    symbol: IDL.Text,
  });
  const ContactDocument = IDL.Record({
    principal: IDL.Text,
    deleted: IDL.Bool,
    name: IDL.Text,
    assets: IDL.Vec(
      IDL.Record({
        subaccounts: IDL.Vec(IDL.Record({ name: IDL.Text, subaccount_index: IDL.Text })),
        logo: IDL.Opt(IDL.Text),
        tokenSymbol: IDL.Text,
        symbol: IDL.Text,
      }),
    ),
    updatedAt: IDL.Nat32,
    accountIdentier: IDL.Opt(IDL.Text),
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
