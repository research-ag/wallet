import AssocList "mo:base/AssocList";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Vector "mo:vector";

import DB "db";

actor class WalletDatabase() {

  type StableStorage<Asset, Contact, Allowance> = AssocList.AssocList<Principal, (DB.DbInit<Asset, Text>, DB.DbInit<Contact, Text>, DB.DbInit<Allowance, Text>)>;

  type AssetDocument_v0 = {
    sortIndex : Nat32;
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
      name : Text;
      sub_account_id : Text;
      address : Text;
      amount : Text;
      currency_amount : Text;
      transaction_fee : Text;
      decimal : Nat32;
      symbol : Text;
    }];
    index : Text;
    logo : Text;
    supportedStandards : [Text];
  };

  type ContactDocument_v0 = {
    name : Text;
    principal : Text;
    accountIdentifier : Text;
    accounts : [{
      name : Text;
      subaccount : Text;
      subaccountId : Text;
      tokenSymbol : Text;
    }];
    updatedAt : Nat32;
    deleted : Bool;
  };

  type AllowanceDocument_v0 = {
    asset : {
      logo : Text;
      name : Text;
      symbol : Text;
      address : Text;
      decimal : Text;
      tokenName : Text;
      tokenSymbol : Text;
      supportedStandards : [Text];
    };
    id : Text;
    subAccountId : Text;
    spender : Text;
    updatedAt : Nat32;
    deleted : Bool;
  };

  stable var storage_v0 : StableStorage<AssetDocument_v0, ContactDocument_v0, AllowanceDocument_v0> = null;

  type AssetDocument = AssetDocument_v0;
  type ContactDocument = ContactDocument_v0;
  type AllowanceDocument = AllowanceDocument_v0;

  var databasesCache : AssocList.AssocList<Principal, (DB.DbUse<AssetDocument, Text>, DB.DbUse<ContactDocument, Text>, DB.DbUse<AllowanceDocument, Text>)> = null;

  private func getDatabase(owner : Principal, notFoundStrategy : { #create; #returnNull }) : ?(DB.DbUse<AssetDocument, Text>, DB.DbUse<ContactDocument, Text>, DB.DbUse<AllowanceDocument, Text>) {
    switch (AssocList.find(databasesCache, owner, Principal.equal)) {
      case (?db) ?db;
      case (null) {
        let (tInit, cInit, aInit) = switch (AssocList.find(storage_v0, owner, Principal.equal)) {
          case (?store) store;
          case (null) {
            switch (notFoundStrategy) {
              case (#returnNull) return null;
              case (#create) {
                let store = (DB.empty<AssetDocument, Text>(), DB.empty<ContactDocument, Text>(), DB.empty<AllowanceDocument, Text>());
                let (upd, _) = AssocList.replace(storage_v0, owner, Principal.equal, ?store);
                storage_v0 := upd;
                store;
              };
            };
          };
        };
        let db = (
          DB.use<AssetDocument, Text>(tInit, func(x) = x.address, Text.compare, func(x) = x.updatedAt),
          DB.use<ContactDocument, Text>(cInit, func(x) = x.principal, Text.compare, func(x) = x.updatedAt),
          DB.use<AllowanceDocument, Text>(aInit, func(x) = x.id, Text.compare, func(x) = x.updatedAt),
        );
        let (upd, _) = AssocList.replace(databasesCache, owner, Principal.equal, ?db);
        databasesCache := upd;
        ?db;
      };
    };
  };

  public shared ({ caller }) func pushAssets(docs : [AssetDocument]) : async [AssetDocument] {
    let ?(tdb, _, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(tdb, docs);
  };

  public shared ({ caller }) func pushContacts(docs : [ContactDocument]) : async [ContactDocument] {
    let ?(_, cdb, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(cdb, docs);
  };

  public shared ({ caller }) func pushAllowances(docs : [AllowanceDocument]) : async [AllowanceDocument] {
    let ?(_, _, adb) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(adb, docs);
  };

  public shared query ({ caller }) func pullAssets(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [AssetDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(tdb, _, _)) DB.getLatest(tdb, updatedAt, lastId, limit);
      case (null) [];
    };
  };

  public shared query ({ caller }) func pullContacts(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [ContactDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, cdb, _)) DB.getLatest(cdb, updatedAt, lastId, limit);
      case (null) [];
    };
  };

  public shared query ({ caller }) func pullAllowances(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [AllowanceDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, _, adb)) DB.getLatest(adb, updatedAt, lastId, limit);
      case (null) [];
    };
  };

  public shared query ({ caller }) func dump() : async [(Principal, ([?AssetDocument], [?ContactDocument], [?AllowanceDocument]))] {
    Iter.toArray<(Principal, ([?AssetDocument], [?ContactDocument], [?AllowanceDocument]))>(
      Iter.map<(Principal, (DB.DbInit<AssetDocument, Text>, DB.DbInit<ContactDocument, Text>, DB.DbInit<AllowanceDocument, Text>)), (Principal, ([?AssetDocument], [?ContactDocument], [?AllowanceDocument]))>(
        List.toIter(storage_v0),
        func((p, (t, c, a))) = (p, (Vector.toArray<?AssetDocument>(t.db.vec), Vector.toArray<?ContactDocument>(c.db.vec), Vector.toArray<?AllowanceDocument>(a.db.vec))),
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
