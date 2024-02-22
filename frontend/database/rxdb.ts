import { IWalletDatabase } from "@/database/i-wallet-database";
import { Token } from "@redux/models/TokenModels";
import { Contact } from "@redux/models/ContactsModels";
import { addRxPlugin, createRxDatabase, RxCollection, RxDocument, RxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBMigrationPlugin } from "rxdb/plugins/migration";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { AnonymousIdentity, HttpAgent, Identity } from "@dfinity/agent";
import { createActor } from "@/database/candid";
import { RxReplicationState } from "rxdb/plugins/replication";
import DBSchemas from "./schemas.json";
import { BehaviorSubject, combineLatest, distinctUntilChanged, from, map, Observable, Subject, switchMap } from "rxjs";
import { extractValueFromArray, setupReplication } from "./helpers";
import { defaultTokens } from "@/defaultTokens";

addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBDevModePlugin);

type TokenRxdbDocument = Token & { updatedAt: number; deleted: boolean };
type ContactRxdbDocument = Contact & { updatedAt: number; deleted: boolean };

export class RxdbDatabase extends IWalletDatabase {
  // Singleton pattern
  private static _instance: RxdbDatabase | undefined;
  public static get instance(): RxdbDatabase {
    if (!this._instance) {
      this._instance = new RxdbDatabase();
    }
    return this._instance!;
  }

  private principalId = "";
  private identity: Identity = new AnonymousIdentity();
  private identityChanged$: Subject<void> = new Subject<void>();
  private readonly agent = new HttpAgent({ identity: this.identity, host: import.meta.env.VITE_DB_CANISTER_HOST });
  private readonly replicaCanister = createActor(import.meta.env.VITE_DB_CANISTER_ID, { agent: this.agent });

  private _tokens!: RxCollection<TokenRxdbDocument> | null;
  private tokensReplicationState?: RxReplicationState<any, any>;
  private tokensPullInterval?: any;
  private _contacts!: RxCollection<ContactRxdbDocument> | null;
  private contactsReplicationState?: RxReplicationState<any, any>;
  private contactsPullInterval?: any;

  private pullingTokens$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pushingTokens$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pullingContacts$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pushingContacts$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  protected get tokens(): Promise<RxCollection<TokenRxdbDocument> | null> {
    if (this._tokens) return Promise.resolve(this._tokens);
    return this.init().then(() => this._tokens);
  }

  protected get contacts(): Promise<RxCollection<ContactRxdbDocument> | null> {
    if (this._contacts) return Promise.resolve(this._contacts);
    return this.init().then(() => this._contacts);
  }

  /**
   * Initialice all necessary external systema and
   * data structure before first use.
   */
  async init(): Promise<void> {
    try {
      if (
        import.meta.env.VITE_DB_CANISTER_HOST!.includes("localhost") ||
        import.meta.env.VITE_DB_CANISTER_HOST!.includes("127.0.0.1")
      ) {
        await this.agent.fetchRootKey();
      }

      const db: RxDatabase = await createRxDatabase({
        name: `local_db_${this.principalId}`,
        storage: getRxStorageDexie(),
        ignoreDuplicate: true,
        eventReduce: true,
        cleanupPolicy: {},
      });

      const { tokens, contacts } = await db.addCollections(DBSchemas);

      const tokensReplication = await setupReplication<TokenRxdbDocument, string>(
        tokens,
        `tokens-${this.principalId}`,
        "address",
        (items) => this._tokensPushHandler(items),
        (minTimestamp, lastId, batchSize) => this._tokensPullHandler(minTimestamp, lastId, batchSize),
      );

      [this.tokensReplicationState, this.tokensPullInterval, this.pushingTokens$, this.pullingTokens$] =
        tokensReplication;

      const contactsReplication = await setupReplication<ContactRxdbDocument, string>(
        contacts,
        `contacts-${this.principalId}`,
        "principal",
        (items) => this._contactsPushHandler(items),
        (minTimestamp, lastId, batchSize) => this._contactsPullHandler(minTimestamp, lastId, batchSize),
      );

      [this.contactsReplicationState, this.contactsPullInterval, this.pushingContacts$, this.pullingContacts$] =
        contactsReplication;

      this._tokens = tokens;
      this._contacts = contacts;
    } catch (e) {
      console.error("RxDb Init:", e);
    }
  }

  /**
   * Set Identity object or fixed Principal ID
   * as current active agent.
   * @param identity Identity object
   * @param principalId Principal ID
   */
  async setIdentity(identity: Identity | null): Promise<void> {
    this._invalidateDb();
    this.identity = identity || new AnonymousIdentity();
    this.agent.replaceIdentity(this.identity);
    this.principalId = this.identity.getPrincipal().toString();

    // Don't allow watch-only mode to use the DB
    if (!this.identity.getPrincipal().isAnonymous()) {
      await this.init();
      await this._doesRecordByPrincipalExist();
    }

    this.identityChanged$.next();
  }

  /**
   * Get a Token object by its ID.
   * @param address Address ID of a Token object
   * @returns Token object or NULL if not found
   */
  async getToken(address: string): Promise<Token | null> {
    try {
      const doc = await (await this.tokens)?.findOne(address).exec();
      return (doc && this._mapTokenDoc(doc)) || null;
    } catch (e) {
      console.error("RxDb GetToken:", e);
      return null;
    }
  }

  /**
   * Get all Token objects from the active agent.
   * @returns Array of found Token objects or an empty
   * array if no Token objects were found
   */
  async getTokens(): Promise<Token[]> {
    try {
      const documents = await (await this.tokens)?.find().exec();
      return (documents && documents.map(this._mapTokenDoc)) || [];
    } catch (e) {
      console.error("RxDb GetTokens:", e);
      return [];
    }
  }

  /**
   * Add a new Token object to the list of Token objects
   * current active agent has.
   * @param token Token object to be added
   */
  async addToken(token: Token): Promise<void> {
    try {
      await (
        await this.tokens
      )?.insert({
        ...token,
        logo: extractValueFromArray(token.logo),
        index: extractValueFromArray(token.index),
        deleted: false,
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.error("RxDb AddToken:", e);
    }
  }

  /**
   * Find a Token object by its ID and replace it with
   * another Token object with the date of update.
   * @param address Address ID of a Token object
   * @param newDoc Token object
   */
  async updateToken(address: string, newDoc: Token): Promise<void> {
    try {
      const document = await (await this.tokens)?.findOne(address).exec();
      await document?.patch({
        ...newDoc,
        logo: extractValueFromArray(newDoc.logo),
        index: extractValueFromArray(newDoc.index),
        deleted: false,
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.error("RxDb UpdateToken:", e);
    }
  }

  /**
   * Find and remove a Token object by its ID.
   * @param address Address ID of a Token object
   */
  async deleteToken(address: string): Promise<void> {
    try {
      const document = await (await this.tokens)?.findOne(address).exec();
      document?.remove();
    } catch (e) {
      console.error("RxDb DeleteToken", e);
    }
  }

  /**
   * Find a Contact object by its Principal ID.
   * @param principal Princial ID
   * @returns Contact object or NULL if not found
   */
  async getContact(principal: string): Promise<Contact | null> {
    try {
      const document = await (await this.contacts)?.findOne(principal).exec();
      return (document && this._mapContactDoc(document)) || null;
    } catch (e) {
      console.error("RxDb GetContact", e);
      return null;
    }
  }

  /**
   * Get all Contact objects from active agent.
   * @returns Array of found Contact objects or an empty
   * array if no Contact object were found
   */
  async getContacts(): Promise<Contact[]> {
    try {
      const documents = await (await this.contacts)?.find().exec();
      return (documents && documents.map(this._mapContactDoc)) || [];
    } catch (e) {
      console.error("RxDb GetContacts", e);
      return [];
    }
  }

  /**
   * Add a new Contact object to the list of Contact objects
   * current active agent has.
   * @param contact Contact object to be added
   */
  async addContact(contact: Contact): Promise<void> {
    try {
      await (
        await this.contacts
      )?.insert({
        ...contact,
        accountIdentier: extractValueFromArray(contact.accountIdentier),
        assets: contact.assets.map((a) => ({
          ...a,
          logo: extractValueFromArray(a.logo),
        })),
        deleted: false,
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.error("RxDb AddContact", e);
    }
  }

  /**
   * Find a Contact object by its Principal ID and replace it
   * with another Contact object with the date of update.
   * @param principal Principal ID
   * @param newDoc Contact object
   */
  async updateContact(principal: string, newDoc: Contact): Promise<void> {
    try {
      const document = await (await this.contacts)?.findOne(principal).exec();
      document?.patch({
        ...newDoc,
        accountIdentier: extractValueFromArray(newDoc.accountIdentier),
        assets: newDoc.assets.map((a) => ({
          ...a,
          logo: extractValueFromArray(a.logo),
        })),
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.error("RxDb UpdateContact", e);
    }
  }

  /**
   * Find and remove a Contact object by its Principal ID.
   * @param principal Principal ID
   */
  async deleteContact(principal: string): Promise<void> {
    try {
      const document = await (await this.contacts)?.findOne(principal).exec();
      document?.remove();
    } catch (e) {
      console.error("RxDb DeleteContact", e);
    }
  }

  /**
   * Observable that trigger after
   * a new Identity has been set.
   * @returns Array of Contact objects from current
   * active agent
   */
  subscribeToAllContacts(): Observable<Contact[]> {
    return this.identityChanged$.pipe(
      switchMap(() => from(this.contacts)),
      switchMap((collection) => collection?.find().$ || []),
      map((x: any) => x.map(this._mapContactDoc)),
    );
  }

  /**
   * Observable that triggers after a new Identity has been set.
   * @returns Array of Token objects from current
   * active agent
   */
  subscribeToAllTokens(): Observable<Token[]> {
    return this.identityChanged$.pipe(
      switchMap(() => from(this.tokens)),
      switchMap((collection) => collection?.find().$ || []),
      map((x: any) => x.map(this._mapTokenDoc)),
    );
  }

  /**
   * Obserbable that triggers after documents were pulled from the DB.
   * @returns Array of Tokens and Contacts objects pulled from the DB
   */
  subscribeOnPulling(): Observable<boolean> {
    return combineLatest([this.pullingTokens$, this.pullingContacts$]).pipe(
      map(([a, b]) => a || b),
      distinctUntilChanged(),
    );
  }

  /**
   * Observable that triggers after documents where pushed to the DB.
   * @returns Array of Tokens and Contacts objects just pushed
   * to the DB
   */
  subscribeOnPushing(): Observable<boolean> {
    return combineLatest([this.pushingTokens$, this.pushingContacts$]).pipe(
      map(([a, b]) => a || b),
      distinctUntilChanged(),
    );
  }

  private _mapContactDoc(doc: RxDocument<ContactRxdbDocument>): Contact {
    return {
      name: doc.name,
      principal: doc.principal,
      accountIdentier: doc.accountIdentier,
      assets: doc.assets,
    };
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
      fee: doc.fee,
      tokenName: doc.tokenName,
      tokenSymbol: doc.tokenSymbol,
      shortDecimal: doc.shortDecimal,
      supportedStandards: doc.supportedStandards,
    };
  }

  private _invalidateDb(): void {
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

  private async _tokensPushHandler(items: any[]): Promise<TokenRxdbDocument[]> {
    const arg = items.map((x) => ({
      ...x,
      id_number: x.id_number,
      updatedAt: Math.floor(Date.now() / 1000),
      logo: extractValueFromArray(x.logo),
      index: extractValueFromArray(x.index),
    }));

    await this.replicaCanister?.pushTokens(arg);

    return arg;
  }

  private async _tokensPullHandler(
    minTimestamp: number,
    lastId: string | null,
    batchSize: number,
  ): Promise<TokenRxdbDocument[]> {
    const raw = (await this.replicaCanister?.pullTokens(
      minTimestamp,
      lastId ? [lastId] : [],
      BigInt(batchSize),
    )) as TokenRxdbDocument[];

    return raw.map((x) => ({
      ...x,
      id_number: Number(x.id_number),
    }));
  }

  private async _contactsPushHandler(items: any): Promise<ContactRxdbDocument[]> {
    const arg = items.map((x: any) => ({
      ...x,
      updatedAt: Math.floor(Date.now() / 1000),
      accountIdentier: extractValueFromArray(x.accountIdentier),
      assets: x.assets.map((a: any) => ({
        ...a,
        logo: extractValueFromArray(a.logo),
        subaccounts: a.subaccounts.map((s: any) => ({
          ...s,
          allowance:
            !!s.allowance && !!s.allowance.allowance
              ? [
                  {
                    allowance: [s.allowance.allowance],
                    expires_at: [s.allowance.expires_at],
                  },
                ]
              : [],
        })),
      })),
    }));

    await this.replicaCanister?.pushContacts(arg);

    return arg;
  }

  private async _contactsPullHandler(
    minTimestamp: number,
    lastId: string | null,
    batchSize: number,
  ): Promise<ContactRxdbDocument[]> {
    const raw = (await this.replicaCanister?.pullContacts(
      minTimestamp,
      lastId ? [lastId] : [],
      BigInt(batchSize),
    )) as ContactRxdbDocument[];

    return raw;
  }

  private async _doesRecordByPrincipalExist() {
    // Look for entry record by current prinicpal ID
    const exist: boolean = await this.replicaCanister?.doesStorageExist();

    // If does not exist it means that this is a brand new account
    if (!exist) {
      try {
        await (
          await this.tokens
        )?.bulkInsert(
          defaultTokens.map((dT) => ({
            ...dT,
            deleted: false,
            updatedAt: Date.now(),
          })),
        );
      } catch (e) {
        console.error("RxDb AddToken:", e);
      }
    }
  }
}
