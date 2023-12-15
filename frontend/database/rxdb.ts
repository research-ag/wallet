import { DatabaseOptions, IWalletDatabase } from "@/database/i-wallet-database";
import { createRxDatabase, RxCollection, RxDocument, RxDatabase, addRxPlugin } from "rxdb";
import DBSchemas from "./schemas.json";
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable } from "rxjs";
import { extractValueFromArray, setupReplication } from "./helpers";
import { defaultTokens } from "@/common/defaultTokens";
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
import { TAllowance } from "@/@types/allowance";
import { SupportedStandardEnum } from "@/@types/icrc";
import {
  AssetDocument as AssetRxdbDocument,
  ContactDocument as ContactRxdbDocument,
  AllowanceDocument as AllowanceRxdbDocument,
  ServiceDocument as ServiceRxdbDocument,
} from "@/candid/database/db.did";
import { Asset } from "@redux/models/AccountModels";
import store from "@redux/Store";
import {
  addReduxAsset,
  deleteReduxAsset,
  setAccordionAssetIdx,
  setAssets,
  updateReduxAsset,
} from "@redux/assets/AssetReducer";
import {
  addReduxContact,
  deleteReduxContact,
  setReduxContacts,
  updateReduxContact,
} from "@redux/contacts/ContactsReducer";
import {
  addReduxAllowance,
  deleteReduxAllowance,
  setReduxAllowances,
  updateReduxAllowance,
} from "@redux/allowance/AllowanceReducer";
import logger from "@/common/utils/logger";
import { Contact } from "@redux/models/ContactsModels";
import { ServiceData } from "@redux/models/ServiceModels";
import { setServices as setServicesRedux, setServicesData } from "@redux/services/ServiceReducer";

addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationPlugin);
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
  private _services!: RxCollection<ServiceRxdbDocument> | null;
  private servicesReplicationState?: RxReplicationState<any, any>;
  private servicesPullInterval?: any;

  private pullingAssets$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pushingAssets$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pullingContacts$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pushingContacts$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pullingAllowances$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pushingAllowances$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pullingServices$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private pushingServices$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

  protected get services(): Promise<RxCollection<ServiceRxdbDocument> | null> {
    if (this._services) return Promise.resolve(this._services);
    return this.init().then(() => this._services);
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

      const { assets, contacts, allowances, services } = await db.addCollections(DBSchemas);

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

      const servicesReplication = await setupReplication<ServiceRxdbDocument, string>(
        services,
        `services-${this.principalId}`,
        "principal",
        (items) => this._servicesPushHandler(items),
        (minTimestamp, lastId, batchSize) => this._servicesPullHandler(minTimestamp, lastId, batchSize),
      );

      [this.servicesReplicationState, this.servicesPullInterval, this.pushingServices$, this.pullingServices$] =
        servicesReplication;

      this._assets = assets;
      this._contacts = contacts;
      this._allowances = allowances;
      this._services = services;
    } catch (e) {
      logger.debug("RxDb Init:", e);
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
      await this._contactStateSync();
      await this._allowanceStateSync();
      await this._serviceStateSync();
    }
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
      logger.debug("RxDb GetAsset:", e);
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
      logger.debug("RxDb GetAssets:", e);
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

    const noBalanceAssets = assets.map((asset) => ({
      ...asset,
      subAccounts: asset.subAccounts.map((subaccount) => ({
        ...subaccount,
        amount: "0",
        currency_amount: "0",
      })),
    }));

    store.dispatch(setAssets(noBalanceAssets));
    assets[0]?.tokenSymbol && store.dispatch(setAccordionAssetIdx([assets[0].tokenSymbol]));
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

      if (options?.sync) store.dispatch(addReduxAsset(asset));
    } catch (e) {
      logger.debug("RxDb AddAsset:", e);
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
      logger.debug("RxDb UpdateAssets:", e);
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

      if (options?.sync) store.dispatch(updateReduxAsset(newDoc));
    } catch (e) {
      logger.debug("RxDb UpdateAsset:", e);
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

      if (options?.sync) store.dispatch(deleteReduxAsset(address));
    } catch (e) {
      logger.debug("RxDb DeleteAsset", e);
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
      logger.debug("RxDb GetContact", e);
      return null;
    }
  }

  async _contactStateSync(newContacts?: Contact[]): Promise<void> {
    const documents = await (await this.contacts)?.find().exec();
    const result = (documents && documents.map(this._mapContactDoc)) || [];
    const contacts = newContacts || result || [];
    store.dispatch(setReduxContacts(contacts));
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
      logger.debug("RxDb GetContacts", e);
      return [];
    }
  }

  /**
   * Add a new Contact object to the list of Contact objects
   * current active agent has.
   * @param contact Contact object to be added
   */
  async addContact(contact: Contact, options?: DatabaseOptions): Promise<void> {
    try {
      const databaseContact = this._getStorableContact(contact);
      await (
        await this.contacts
      )?.insert({
        ...databaseContact,
        accountIdentifier: extractValueFromArray(databaseContact.accountIdentifier),
        accounts: databaseContact.accounts,
        deleted: false,
        updatedAt: Date.now(),
      });

      if (options?.sync) store.dispatch(addReduxContact(contact));
    } catch (e) {
      logger.debug("RxDb AddContact", e);
    }
  }

  /**
   * Find a Contact object by its Principal ID and replace it
   * with another Contact object with the date of update.
   * @param principal Principal ID
   * @param newDoc Contact object
   */
  async updateContact(principal: string, newDoc: Contact, options?: DatabaseOptions): Promise<void> {
    try {
      const databaseContact = this._getStorableContact(newDoc);
      const document = await (await this.contacts)?.findOne(principal).exec();

      document?.patch({
        ...databaseContact,
        accountIdentifier: extractValueFromArray(databaseContact.accountIdentifier),
        accounts: databaseContact.accounts,
        deleted: false,
        updatedAt: Date.now(),
      });

      if (options?.sync) store.dispatch(updateReduxContact(newDoc));
    } catch (e) {
      logger.debug("RxDb UpdateContact", e);
    }
  }

  /**
   * Update Contacts in bulk.
   * @param newDocs Array of Allowance objects
   */
  async updateContacts(newDocs: Contact[]): Promise<void> {
    try {
      const databaseContacts = newDocs.map((contact) => this._getStorableContact(contact));

      await (
        await this.contacts
      )?.bulkUpsert(
        databaseContacts.map((doc) => ({
          ...doc,
          accountIdentifier: extractValueFromArray(doc.accountIdentifier),
          accounts: doc.accounts,
          deleted: false,
          updatedAt: Date.now(),
        })),
      );
      store.dispatch(setReduxContacts(newDocs));
    } catch (e) {
      logger.debug("RxDb UpdateContacts", e);
    }
  }

  /**
   * Find and remove a Contact object by its Principal ID.
   * @param principal Principal ID
   */
  async deleteContact(principal: string, options?: DatabaseOptions): Promise<void> {
    try {
      const document = await (await this.contacts)?.findOne(principal).exec();
      await document?.remove();
      if (options?.sync) store.dispatch(deleteReduxContact(principal));
    } catch (e) {
      logger.debug("RxDb DeleteContact", e);
    }
  }

  private _getStorableContact(contact: Contact): Contact {
    return {
      ...contact,
      accounts: contact.accounts.map((account) => {
        // eslint-disable-next-line
        const { allowance, ...rest } = account;
        return { ...rest };
      }),
    };
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
      logger.debug("RxDb GetAllowance", e);
      return null;
    }
  }

  private async _allowanceStateSync(newAllowances?: TAllowance[]): Promise<void> {
    const documents = await (await this.allowances)?.find().exec();
    const result = (documents && documents.map(this._mapAllowanceDoc)) || [];
    const allowances = newAllowances || result || [];
    store.dispatch(setReduxAllowances(allowances));
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
      logger.debug("RxDb GetAllowances", e);
      return [];
    }
  }

  /**
   * Add a new Allowance object to the list of Allowance objects
   * current active agent has.
   * @param allowance Allowance object to be added
   */
  async addAllowance(allowance: TAllowance, options?: DatabaseOptions): Promise<void> {
    const databaseAllowance = this._getStorableAllowance(allowance);

    try {
      await (
        await this.allowances
      )?.insert({
        ...databaseAllowance,
        asset: {
          ...databaseAllowance.asset,
          logo: extractValueFromArray(databaseAllowance.asset?.logo),
        },
        deleted: false,
        updatedAt: Date.now(),
      });

      if (options?.sync) store.dispatch(addReduxAllowance(allowance));
    } catch (e) {
      logger.debug("RxDb AddAllowance", e);
    }
  }

  /**
   * Find a Allowance object and replace it
   * with another Allowance object with the date of update.
   * @param id Primary Key
   * @param newDoc Allowance object
   */
  async updateAllowance(id: string, newDoc: TAllowance, options?: DatabaseOptions): Promise<void> {
    try {
      const databaseAllowance = this._getStorableAllowance(newDoc);
      const document = await (await this.allowances)?.findOne(id).exec();

      document?.patch({
        ...databaseAllowance,
        asset: {
          ...databaseAllowance.asset,
          logo: extractValueFromArray(databaseAllowance.asset?.logo),
        },
        deleted: false,
        updatedAt: Date.now(),
      });

      if (options?.sync) store.dispatch(updateReduxAllowance(newDoc));
    } catch (e) {
      logger.debug("RxDb UpdateAllowance", e);
    }
  }

  /**
   * Update Allowances in bulk.
   * @param newDocs Array of Allowance objects
   */
  async updateAllowances(newDocs: TAllowance[], options?: DatabaseOptions): Promise<void> {
    try {
      const databaseAllowances = newDocs.map((allowance) => this._getStorableAllowance(allowance));

      await (
        await this.allowances
      )?.bulkUpsert(
        databaseAllowances.map((doc) => ({
          ...doc,
          asset: {
            ...doc.asset,
            logo: extractValueFromArray(doc.asset?.logo),
          },
          deleted: false,
          updatedAt: Date.now(),
        })),
      );

      if (options?.sync) store.dispatch(setReduxAllowances(newDocs));
    } catch (e) {
      logger.debug("RxDb UpdateAllowances", e);
    }
  }

  /**
   * Find and remove a Allowance object.
   * @param id Primary Key
   */
  async deleteAllowance(id: string, options?: DatabaseOptions): Promise<void> {
    try {
      const document = await (await this.allowances)?.findOne(id).exec();
      await document?.remove();

      if (options?.sync) store.dispatch(deleteReduxAllowance(id));
    } catch (e) {
      logger.debug("RxDb DeleteAllowance", e);
    }
  }

  /**
   * Get all Contact objects from active agent.
   * @returns Array of found Contact objects or an empty
   * array if no Contact object were found
   */
  async getServices(): Promise<ServiceData[]> {
    try {
      const documents = await (await this.services)?.find().exec();
      return (documents && documents.map(this._mapserviceDoc)) || [];
    } catch (e) {
      logger.debug("RxDb Getservices", e);
      return [];
    }
  }

  private async _serviceStateSync(newServices?: ServiceData[]): Promise<void> {
    const documents = await (await this.services)?.find().exec();
    const result = (documents && documents.map(this._mapserviceDoc)) || [];
    const srvcs = newServices || result || [];
    store.dispatch(setServicesData(srvcs));
    if (srvcs.length === 0) store.dispatch(setServicesRedux([]));
  }

  async setServices(services: ServiceData[]): Promise<void> {
    try {
      await (
        await this.services
      )?.bulkUpsert(
        services.map((a) => ({
          ...a,
          deleted: false,
          updatedAt: Date.now(),
        })),
      );
    } catch (e) {
      logger.debug("RxDb setServices:", e);
    }
  }

  /**
   * Find and remove a Service object by its Principal ID.
   * @param principal Principal ID
   */
  async deleteService(principal: string): Promise<void> {
    try {
      const document = await (await this.services)?.findOne(principal).exec();
      await document?.remove();
    } catch (e) {
      logger.debug("RxDb DeleteContact", e);
    }
  }

  private _getStorableAllowance(allowance: TAllowance): Pick<TAllowance, "id" | "asset" | "subAccountId" | "spender"> {
    // eslint-disable-next-line
    const { amount, expiration, ...rest } = allowance;
    return { ...rest };
  }

  /**
   * Obserbable that triggers after documents were pulled from the DB.
   * @returns Array of Assets and Contacts objects pulled from the DB
   */
  subscribeOnPulling(): Observable<boolean> {
    return combineLatest([
      this.pullingAssets$,
      this.pullingContacts$,
      this.pullingAllowances$,
      this.pullingServices$,
    ]).pipe(
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
    return combineLatest([
      this.pushingAssets$,
      this.pushingContacts$,
      this.pushingAllowances$,
      this.pushingServices$,
    ]).pipe(
      map(([a, b]) => a || b),
      distinctUntilChanged(),
    );
  }

  private _mapContactDoc(doc: RxDocument<ContactRxdbDocument>): Contact {
    return {
      name: doc.name,
      principal: doc.principal,
      accountIdentifier: doc.accountIdentifier,
      accounts: doc.accounts.map((a) => ({
        name: a.name,
        subaccount: a.subaccount,
        subaccountId: a.subaccountId,
        tokenSymbol: a.tokenSymbol,
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

  private _mapserviceDoc(doc: RxDocument<ServiceRxdbDocument>): ServiceData {
    return {
      name: doc.name,
      principal: doc.principal,
      assets: doc.assets.map((a) => ({
        principal: a.principal,
        logo: a.logo,
        tokenSymbol: a.tokenSymbol,
        tokenName: a.tokenName,
        shortDecimal: a.shortDecimal,
        decimal: a.decimal,
      })),
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
    if (this.servicesPullInterval !== undefined) {
      clearInterval(this.servicesPullInterval);
      this.servicesPullInterval = undefined;
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
    if (this.servicesReplicationState) {
      this.servicesReplicationState.cancel().then();
      this.servicesReplicationState = undefined;
    }
    this._assets = null!;
    this._contacts = null!;
    this._allowances = null!;
    this._services = null!;
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

  private async _contactsPushHandler(items: ContactRxdbDocument[]): Promise<ContactRxdbDocument[]> {
    const arg: ContactRxdbDocument[] = items.map(
      (currentContact: ContactRxdbDocument): ContactRxdbDocument => ({
        ...currentContact,
        accountIdentifier: extractValueFromArray(currentContact.accountIdentifier),
        accounts: currentContact.accounts.map((account: any) => ({
          name: account.name,
          subaccount: account.subaccount,
          subaccountId: account.subaccountId,
          tokenSymbol: account.tokenSymbol,
        })),
        updatedAt: Math.floor(Date.now() / 1000),
      }),
    );

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

  private async _allowancesPushHandler(items: AllowanceRxdbDocument[]): Promise<AllowanceRxdbDocument[]> {
    const arg = items.map(
      (currentAllowance: AllowanceRxdbDocument): AllowanceRxdbDocument => ({
        id: currentAllowance.id,
        deleted: currentAllowance.deleted,
        asset: {
          ...currentAllowance.asset,
          logo: extractValueFromArray(currentAllowance.asset?.logo),
        },
        subAccountId: currentAllowance.subAccountId,
        spender: currentAllowance.spender,
        updatedAt: Math.floor(Date.now() / 1000),
      }),
    );

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

  private async _servicesPushHandler(items: ServiceRxdbDocument[]): Promise<ServiceRxdbDocument[]> {
    const arg: ServiceRxdbDocument[] = items.map(
      (currentservice: ServiceRxdbDocument): ServiceRxdbDocument => ({
        ...currentservice,
        updatedAt: Math.floor(Date.now() / 1000),
      }),
    );

    await this.replicaCanister?.pushServices(arg);
    return arg;
  }

  private async _servicesPullHandler(
    minTimestamp: number,
    lastId: string | null,
    batchSize: number,
  ): Promise<ServiceRxdbDocument[]> {
    const raw = (await this.replicaCanister?.pullServices(
      minTimestamp,
      lastId ? [lastId] : [],
      BigInt(batchSize),
    )) as ServiceRxdbDocument[];

    return raw;
  }

  private async _doesRecordByPrincipalExist() {
    // Look for entry record by current principal ID
    try {
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
          logger.debug("RxDb DoesDBExist:", e);
        }
      }
    } catch (e) {
      logger.debug("RxDb DoesDBExist:", e);
    }
  }
}
