import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface ContactDocument {
  'principal' : string,
  'deleted' : boolean,
  'name' : string,
  'assets' : Array<
    {
      'subaccounts' : Array<{ 'name' : string, 'subaccount_index' : string }>,
      'logo' : [] | [string],
      'tokenSymbol' : string,
      'symbol' : string,
    }
  >,
  'updatedAt' : number,
  'accountIdentier' : [] | [string],
}
export interface TokenDocument {
  'id' : string,
  'deleted' : boolean,
  'logo' : [] | [string],
  'name' : string,
  'updatedAt' : number,
  'address' : string,
  'index' : [] | [string],
  'decimal' : string,
  'id_number' : bigint,
  'subAccounts' : Array<{ 'name' : string, 'numb' : string }>,
  'symbol' : string,
}
export interface WalletDatabase {
  'dump' : ActorMethod<
    [],
    Array<
      [Principal, [Array<[] | [TokenDocument]>, Array<[] | [ContactDocument]>]]
    >
  >,
  'pullContacts' : ActorMethod<
    [number, [] | [string], bigint],
    Array<ContactDocument>
  >,
  'pullTokens' : ActorMethod<
    [number, [] | [string], bigint],
    Array<TokenDocument>
  >,
  'pushContacts' : ActorMethod<
    [Array<ContactDocument>],
    Array<ContactDocument>
  >,
  'pushTokens' : ActorMethod<[Array<TokenDocument>], Array<TokenDocument>>,
}
export interface _SERVICE extends WalletDatabase {}
