import { DatabaseOptions, IWalletDatabase } from "@/database/i-wallet-database";
import { createRxDatabase, RxCollection, RxDocument, RxDatabase, addRxPlugin } from "rxdb";
import DBSchemas from "./schemas.json";
import { BehaviorSubject, combineLatest, distinctUntilChanged, from, map, Observable, Subject, switchMap } from "rxjs";
import { extractValueFromArray, setupReplication } from "./helpers";
import { defaultTokens } from "@/defaultTokens";
// rxdb plugins
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBMigrationPlugin } from "rxdb/plugins/migration";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { RxReplicationState } from "rxdb/plugins/replication";
// candid
import { AnonymousIdentity, HttpAgent, Identity } from "@dfinity/agent";
import { createActor } from "@/candid/database";
// types
import { Contact } from "@redux/models/ContactsModels";
import { TAllowance } from "@/@types/allowance";
import { SupportedStandardEnum } from "@/@types/icrc";
import {
  AssetDocument as AssetRxdbDocument,
  ContactDocument as ContactRxdbDocument,
  AllowanceDocument as AllowanceRxdbDocument,
} from "@/candid/database/db.did";
import { Asset } from "@redux/models/AccountModels";
import store from "@redux/Store";
import { setAssets } from "@redux/assets/AssetReducer";

// Enables data updates, deletions, and replacements within collections
addRxPlugin(RxDBUpdatePlugin);
// Facilitates schema evolution for future-proof databases
addRxPlugin(RxDBMigrationPlugin);
// Might be useful for debugging and development (disable for production)
addRxPlugin(RxDBDevModePlugin);

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
  private replicaCanister: any;

  private _assets!: RxCollection<AssetRxdbDocument> | null;
  private assetsReplicationState?: RxReplicationState<any, any>;
  private assetsPullInterval?: any;
  private _contacts!: RxCollection<ContactRxdbDocument> | null;
  private contactsReplicationState?: RxReplicationState<any, any>;
  private contactsPullInterval?: any;
  private _allowances!: RxCollection<AllowanceRxdbDocument> | null;
  private allowancesReplicationState?: RxReplicationState<any, any>;
  private allowancesPullInterval?: any;

  private pullingAssets$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pushingAssets$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pullingContacts$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pushingContacts$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pullingAllowances$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pushingAllowances$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  protected get assets(): Promise<RxCollection<AssetRxdbDocument> | null> {
    if (this._assets) return Promise.resolve(this._assets);
    return this.init().then(() => this._assets);
  }

  protected get contacts(): Promise<RxCollection<ContactRxdbDocument> | null> {
    if (this._contacts) return Promise.resolve(this._contacts);
    return this.init().then(() => this._contacts);
  }

  protected get allowances(): Promise<RxCollection<AllowanceRxdbDocument> | null> {
    if (this._allowances) return Promise.resolve(this._allowances);
    return this.init().then(() => this._allowances);
  }

  /**
   * Initialize the rxdb object, adding the collections and setting up the replication.
   * @returns Promise<void>
   * @throws Error
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
      });

      const { assets, contacts, allowances } = await db.addCollections(DBSchemas);

      const assetsReplication = await setupReplication<AssetRxdbDocument, string>(
        assets,
        `assets-${this.principalId}`,
        "address",
        (items) => this._assetsPushHandler(items),
        (minTimestamp, lastId, batchSize) => this._assetsPullHandler(minTimestamp, lastId, batchSize),
      );

      [this.assetsReplicationState, this.assetsPullInterval, this.pushingAssets$, this.pullingAssets$] =
        assetsReplication;

      const contactsReplication = await setupReplication<ContactRxdbDocument, string>(
        contacts,
        `contacts-${this.principalId}`,
        "principal",
        (items) => this._contactsPushHandler(items),
        (minTimestamp, lastId, batchSize) => this._contactsPullHandler(minTimestamp, lastId, batchSize),
      );

      [this.contactsReplicationState, this.contactsPullInterval, this.pushingContacts$, this.pullingContacts$] =
        contactsReplication;

      const allowancesReplication = await setupReplication<AllowanceRxdbDocument, string>(
        allowances,
        `allowances-${this.principalId}`,
        "id",
        (items) => this._allowancesPushHandler(items),
        (minTimestamp, lastId, batchSize) => this._allowancesPullHandler(minTimestamp, lastId, batchSize),
      );

      [this.allowancesReplicationState, this.allowancesPullInterval, this.pushingAllowances$, this.pullingAllowances$] =
        allowancesReplication;

      this._assets = assets;
      this._contacts = contacts;
      this._allowances = allowances;
    } catch (e) {
      console.error("RxDb Init:", e);
    }
  }

  /**
   * Set Identity object or fixed Principal ID
   * as current active agent.
   * @param identity Identity object
   * @param principalId Principal ID
   * @param fixedPrincipal Watch-only login Principal ID
   */
  async setIdentity(identity: Identity | null): Promise<void> {
    this._invalidateDb();
    this.identity = identity || new AnonymousIdentity();
    this.agent.replaceIdentity(this.identity);
    this.principalId = this.identity.getPrincipal().toString();

    // Don't allow watch-only mode to use the DB
    if (!this.identity.getPrincipal().isAnonymous()) {
      this.replicaCanister = createActor(this.getCustomDbCanisterId() || import.meta.env.VITE_DB_CANISTER_ID, {
        agent: this.agent,
      });
      await this.init();
      await this._doesRecordByPrincipalExist();
      await this._assetStateSync();
    }

    // INFO: run the observable
    // this.identityChanged$.next();
  }

  /**
   * Get a Asset object by its ID.
   * @param address Address ID of a Asset object
   * @returns Asset object or NULL if not found
   */
  async getAsset(address: string): Promise<Asset | null> {
    try {
      const doc = await (await this.assets)?.findOne(address).exec();
      return (doc && this._mapAssetDoc(doc)) || null;
    } catch (e) {
      console.error("RxDb GetAsset:", e);
      return null;
    }
  }

  /**
   * Get all Asset objects from the active agent.
   * @returns Array of found Asset objects or an empty
   * array if no Asset objects were found
   */
  async getAssets(): Promise<Asset[]> {
    try {
      const documents = await (await this.assets)?.find().exec();
      return (documents && documents.map(this._mapAssetDoc)) || [];
    } catch (e) {
      console.error("RxDb GetAssets:", e);
      return [];
    }
  }
  /**
   * Sync the Asset state with the Redux store.
   * @param newAssets Array of Asset objects
   */
  private async _assetStateSync(newAssets?: Asset[]): Promise<void> {
    const documents = await (await this.assets)?.find().exec();
    const result = (documents && documents.map(this._mapAssetDoc)) || [];
    const assets = newAssets || result || [];
    store.dispatch(setAssets(assets));
  }

  /**
   * Add a new Asset object to the list of Asset objects
   * current active agent has.
   * @param asset Asset object to be added
   */
  async addAsset(asset: Asset, options?: DatabaseOptions): Promise<void> {
    try {
      await (
        await this.assets
      )?.insert({
        ...asset,
        logo: extractValueFromArray(asset.logo),
        index: extractValueFromArray(asset.index),
        deleted: false,
        updatedAt: Date.now(),
      });

      if (options?.sync) await this._assetStateSync();
    } catch (e) {
      console.error("RxDb AddAsset:", e);
    }
  }

  async updateAssets(newAssets: Asset[], options?: DatabaseOptions): Promise<void> {
    try {
      await (
        await this.assets
      )?.bulkUpsert(
        newAssets.map((a) => ({
          ...a,
          logo: extractValueFromArray(a.logo),
          index: extractValueFromArray(a.index),
          deleted: false,
          updatedAt: Date.now(),
        })),
      );
      if (options?.sync) await this._assetStateSync();
    } catch (e) {
      console.error("RxDb UpdateAssets:", e);
    }
  }

  /**
   * Find a Asset object by its ID and replace it with
   * another Asset object with the date of update.
   * @param address Address ID of a Asset object
   * @param newDoc Asset object
   */
  async updateAsset(address: string, newDoc: Asset, options?: DatabaseOptions): Promise<void> {
    try {
      const document = await (await this.assets)?.findOne(address).exec();
      await document?.patch({
        ...newDoc,
        logo: extractValueFromArray(newDoc.logo),
        index: extractValueFromArray(newDoc.index),
        deleted: false,
        updatedAt: Date.now(),
      });

      if (options?.sync) await this._assetStateSync();
    } catch (e) {
      console.error("RxDb UpdateAsset:", e);
    }
  }

  /**
   * Find and remove a Asset object by its ID.
   * @param address Address ID of a Asset object
   */
  async deleteAsset(address: string, options?: DatabaseOptions): Promise<void> {
    try {
      const document = await (await this.assets)?.findOne(address).exec();
      await document?.remove();

      if (options?.sync) await this._assetStateSync();
    } catch (e) {
      console.error("RxDb DeleteAsset", e);
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
          subaccounts: a.subaccounts.map((sa) => ({
            ...sa,
            allowance: [sa.allowance],
          })),
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
          subaccounts: a.subaccounts.map((sa) => ({
            ...sa,
            allowance: [sa.allowance],
          })),
        })),
        deleted: false,
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.error("RxDb UpdateContact", e);
    }
  }

  /**
   * Update Contacts in bulk.
   * @param newDocs Array of Allowance objects
   */
  async updateContacts(newDocs: Contact[]): Promise<void> {
    try {
      await (
        await this.contacts
      )?.bulkUpsert(
        newDocs.map((doc) => ({
          ...doc,
          accountIdentier: extractValueFromArray(doc.accountIdentier),
          assets: doc.assets.map((a) => ({
            ...a,
            logo: extractValueFromArray(a.logo),
            subaccounts: a.subaccounts.map((sa) => ({
              ...sa,
              allowance: [sa.allowance],
            })),
          })),
          deleted: false,
          updatedAt: Date.now(),
        })),
      );
    } catch (e) {
      console.error("RxDb UpdateContacts", e);
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
   * Find a Allowance object.
   * @param id Primary Key
   * @returns Allowance object or NULL if not found
   */
  async getAllowance(id: string): Promise<TAllowance | null> {
    try {
      const document = await (await this.allowances)?.findOne(id).exec();
      return (document && this._mapAllowanceDoc(document)) || null;
    } catch (e) {
      console.error("RxDb GetAllowance", e);
      return null;
    }
  }

  /**
   * Get all Allowance objects from active agent.
   * @returns Array of found Allowance objects or an empty
   * array if no Allowance object were found
   */
  async getAllowances(): Promise<TAllowance[]> {
    try {
      const documents = await (await this.allowances)?.find().exec();
      return (documents && documents.map(this._mapAllowanceDoc)) || [];
    } catch (e) {
      console.error("RxDb GetAllowances", e);
      return [];
    }
  }

  /**
   * Add a new Allowance object to the list of Allowance objects
   * current active agent has.
   * @param allowance Allowance object to be added
   */
  async addAllowance(allowance: TAllowance): Promise<void> {
    try {
      await (
        await this.allowances
      )?.insert({
        ...allowance,
        asset: {
          ...allowance.asset,
          logo: extractValueFromArray(allowance.asset?.logo),
        },
        deleted: false,
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.error("RxDb AddAllowance", e);
    }
  }

  /**
   * Find a Allowance object and replace it
   * with another Allowance object with the date of update.
   * @param id Primary Key
   * @param newDoc Allowance object
   */
  async updateAllowance(id: string, newDoc: TAllowance): Promise<void> {
    try {
      const document = await (await this.allowances)?.findOne(id).exec();
      document?.patch({
        ...newDoc,
        asset: {
          ...newDoc.asset,
          logo: extractValueFromArray(newDoc.asset?.logo),
        },
        deleted: false,
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.error("RxDb UpdateAllowance", e);
    }
  }

  /**
   * Update Allowances in bulk.
   * @param newDocs Array of Allowance objects
   */
  async updateAllowances(newDocs: TAllowance[]): Promise<void> {
    try {
      await (
        await this.allowances
      )?.bulkUpsert(
        newDocs.map((doc) => ({
          ...doc,
          expiration: extractValueFromArray(doc.expiration),
          asset: {
            ...doc.asset,
            logo: extractValueFromArray(doc.asset?.logo),
          },
          deleted: false,
          updatedAt: Date.now(),
        })),
      );
    } catch (e) {
      console.error("RxDb UpdateAllowances", e);
    }
  }

  /**
   * Find and remove a Allowance object.
   * @param id Primary Key
   */
  async deleteAllowance(id: string): Promise<void> {
    try {
      const document = await (await this.allowances)?.findOne(id).exec();
      document?.remove();
    } catch (e) {
      console.error("RxDb DeleteAllowance", e);
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
   * @returns Array of Asset objects from current
   * active agent
   */
  subscribeToAllAssets(): Observable<Asset[]> {
    return this.identityChanged$.pipe(
      switchMap(() => from(this.assets)),
      switchMap((collection) => collection?.find().$ || []),
      map((x: any) => x.map(this._mapAssetDoc)),
    );
  }

  /**
   * Subscribable Observable that trigger after
   * a new Identity has been set.
   * @returns Array of Allowances objects from current
   * active agent
   */
  subscribeToAllAllowances(): Observable<TAllowance[]> {
    return this.identityChanged$.pipe(
      switchMap(() => from(this.allowances)),
      switchMap((collection) => collection?.find().$ || []),
      map((x: any) => x.map(this._mapAllowanceDoc)),
    );
  }

  /**
   * Obserbable that triggers after documents were pulled from the DB.
   * @returns Array of Assets and Contacts objects pulled from the DB
   */
  subscribeOnPulling(): Observable<boolean> {
    return combineLatest([this.pullingAssets$, this.pullingContacts$, this.pullingAllowances$]).pipe(
      map(([a, b]) => a || b),
      distinctUntilChanged(),
    );
  }

  /**
   * Observable that triggers after documents where pushed to the DB.
   * @returns Array of Assets and Contacts objects just pushed
   * to the DB
   */
  subscribeOnPushing(): Observable<boolean> {
    return combineLatest([this.pushingAssets$, this.pushingContacts$, this.pushingAllowances$]).pipe(
      map(([a, b]) => a || b),
      distinctUntilChanged(),
    );
  }

  private _mapContactDoc(doc: RxDocument<ContactRxdbDocument>): Contact {
    return {
      name: doc.name,
      principal: doc.principal,
      accountIdentier: doc.accountIdentier,
      assets: doc.assets.map((a) => ({
        symbol: a.symbol,
        tokenSymbol: a.tokenSymbol,
        logo: a.logo,
        subaccounts: a.subaccounts.map((sa) => ({
          name: sa.name,
          subaccount_index: sa.subaccount_index,
          sub_account_id: sa.sub_account_id,
        })),
        address: a.address,
        decimal: a.decimal,
        shortDecimal: a.shortDecimal,
        supportedStandards: a.supportedStandards as typeof SupportedStandardEnum.options,
      })),
    };
  }

  private _mapAssetDoc(doc: RxDocument<AssetRxdbDocument>): Asset {
    return {
      name: doc.name,
      sortIndex: doc.sortIndex,
      address: doc.address,
      logo: doc.logo,
      decimal: doc.decimal,
      symbol: doc.symbol,
      index: doc.index,
      subAccounts: doc.subAccounts.map((sa) => ({
        numb: sa.sub_account_id,
        name: sa.name,
        amount: sa.amount,
        currency_amount: sa.currency_amount,
        address: sa.address,
        decimal: sa.decimal,
        sub_account_id: sa.sub_account_id,
        symbol: sa.symbol,
        transaction_fee: sa.transaction_fee,
      })),
      tokenName: doc.tokenName,
      tokenSymbol: doc.tokenSymbol,
      shortDecimal: doc.shortDecimal,
      supportedStandards: doc.supportedStandards as typeof SupportedStandardEnum.options,
    };
  }

  private _mapAllowanceDoc(doc: RxDocument<AllowanceRxdbDocument>): TAllowance {
    return {
      id: doc.id,
      subAccountId: doc.subAccountId,
      spender: doc.spender,
      asset: {
        logo: doc.asset.logo,
        name: doc.asset.name,
        symbol: doc.asset.symbol,
        address: doc.asset.address,
        decimal: doc.asset.decimal,
        tokenName: doc.asset.tokenName,
        tokenSymbol: doc.asset.tokenSymbol,
        supportedStandards: doc.asset.supportedStandards as typeof SupportedStandardEnum.options,
      },
    };
  }

  private _invalidateDb(): void {
    if (this.assetsPullInterval !== undefined) {
      clearInterval(this.assetsPullInterval);
      this.assetsPullInterval = undefined;
    }
    if (this.contactsPullInterval !== undefined) {
      clearInterval(this.contactsPullInterval);
      this.contactsPullInterval = undefined;
    }
    if (this.allowancesPullInterval !== undefined) {
      clearInterval(this.allowancesPullInterval);
      this.allowancesPullInterval = undefined;
    }
    if (this.assetsReplicationState) {
      this.assetsReplicationState.cancel().then();
      this.assetsReplicationState = undefined;
    }
    if (this.contactsReplicationState) {
      this.contactsReplicationState.cancel().then();
      this.contactsReplicationState = undefined;
    }
    if (this.allowancesReplicationState) {
      this.allowancesReplicationState.cancel().then();
      this.allowancesReplicationState = undefined;
    }
    this._assets = null!;
    this._contacts = null!;
    this._allowances = null!;
  }

  private async _assetsPushHandler(items: any[]): Promise<AssetRxdbDocument[]> {
    const arg = items.map(
      (x) =>
        ({
          ...x,
          sortIndex: x.sortIndex,
          updatedAt: Math.floor(Date.now() / 1000),
          logo: extractValueFromArray(x.logo),
          index: extractValueFromArray(x.index),
        } as AssetRxdbDocument),
    );

    await this.replicaCanister?.pushAssets(arg);

    return arg;
  }

  private async _assetsPullHandler(
    minTimestamp: number,
    lastId: string | null,
    batchSize: number,
  ): Promise<AssetRxdbDocument[]> {
    const raw = (await this.replicaCanister?.pullAssets(
      minTimestamp,
      lastId ? [lastId] : [],
      BigInt(batchSize),
    )) as AssetRxdbDocument[];

    return raw.map((x) => ({
      ...x,
      sortIndex: Number(x.sortIndex),
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

  private async _allowancesPushHandler(items: any): Promise<AllowanceRxdbDocument[]> {
    const arg = items.map((x: any) => ({
      ...x,
      updatedAt: Math.floor(Date.now() / 1000),
      expiration: extractValueFromArray(x.expiration),
      asset: {
        ...x.asset,
        logo: extractValueFromArray(x.asset?.logo),
      },
    }));

    await this.replicaCanister?.pushAllowances(arg);

    return arg;
  }

  private async _allowancesPullHandler(
    minTimestamp: number,
    lastId: string | null,
    batchSize: number,
  ): Promise<AllowanceRxdbDocument[]> {
    const raw = (await this.replicaCanister?.pullAllowances(
      minTimestamp,
      lastId ? [lastId] : [],
      BigInt(batchSize),
    )) as AllowanceRxdbDocument[];

    return raw;
  }

  private async _doesRecordByPrincipalExist() {
    // Look for entry record by current principal ID
    const exist: boolean = await this.replicaCanister?.doesStorageExist();

    // If does not exist it means that this is a brand new account
    if (!exist) {
      try {
        await (
          await this.assets
        )?.bulkInsert(
          defaultTokens.map((dT) => ({
            ...dT,
            index: extractValueFromArray(dT.index),
            logo: extractValueFromArray(dT.logo),
            deleted: false,
            updatedAt: Date.now(),
          })),
        );
      } catch (e) {
        console.error("RxDb DoesDBExist:", e);
      }
    }
  }
}
