import { DatabaseOptions, IWalletDatabase } from "@/database/i-wallet-database";
import { TAllowance } from "@/@types/allowance";
import { Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { defaultTokens } from "@/common/defaultTokens";
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
import { Contact } from "@redux/models/ContactsModels";
import { ServiceData } from "@redux/models/ServiceModels";
import logger from "@/common/utils/logger";
import { resetAssetAmount } from "@pages/home/helpers/assets";
import { setServices as setServicesRedux, setServicesData } from "@redux/services/ServiceReducer";

export class LocalStorageDatabase extends IWalletDatabase {
  // Singleton pattern
  private static _instance: LocalStorageDatabase | undefined;
  public static get instance(): LocalStorageDatabase {
    if (!this._instance) {
      this._instance = new LocalStorageDatabase();
    }
    return this._instance!;
  }

  private principalId = "";

  /**
   * Initialize all necessary external system and
   * data structure before first use.
   */
  init(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Set Identity object or fixed Principal ID
   * as current active agent.
   * @param identity Identity object
   * @param fixedPrincipal Watch-only login Principal ID
   */
  async setIdentity(identity: Identity | null, fixedPrincipal?: Principal): Promise<void> {
    this.principalId = fixedPrincipal?.toString() || identity?.getPrincipal().toText() || "";
    this._doesRecordByPrincipalExist();
    //
    this._assetStateSync();
    this._contactStateSync();
    this._allowanceStateSync();
    this._serviceStateSync();
  }

  /**
   * Get a Asset object by its ID.
   * @param address Address ID of a Asset object
   * @returns Asset object or NULL if not found
   */
  async getAsset(address: string): Promise<Asset | null> {
    return this._getAssets().find((x) => x.address === address) || null;
  }

  /**
   * Sync the Asset storage with the Redux store.
   * @param newAssets Array of Asset objects
   */
  private async _assetStateSync(newAssets?: Asset[]): Promise<void> {
    const assets = newAssets || JSON.parse(localStorage.getItem(`assets-${this.principalId}`) || "[]");
    const noBalanceAssets = resetAssetAmount(assets);
    store.dispatch(setAssets(noBalanceAssets));
    assets[0].tokenSymbol && store.dispatch(setAccordionAssetIdx([assets[0].tokenSymbol]));
  }

  /**
   * Get all Asset objects from the active agent.
   * @returns Array of found Asset objects or an empty
   * array if no Asset objects were found
   */
  async getAssets(): Promise<Asset[]> {
    return this._getAssets();
  }

  /**
   * Add a new Asset object to the list of Asset objects
   * current active agent has.
   * @param asset Asset object to be added
   */
  async addAsset(asset: Asset, options?: DatabaseOptions): Promise<void> {
    const assets = this._getAssets();
    this._setAssets([...assets, asset]);
    if (options?.sync) store.dispatch(addReduxAsset(asset));
  }

  async updateAssets(assets: Asset[], options?: DatabaseOptions): Promise<void> {
    this._setAssets(assets);
    if (options?.sync) store.dispatch(setAssets(assets));
  }

  /**
   * Find a Asset object by its ID and replace it with
   * another Asset object with the date of update.
   * @param address Address ID of a Asset object
   * @param newDoc Asset object
   */
  async updateAsset(address: string, newDoc: Asset, options?: DatabaseOptions): Promise<void> {
    this._setAssets(
      this._getAssets().map((tkn) => {
        if (tkn.address === address) {
          return newDoc;
        } else return tkn;
      }),
    );
    if (options?.sync) store.dispatch(updateReduxAsset(newDoc));
  }

  /**
   * Find and remove a Asset object by its ID.
   * @param address Address ID of a Asset object
   */
  async deleteAsset(address: string, options?: DatabaseOptions): Promise<void> {
    this._setAssets(this._getAssets().filter((tkn) => tkn.address !== address));
    if (options?.sync) store.dispatch(deleteReduxAsset(address));
  }

  /**
   * Find a Contact object by its Principal ID.
   * @param principal Princial ID
   * @returns Contact object or NULL if not found
   */
  async getContact(principal: string): Promise<Contact | null> {
    return this._getContacts().find((x) => x.principal === principal) || null;
  }

  /**
   * Sync the Contact storage with the Redux store.
   * This function must not include the Allowance object.
   * @param newContacts Array of Contact objects
   */
  async _contactStateSync(newContacts?: Contact[]): Promise<void> {
    const contacts = newContacts || JSON.parse(localStorage.getItem(`contacts-${this.principalId}`) || "[]");
    store.dispatch(setReduxContacts(contacts));
  }

  /**
   * Get all Contact objects from active agent.
   * @returns Array of found Contact objects or an empty
   * array if no Contact object were found
   */
  async getContacts(): Promise<Contact[]> {
    return this._getContacts();
  }

  /**
   * Add a new Contact object to the list of Contact objects
   * current active agent has.
   * @param contact Contact object to be added
   */
  async addContact(contact: Contact, options?: DatabaseOptions): Promise<void> {
    const contacts = this._getContacts();
    const databaseContact = this._getStorableContact(contact);
    this._setContacts([...contacts, databaseContact]);
    if (options?.sync) store.dispatch(addReduxContact(contact));
  }

  /**
   * Find a Contact object by its Principal ID and replace it
   * with another Contact object with the date of update.
   * @param principal Principal ID
   * @param newDoc Contact object
   */
  async updateContact(principal: string, newDoc: Contact, options?: DatabaseOptions): Promise<void> {
    const databaseContact = this._getStorableContact(newDoc);

    this._setContacts(
      this._getContacts().map((contact) => {
        if (contact.principal === principal) {
          return databaseContact;
        } else return contact;
      }),
    );

    if (options?.sync) store.dispatch(updateReduxContact(newDoc));
  }

  /**
   * Update Contacts in bulk.
   * @param newDocs Array of Allowance objects
   */
  async updateContacts(newDocs: Contact[], options?: DatabaseOptions): Promise<void> {
    const databaseContacts = newDocs.map((contact) => this._getStorableContact(contact));
    this._setContacts(databaseContacts);
    if (options?.sync) store.dispatch(setReduxContacts(newDocs));
  }

  /**
   * Find and remove a Contact object by its Principal ID.
   * @param principal Principal ID
   */
  async deleteContact(principal: string, options?: DatabaseOptions): Promise<void> {
    this._setContacts(this._getContacts().filter((contact) => contact.principal !== principal));
    if (options?.sync) store.dispatch(deleteReduxContact(principal));
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
    return this._getAllowances().find((allowance) => allowance.id === id) || null;
  }

  /**
   * Sync the storage with the redux state
   * This must not not include the last updated expiration or amount
   */
  private async _allowanceStateSync(newAllowances?: TAllowance[]): Promise<void> {
    const allowances = newAllowances || JSON.parse(localStorage.getItem(`allowances-${this.principalId}`) || "[]");
    store.dispatch(setReduxAllowances(allowances));
  }

  /**
   * Get all Allowance objects from active agent.
   * @returns Array of found Allowance objects or an empty
   * array if no Allowance object were found
   */
  async getAllowances(): Promise<TAllowance[]> {
    return this._getAllowances();
  }

  /**
   * Add a new Allowance object to the list of Allowance objects
   * current active agent has.
   * @param allowance Allowance object to be added
   */
  async addAllowance(allowance: TAllowance, options?: DatabaseOptions): Promise<void> {
    const allowances = this._getAllowances();
    const databaseAllowance = this._getStorableAllowance(allowance);
    this._setAllowances([...allowances, databaseAllowance]);
    if (options?.sync) store.dispatch(addReduxAllowance(allowance));
  }

  /**
   * Find a Allowance object and replace it
   * with another Allowance object with the date of update.
   * @param id Primary Key
   * @param newDoc Allowance object
   */
  async updateAllowance(id: string, newDoc: TAllowance, options?: DatabaseOptions): Promise<void> {
    const databaseAllowance = this._getStorableAllowance(newDoc);

    this._setAllowances(
      this._getAllowances().map((allowance) => {
        if (allowance.id === id) {
          return databaseAllowance;
        } else return allowance;
      }),
    );

    if (options?.sync) store.dispatch(updateReduxAllowance(newDoc));
  }

  /**
   * Update Allowances in bulk.
   * @param newDocs Array of Allowance objects
   */
  async updateAllowances(newDocs: TAllowance[], options?: DatabaseOptions): Promise<void> {
    const databaseAllowances = newDocs.map((allowance) => this._getStorableAllowance(allowance));
    this._setAllowances(databaseAllowances);
    if (options?.sync) store.dispatch(setReduxAllowances(newDocs));
  }

  /**
   * Find and remove a Allowance object.
   * @param id Primary Key
   */
  async deleteAllowance(id: string, options?: DatabaseOptions): Promise<void> {
    this._setAllowances(this._getAllowances().filter((allowance) => allowance.id !== id));
    if (options?.sync) store.dispatch(deleteReduxAllowance(id));
  }

  /**
   * Sync the storage with the redux state
   */
  private async _serviceStateSync(services?: ServiceData[]): Promise<void> {
    const service =
      services || (JSON.parse(localStorage.getItem(`allowances-${this.principalId}`) || "[]") as ServiceData[]);
    store.dispatch(setServicesData(service));
    if (service.length === 0) store.dispatch(setServicesRedux([]));
  }

  async getServices(): Promise<ServiceData[]> {
    return this._getServices();
  }

  async setServices(services: ServiceData[]): Promise<void> {
    this._setServices(services);
  }

  async deleteService(principal: string): Promise<void> {
    logger.debug(principal);
  }

  private _getStorableAllowance(allowance: TAllowance): Pick<TAllowance, "id" | "asset" | "subAccountId" | "spender"> {
    // eslint-disable-next-line
    const { amount, expiration, ...rest } = allowance;
    return { ...rest };
  }

  private _getAssets(): Asset[] {
    const assetsData = JSON.parse(localStorage.getItem(`assets-${this.principalId}`) || "null");
    return assetsData || [];
  }

  private _setAssets(allAssets: Asset[]) {
    const assets = [...allAssets].sort((a, b) => a.sortIndex - b.sortIndex);
    this.principalId.trim() !== "" && localStorage.setItem(`assets-${this.principalId}`, JSON.stringify(assets));
  }

  private _getContacts(): Contact[] {
    const stringContacts = localStorage.getItem(`contacts-${this.principalId}`);
    const contacts = stringContacts ? JSON.parse(stringContacts) : [];
    return contacts;
  }

  private _setContacts(contacts: Contact[]) {
    this.principalId.trim() !== "" && localStorage.setItem(`contacts-${this.principalId}`, JSON.stringify(contacts));
  }

  private _getAllowances(): TAllowance[] {
    const allowancesData = JSON.parse(localStorage.getItem(`allowances-${this.principalId}`) || "null");
    return allowancesData || [];
  }

  private _setAllowances(allowances: Pick<TAllowance, "id" | "asset" | "subAccountId" | "spender">[]) {
    this.principalId.trim() !== "" &&
      localStorage.setItem(`allowances-${this.principalId}`, JSON.stringify(allowances));
  }

  private _getServices(): ServiceData[] {
    const stringServices = localStorage.getItem(`services-${this.principalId}`);
    const services = stringServices ? JSON.parse(stringServices) : [];
    return services;
  }

  private _setServices(services: ServiceData[]) {
    this.principalId.trim() !== "" && localStorage.setItem(`services-${this.principalId}`, JSON.stringify(services));
  }

  /**
   * Check if the record by principal exist in the local storage.
   * If not, initialize the local storage with default values.
   *
   * @returns void
   */
  private _doesRecordByPrincipalExist() {
    const assetExist = !!localStorage.getItem(`assets-${this.principalId}`);
    const contactExist = !!localStorage.getItem(`contacts-${this.principalId}`);
    const allowanceExist = !!localStorage.getItem(`allowances-${this.principalId}`);
    const servicesExist = !!localStorage.getItem(`services-${this.principalId}`);

    if (!assetExist) this._setAssets([...defaultTokens]);
    if (!contactExist) this._setContacts([]);
    if (!allowanceExist) this._setAllowances([]);
    if (!servicesExist) this._setServices([]);
  }
}
