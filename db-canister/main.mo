import AssocList "mo:base/AssocList";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";
import Bool "mo:base/Bool";
import Vector "mo:vector";

import DB "db";

actor class WalletDatabase() {

  type StableStorage<Token, Contact> = AssocList.AssocList<Principal, (DB.DbInit<Token, Text>, DB.DbInit<Contact, Text>)>;
  type TokenDocument_v0 = {
    id_number : Nat32;
    updatedAt : Nat32;
    deleted : Bool;
    address : Text;
    symbol : Text;
    name : Text;
    tokenName : Text;
    tokenSymbol : Text;
    decimal : Text;
    shortDecimal : Text;
    subAccounts : [{
      numb : Text;
      name : Text;
      amount : Text;
      currency_amount : Text;
    }];
    fee : Text;
    index : Text;
    logo : Text;
    supportedStandards : [Text];
  };
  type ContactDocument_v0 = {
    name : Text;
    updatedAt : Nat32;
    deleted : Bool;
    principal : Text;
    accountIdentier : Text;
    assets : [{
      symbol : Text;
      tokenSymbol : Text;
      logo : Text;
      subaccounts : [{
        name : Text;
        subaccount_index : Text;
        sub_account_id : Text;
        allowance : ?{
          allowance : Text;
          expires_at : Text;
        };
      }];
      address : Text;
      decimal : Text;
      shortDecimal : Text;
      supportedStandards : [Text];
    }];
  };

  stable var storage_v0 : StableStorage<TokenDocument_v0, ContactDocument_v0> = null;
  // example how to migrate schema to next version. Uncomment, implement cast functions, replace types below and use new stable var storage_vX everywhere instead of old storage_v0.
  // after initial upgrade v0 stable variable can be deleted
  // Note that it was written before refactoring primary keys, so should be updated accordingly
  // stable var storage_v1 : StableStorage<TokenDocument_v1, ContactDocument_v1> = (
  //   func migrateV1() : StableStorage<TokenDocument_v1, ContactDocument_v1> {
  //     let castToken = func(item : TokenDocument_v0) : TokenDocument_v1 = item;
  //     let castContact = func(item : ContactDocument_v0) : ContactDocument_v1 = item;
  //     let res = List.map<(Principal, (DB.DbInit<TokenDocument_v1>, DB.DbInit<ContactDocument_v1>)), (Principal, (DB.DbInit<TokenDocument_v1>, DB.DbInit<ContactDocument_v1>))>(
  //       storage_v0,
  //       func((p, (x, y))) = (p, (DB.migrate(x, castToken), DB.migrate(y, castContact))),
  //     );
  //     storage_v0 := null;
  //     res;
  //   }
  // )();

  // update these when migrating database
  type TokenDocument = TokenDocument_v0;
  type ContactDocument = ContactDocument_v0;

  var databasesCache : AssocList.AssocList<Principal, (DB.DbUse<TokenDocument, Text>, DB.DbUse<ContactDocument, Text>)> = null;

  private func getDatabase(owner : Principal, notFoundStrategy : { #create; #returnNull }) : ?(DB.DbUse<TokenDocument, Text>, DB.DbUse<ContactDocument, Text>) {
    switch (AssocList.find(databasesCache, owner, Principal.equal)) {
      case (?db) ?db;
      case (null) {
        let (tInit, cInit) = switch (AssocList.find(storage_v0, owner, Principal.equal)) {
          case (?store) store;
          case (null) {
            switch (notFoundStrategy) {
              case (#returnNull) return null;
              case (#create) {
                let store = (DB.empty<TokenDocument, Text>(), DB.empty<ContactDocument, Text>());
                let (upd, _) = AssocList.replace(storage_v0, owner, Principal.equal, ?store);
                storage_v0 := upd;
                store;
              };
            };
          };
        };
        let db = (
          DB.use<TokenDocument, Text>(tInit, func(x) = x.address, Text.compare, func(x) = x.updatedAt),
          DB.use<ContactDocument, Text>(cInit, func(x) = x.principal, Text.compare, func(x) = x.updatedAt),
        );
        let (upd, _) = AssocList.replace(databasesCache, owner, Principal.equal, ?db);
        databasesCache := upd;
        ?db;
      };
    };
  };

  public shared ({ caller }) func pushTokens(docs : [TokenDocument]) : async [TokenDocument] {
    let ?(tdb, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(tdb, docs);
  };

  public shared ({ caller }) func pushContacts(docs : [ContactDocument]) : async [ContactDocument] {
    let ?(_, cdb) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(cdb, docs);
  };

  public shared query ({ caller }) func pullTokens(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [TokenDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(tdb, _)) DB.getLatest(tdb, updatedAt, lastId, limit);
      case (null) [];
    };
  };

  public shared query ({ caller }) func pullContacts(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [ContactDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, cdb)) DB.getLatest(cdb, updatedAt, lastId, limit);
      case (null) [];
    };
  };

  public shared query ({ caller }) func dump() : async [(Principal, ([?TokenDocument], [?ContactDocument]))] {
    Iter.toArray<(Principal, ([?TokenDocument], [?ContactDocument]))>(
      Iter.map<(Principal, (DB.DbInit<TokenDocument, Text>, DB.DbInit<ContactDocument, Text>)), (Principal, ([?TokenDocument], [?ContactDocument]))>(
        List.toIter(storage_v0),
        func((p, (t, c))) = (p, (Vector.toArray<?TokenDocument>(t.db.vec), Vector.toArray<?ContactDocument>(c.db.vec))),
      )
    );
  };

  public shared query ({ caller }) func doesStorageExist() : async Bool {
    switch (AssocList.find(databasesCache, caller, Principal.equal)) {
      case (?db) true;
      case (null) false;
    };
  };

};
