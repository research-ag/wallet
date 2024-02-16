import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Vector "mo:vector";

import BTree "mo:stableheapbtreemap/BTree";
import IDX "mo:rxmodb/index";
import PK "mo:rxmodb/primarykey";
import RXMDB "mo:rxmodb";

module RxDbTable {

  public func migrate<T1, PK1, T2, PK2>(src : DbInit<T1, PK1>, cast : (x : T1) -> T2, castPk : (x : PK1) -> PK2) : DbInit<T2, PK2> {
    func castData(data : BTree.Data<PK1, Nat>) : BTree.Data<PK2, Nat> = {
      var count = data.count;
      kvs = Array.tabulateVar<?(PK2, Nat)>(
        data.kvs.size(),
        func(n) = switch (data.kvs[n]) { case (null) { null }; case (?k) { ?(castPk(k.0), k.1) } },
      );
    };
    func castIndexNodeRecv(node : BTree.Node<PK1, Nat>) : BTree.Node<PK2, Nat> = switch (node) {
      case (#leaf x) #leaf({ data = castData(x.data) });
      case (#internal x) #internal({
        children = Array.tabulateVar<?BTree.Node<PK2, Nat>>(
          x.children.size(),
          func(n) = switch (x.children[n]) {
            case (null) { null };
            case (?k) { ?castIndexNodeRecv(k) };
          },
        );
        data = castData(x.data);
      });
    };
    {
      db = {
        var reuse_queue = src.db.reuse_queue;
        vec = Vector.map<?T1, ?T2>(
          src.db.vec,
          func(x) = switch (x) {
            case (?item) ?cast(item);
            case (null) null;
          },
        );
      };
      pk = {
        order = src.pk.order;
        var size = src.pk.size;
        var root = castIndexNodeRecv(src.pk.root);
      };
      updatedAt = src.updatedAt;
    };
  };

  public type DbInit<T, PK> = {
    db : RXMDB.RXMDB<T>;
    pk : PK.Init<PK>;
    updatedAt : IDX.Init<Nat64>;
  };

  public type DbUse<T, PK> = {
    db : RXMDB.Use<T>;
    pk : PK.Use<PK, T>;
    updatedAt : IDX.Use<Nat64, T>;
  };

  public func empty<T, PK>() : DbInit<T, PK> = {
    db = RXMDB.init<T>();
    pk = PK.init<PK>(?32);
    updatedAt = IDX.init<Nat64>(?32);
  };

  public func use<T, PK>(
    init : DbInit<T, PK>,
    pkGet : (item : T) -> PK,
    pkCompare : (pk1 : PK, pk2 : PK) -> { #less; #equal; #greater },
    updatedAtGet : (item : T) -> Nat32,
  ) : DbUse<T, PK> {
    let obs = RXMDB.init_obs<T>();
    // PK
    let pk_config : PK.Config<PK, T> = {
      db = init.db;
      obs;
      store = init.pk;
      compare = pkCompare;
      key = pkGet;
      regenerate = #no;
    };
    PK.Subscribe<PK, T>(pk_config);

    let updatedAt_config : IDX.Config<Nat64, T> = {
      db = init.db;
      obs;
      store = init.updatedAt;
      compare = Nat64.compare;
      key = func(idx : Nat, d : T) = ?((Nat64.fromNat(Nat32.toNat(updatedAtGet(d))) << 32) | Nat64.fromNat(idx));
      regenerate = #no;
      keep = #all;
    };
    IDX.Subscribe(updatedAt_config);

    return {
      db = RXMDB.Use<T>(init.db, obs);
      pk = PK.Use(pk_config);
      updatedAt = IDX.Use(updatedAt_config);
    };
  };

  public func pushUpdates<T, PK>(use : DbUse<T, PK>, docs : [T]) : [T] {
    for (doc in docs.vals()) {
      use.db.insert(doc);
    };

    [];
  };

  public func getLatest<T, PK>(use : DbUse<T, PK>, updatedAt : Nat32, lastId : ?PK, limit : Nat) : [T] {
    let start : Nat64 = switch (lastId) {
      case (?id) {
        let ?idx = use.pk.getIdx(id) else Debug.trap("ID not found");
        (Nat64.fromNat(Nat32.toNat(updatedAt)) << 32) | Nat64.fromNat(idx);
      };
      case (null) Nat64.fromNat(Nat32.toNat(updatedAt)) << 32;
    };
    use.updatedAt.find(start, ^0, #bwd, limit);
  };

};
