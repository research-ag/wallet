import { IWalletDatabase } from "@/database/i-wallet-database";
import { Token } from "@redux/models/TokenModels";
import { Contact } from "@redux/models/ContactsModels";
import { addRxPlugin, createRxDatabase, lastOfArray, RxCollection, RxDocument } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBMigrationPlugin } from "rxdb/plugins/migration";
import { Ed25519KeyIdentity } from "@dfinity/identity";

import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { AnonymousIdentity, HttpAgent, Identity } from "@dfinity/agent";
import { createActor } from "@/database/candid";
import { replicateRxCollection, RxReplicationState } from "rxdb/plugins/replication";
import { BehaviorSubject, combineLatest, distinctUntilChanged, from, map, Observable, Subject, switchMap } from "rxjs";

addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBDevModePlugin);

type TokenRxdbDocument = Token & { id: string, updatedAt: number, deleted: boolean };
type ContactRxdbDocument = Contact & { updatedAt: number, deleted: boolean };

const setupReplication: <T extends { updatedAt: number, deleted: boolean }, PK>(
  collection: RxCollection<T>,
  replicationIdentifier: string,
  primaryKey: keyof T,
  pushFunc: (items: T[]) => Promise<void>,
  pullFunc: (minTimestamp: number, lastId: PK | null, batchSize: number) => Promise<T[]>,
) => [
  RxReplicationState<any, any>,
  number,
  BehaviorSubject<boolean>,
  BehaviorSubject<boolean>
] = <T extends { updatedAt: number, deleted: boolean }, PK>(
  collection: RxCollection<T>,
  replicationIdentifier: string,
  primaryKey: keyof T,
  pushFunc: (items: T[]) => Promise<void>,
  pullFunc: (minTimestamp: number, lastId: PK | null, batchSize: number) => Promise<T[]>,
) => {
  const pushing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  const pulling$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  const tokensReplicationState = replicateRxCollection({
    collection,
    replicationIdentifier,
    retryTime: 5 * 1000,
    autoStart: false,
    deletedField: "deleted",
    push: {
      handler: async (docs): Promise<any> => {
        pushing$.next(true);
        let store: T[] = docs.map(x => x.newDocumentState) as any;
        try {
          console.debug(replicationIdentifier + " replica push", store);
          await pushFunc(store);
          pushing$.next(false);
        } catch (err) {
          pushing$.next(false);
          console.error(err);
          throw err;
        }
      },
      batchSize: 100,
      modifier: (d) => d,
    },
    pull: {
      handler: async (lastCheckpoint: any, batchSize): Promise<any> => {
        pulling$.next(true);
        try {
          const documentsFromRemote = await pullFunc(lastCheckpoint ? lastCheckpoint.updatedAt : 0, lastCheckpoint?.id, batchSize);
          console.debug(replicationIdentifier + " replica pull", documentsFromRemote);
          pulling$.next(false);
          return {
            documents: documentsFromRemote,
            checkpoint:
              documentsFromRemote.length === 0
                ? lastCheckpoint
                : {
                  id: lastOfArray(documentsFromRemote)![primaryKey],
                  updatedAt: lastOfArray(documentsFromRemote)!.updatedAt,
                },
          };
        } catch (err) {
          pulling$.next(false);
          console.error(err);
          throw err;
        }
      },
      batchSize: 1000,
      modifier: (d) => d,
    },
  });
  tokensReplicationState.start().then();
  return [
    tokensReplicationState,
    setInterval(() => tokensReplicationState.reSync(), 15000),
    pushing$,
    pulling$,
  ];
};

export class RxdbDatabase extends IWalletDatabase {
  private static _instance: RxdbDatabase | undefined;
  public static get instance(): RxdbDatabase {
    if (!this._instance) {
      this._instance = new RxdbDatabase();
    }
    return this._instance!;
  }

  private identity: Identity = new AnonymousIdentity();
  private identityChanged$: Subject<void> = new Subject<void>();
  private readonly agent = new HttpAgent({ identity: this.identity, host: import.meta.env.VITE_DB_CANISTER_HOST });
  private readonly replicaCanister = createActor(import.meta.env.VITE_DB_CANISTER_ID, { agent: this.agent });

  private _tokens!: RxCollection<TokenRxdbDocument>;
  private tokensReplicationState?: RxReplicationState<any, any>;
  private tokensPullInterval?: any;
  private _contacts!: RxCollection<ContactRxdbDocument>;
  private contactsReplicationState?: RxReplicationState<any, any>;
  private contactsPullInterval?: any;

  private pullingTokens$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pushingTokens$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pullingContacts$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pushingContacts$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  protected get tokens(): Promise<RxCollection<TokenRxdbDocument>> {
    if (this._tokens) return Promise.resolve(this._tokens);
    return this.init().then(() => this._tokens);
  }

  protected get contacts(): Promise<RxCollection<ContactRxdbDocument>> {
    if (this._contacts) return Promise.resolve(this._contacts);
    return this.init().then(() => this._contacts);
  }

  subscribeOnPulling(): Observable<boolean> {
    return combineLatest([this.pullingTokens$, this.pullingContacts$]).pipe(map(([a, b]) => a || b), distinctUntilChanged());
  }

  subscribeOnPushing(): Observable<boolean> {
    return combineLatest([this.pushingTokens$, this.pushingContacts$]).pipe(map(([a, b]) => a || b), distinctUntilChanged());
  }

  setIdentity(identity: Identity | null): void {
    this.invalidateDb();
    this.identity = identity || new AnonymousIdentity();
    this.agent.replaceIdentity(identity || new AnonymousIdentity());
  }

  private _mapTokenDoc(doc: RxDocument<TokenRxdbDocument>): Token {
    return {
      name: doc.name,
      id_number: doc.id_number,
      address: doc.address,
      logo: doc.logo,
      decimal: doc.decimal,
      symbol: doc.symbol,
      index: doc.index,
      subAccounts: doc.subAccounts,
    };
  }

  async getToken(id_number: number): Promise<Token | null> {
    const doc = await (await this.tokens).findOne("" + id_number).exec();
    return doc && this._mapTokenDoc(doc);
  }

  async getTokens(): Promise<Token[]> {
    const documents = await (await this.tokens).find().exec();
    return documents.map(this._mapTokenDoc);
  }

  subscribeToAllTokens(): Observable<Token[]> {
    return this.identityChanged$.pipe(
      switchMap(() => from(this.tokens)),
      switchMap(collection => collection.find().$),
      map(x => x.map(this._mapTokenDoc)),
    );
  }

  async addToken(token: Token): Promise<void> {
    await (await this.tokens).insert({
      ...token,
      id: "" + token.id_number,
      deleted: false,
      updatedAt: Date.now(),
    });
  }

  async updateToken(id_number: number, newDoc: Token): Promise<void> {
    await (await this.tokens).findOne("" + id_number).update({
      ...newDoc,
      updatedAt: Date.now(),
    });
  }

  async setTokens(allTokens: Token[]): Promise<void> {
    console.warn("using setTokens function to overwrite all tokens in DB at once is discouraged");
    await (await this.tokens).bulkRemove(((await this.getTokens()) || []).map(x => "" + x.id_number));
    await (await this.tokens).bulkInsert(allTokens.map(d => ({
      ...d,
      id: "" + d.id_number,
      deleted: false,
      updatedAt: Date.now(),
    })));
  }

  private _mapContactDoc(doc: RxDocument<ContactRxdbDocument>): Contact {
    return {
      name: doc.name,
      principal: doc.principal,
      accountIdentier: doc.accountIdentier,
      assets: doc.assets,
    };
  }

  async getContact(principal: string): Promise<Contact | null> {
    const doc = await (await this.contacts).findOne(principal).exec();
    return doc && this._mapContactDoc(doc);
  }

  async getContacts(): Promise<Contact[]> {
    const documents = await (await this.contacts).find().exec();
    return documents.map(this._mapContactDoc);
  }

  subscribeToAllContacts(): Observable<Contact[]> {
    return this.identityChanged$.pipe(
      switchMap(() => from(this.contacts)),
      switchMap(collection => collection.find().$),
      map(x => x.map(this._mapContactDoc)),
    );
  }

  async addContact(contact: Contact): Promise<void> {
    await (await this.contacts).insert({
      ...contact,
      deleted: false,
      updatedAt: Date.now(),
    });
  }

  async updateContact(principal: string, newDoc: Contact): Promise<void> {
    await (await this.contacts).findOne(principal).update({
      ...newDoc,
      updatedAt: Date.now(),
    });
  }

  async deleteContact(principal: string): Promise<void> {
    await (await this.contacts).findOne(principal).remove();
  }

  async init(): Promise<void> {
    if (import.meta.env.VITE_DB_CANISTER_HOST!.includes("localhost") || import.meta.env.VITE_DB_CANISTER_HOST!.includes("127.0.0.1")) {
      await this.agent.fetchRootKey();
    }
    const db = await createRxDatabase({
      name: "local_db_" + this.identity.getPrincipal().toText(),
      storage: getRxStorageDexie(),
      ignoreDuplicate: true,
      multiInstance: true,
      eventReduce: true,
      cleanupPolicy: {},
    });
    const { tokens, contacts } = await db.addCollections({
      tokens: {
        schema: {
          type: "object",
          version: 0,
          primaryKey: "id",
          properties: {
            id: { type: "string", maxLength: 32 },
            id_number: { type: "number" },
            address: { type: "string", maxLength: 100 },
            symbol: { type: "string", maxLength: 100 },
            name: { type: "string", maxLength: 100 },
            decimal: { type: "string", maxLength: 100 },
            subAccounts: {
              type: "array",
              items: {
                type: "record",
                properties: {
                  numb: { type: "string" },
                  name: { type: "string" },
                },
                required: ["numb", "name"],
              },
            },
            index: { type: "string", maxLength: 100 },
            logo: { type: "string", maxLength: 100 },
          },
          required: ["id_number", "address", "symbol", "symbol", "name", "decimal", "subAccounts"],
          indexes: ["name"],
        },
        migrationStrategies: {},
      },
      contacts: {
        schema: {
          type: "object",
          version: 0,
          primaryKey: "principal",
          properties: {
            principal: { type: "string", maxLength: 100 },
            name: { type: "string", maxLength: 100 },
            accountIdentier: { type: "string", maxLength: 100 },
            assets: {
              type: "array",
              items: {
                type: "record",
                properties: {
                  symbol: { type: "string" },
                  tokenSymbol: { type: "string" },
                  logo: { type: "string" },
                  subaccounts: {
                    type: "record",
                    properties: {
                      name: { type: "string" },
                      subaccount_index: { type: "string" },
                    },
                    required: ["name", "subaccount_index"],
                  },
                },
                required: ["symbol", "tokenSymbol", "subaccounts"],
              },
            },
          },
          required: ["name", "assets"],
        },
        migrationStrategies: {},
      },
    });
    [this.tokensReplicationState, this.tokensPullInterval, this.pushingTokens$, this.pullingTokens$] =
      setupReplication<TokenRxdbDocument, string>(
        tokens,
        "tokens-" + this.identity.getPrincipal().toText(),
        "id",
        async (items) => {
          const arg = items.map(x => ({
            ...x,
            id_number: BigInt(x.id_number),
            updatedAt: Math.floor(Date.now() / 1000),
            logo: (x.logo ? [x.logo] : []) as [string] | [],
            index: (x.index ? [x.index] : []) as [string] | [],
          }));
          await this.replicaCanister.pushTokens(arg);
        },
        async (minTimestamp: number, lastId: string | null, batchSize: number) => {
          const raw = await this.replicaCanister.pullTokens(minTimestamp, lastId ? [lastId] : [], BigInt(batchSize));
          return raw.map(x => ({
            ...x,
            updatedAt: x.updatedAt,
            deleted: x.deleted,
            id_number: Number(x.id_number),
            logo: x.logo[0],
            index: x.index[0],
          }));
        },
      );
    [this.contactsReplicationState, this.contactsPullInterval, this.pushingContacts$, this.pullingContacts$] =
      setupReplication<ContactRxdbDocument, string>(
        contacts,
        "contacts-" + this.identity.getPrincipal().toText(),
        "name",
        async (items) => {
          const arg = items.map(x => ({
            ...x,
            updatedAt: Math.floor(Date.now() / 1000),
            deleted: x.deleted,
            assets: x.assets.map(a => ({
              ...a,
              logo: (a.logo ? [a.logo] : []) as ([string] | []),
            })),
            accountIdentier: (x.accountIdentier ? [x.accountIdentier] : []) as ([string] | []),
          }));
          await this.replicaCanister.pushContacts(arg);
        },
        async (minTimestamp: number, lastId: string | null, batchSize: number) => {
          const raw = await this.replicaCanister.pullContacts(minTimestamp, lastId ? [lastId] : [], BigInt(batchSize));
          const a: ContactRxdbDocument[] = raw.map(x => ({
            ...x,
            accountIdentier: x.accountIdentier[0],
            assets: x.assets.map(a => ({
              ...a,
              logo: a.logo[0],
            })),
          }));
          return a;
        },
      );
    this._tokens = tokens;
    this._contacts = contacts;
  }

  invalidateDb(): void {
    if (this.tokensPullInterval !== undefined) {
      clearInterval(this.tokensPullInterval);
      this.tokensPullInterval = undefined;
    }
    if (this.contactsPullInterval !== undefined) {
      clearInterval(this.contactsPullInterval);
      this.contactsPullInterval = undefined;
    }
    if (this.tokensReplicationState) {
      this.tokensReplicationState.cancel().then();
      this.tokensReplicationState = undefined;
    }
    if (this.contactsReplicationState) {
      this.contactsReplicationState.cancel().then();
      this.contactsReplicationState = undefined;
    }
    this._tokens = null!;
    this._contacts = null!;
  }

}
