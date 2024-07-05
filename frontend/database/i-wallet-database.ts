import { AuthNetwork } from "@redux/models/TokenModels";
import { TAllowance } from "@/@types/allowance";
import { Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { DB_Type } from "./db";
import { LocalStorageKeyEnum } from "@/@types/localstorage";
import { Themes } from "@/common/const";
import { Asset } from "@redux/models/AccountModels";
import { Contact } from "@redux/models/ContactsModels";
import { ServiceData } from "@redux/models/ServiceModels";

export interface DatabaseOptions {
  /**
   * Sync incoming data with the Redux store.
   */
  sync: boolean;
}

export abstract class IWalletDatabase {
  /**
   * Retrieves the current language setting from local storage.
   *
   * @returns The language code stored in local storage, or null if not set.
   */
  getLanguage(): string | null {
    return localStorage.getItem(LocalStorageKeyEnum.Values.language);
  }

  /**
   * Sets the language setting in local storage.
   *
   * @param value The language code to store.
   */
  setLanguage(value: string): void {
    localStorage.setItem(LocalStorageKeyEnum.Values.language, value);
  }

  /**
   * Retrieves the current theme setting from local storage.
   *
   * @returns The theme value ("dark" or "light") stored in local storage, or null if not set.
   */
  getTheme(): Themes | null {
    return localStorage.theme;
  }

  /**
   * Sets the theme setting in local storage.
   *
   * @param value The theme value ("dark" or "light") to store.
   */
  setTheme(value: Themes): void {
    localStorage.theme = value;
  }

  /**
   * Retrieves the current network type setting from local storage.
   *
   * @returns The parsed network type object from local storage, or null if not set.
   */
  getNetworkType(): AuthNetwork | null {
    return JSON.parse(localStorage.getItem(LocalStorageKeyEnum.Values.network_type) || "null");
  }

  /**
   * Retrieves the current database location setting from local storage.
   *
   * @returns The database location value (of type DB_Type) from local storage, or null if not set.
   */
  getDbLocation(): DB_Type | null {
    return localStorage.dbLocation;
  }

  /**
   * Sets the database location setting in local storage.
   *
   * @param value The database location value (of type DB_Type) to store.
   */
  setDbLocation(value: DB_Type): void {
    localStorage.dbLocation = value;
  }

  /**
   * Retrieves the current custom database canister ID setting from local storage.
   *
   * @returns The custom database canister ID value from local storage, or null if not set.
   */
  getCustomDbCanisterId(): string | null {
    return localStorage.getItem(LocalStorageKeyEnum.Values.customDbCanisterId);
  }

  /**
   * Sets the custom database canister ID setting in local storage.
   *
   * @param value The custom database canister ID value to store.
   */
  setCustomDbCanisterId(value: string): void {
    localStorage.setItem(LocalStorageKeyEnum.Values.customDbCanisterId, value);
  }

  /**
   * Retrieves the current network type setting from local storage.
   *
   * @returns The parsed network type object from local storage, or null if not set.
   */
  setNetworkType(value: AuthNetwork): void {
    localStorage.setItem(
      LocalStorageKeyEnum.Values.network_type,
      JSON.stringify({
        type: value.type,
        network: value.network,
        name: value.name,
      }),
    );
  }

  /**
   * Create the primary key for an allowance object based on its spender, subAccountId, and asset symbol.
   *
   * @returns The primary key for the allowance object.
   */
  generateAllowancePrimaryKey({ spender, subAccountId, asset: { symbol } }: TAllowance): string {
    return `${symbol}|${subAccountId}|${spender}`;
  }

  /**
   * Initialice all necessary external systema and
   * data structure before first use.
   */
  abstract init(): Promise<void>;

  /**
   * Set Identity object or fixed Principal ID
   * as current active agent.
   * @param identity Identity object
   * @param fixedPrincipal Watch-only login Principal ID
   */
  abstract setIdentity(identity: Identity | null, fixedPrincipal?: Principal): Promise<void>;

  /**
   * Get a Asset object by its ID.
   * @param address Address ID of a Asset object
   * @returns Asset object or NULL if not found
   */
  abstract getAsset(address: string): Promise<Asset | null>;

  /**
   * Get all Asset objects from the active agent.
   * @returns Array of found Asset objects or an empty
   * array if no Asset objects were found
   */
  abstract getAssets(): Promise<Asset[]>;

  /**
   * Add a new Asset object to the list of Asset objects
   * current active agent has.
   * @param asset Asset object to be added
   */
  abstract addAsset(asset: Asset, options?: DatabaseOptions): Promise<void>;

  /**
   * Replace the storage of Asset objects with a new
   * @param newAssets
   */
  abstract updateAssets(newAssets: Asset[], options?: DatabaseOptions): Promise<void>;

  /**
   * Find a Asset object by its ID and replace it with
   * another Asset object with the date of update.
   * @param address Address ID of a Asset object
   * @param newDoc Asset object
   */
  abstract updateAsset(address: string, newDoc: Asset, options?: DatabaseOptions): Promise<void>;

  /**
   * Find and remove a Asset object by its ID.
   * @param address Address ID of a Asset object
   */
  abstract deleteAsset(address: string, options?: DatabaseOptions): Promise<void>;

  /**
   * Find a Contact object by its Principal ID.
   * @param principal Princial ID
   * @returns Contact object or NULL if not found
   */
  abstract getContact(principal: string): Promise<Contact | null>;

  /**
   * Get all Contact objects from active agent.
   * @returns Array of found Contact objects or an empty
   * array if no Contact object were found
   */
  abstract getContacts(): Promise<Contact[]>;

  /**
   * Add a new Contact object to the list of Contact objects
   * current active agent has.
   * @param contact Contact object to be added
   */
  abstract addContact(contact: Contact, options?: DatabaseOptions): Promise<void>;

  /**
   * Find a Contact object by its Principal ID and replace it
   * with another Contact object with the date of update.
   * @param principal Principal ID
   * @param newDoc Contact object
   */
  abstract updateContact(principal: string, newDoc: Contact, options?: DatabaseOptions): Promise<void>;

  /**
   * Update Contacts in bulk.
   * @param newDocs Array of Allowance objects
   */
  abstract updateContacts(newDocs: Contact[], options?: DatabaseOptions): Promise<void>;

  /**
   * Find and remove a Contact object by its Principal ID.
   * @param principal Principal ID
   */
  abstract deleteContact(principal: string, options?: DatabaseOptions): Promise<void>;

  /**
   * Find a Allowance object.
   * @param id Primary Key
   * @returns Allowance object or NULL if not found
   */
  abstract getAllowance(id: string): Promise<TAllowance | null>;

  /**
   * Get all Allowance objects from active agent.
   * @returns Array of found Allowance objects or an empty
   * array if no Allowance object were found
   */
  abstract getAllowances(): Promise<TAllowance[]>;

  /**
   * Add a new Allowance object to the list of Allowance objects
   * current active agent has.
   * @param allowance Allowance object to be added
   */
  abstract addAllowance(allowance: TAllowance, options?: DatabaseOptions): Promise<void>;

  /**
   * Find a Allowance object and replace it
   * with another Allowance object with the date of update.
   * @param id Primary Key
   * @param newDoc Allowance object
   */
  abstract updateAllowance(id: string, newDoc: TAllowance, options?: DatabaseOptions): Promise<void>;

  /**
   * Update Allowances in bulk.
   * @param newDocs Array of Allowance objects
   */
  abstract updateAllowances(newDocs: TAllowance[], options?: DatabaseOptions): Promise<void>;

  /**
   * Find and remove a Allowance object.
   * @param id Primary Key
   */
  abstract deleteAllowance(id: string, options?: DatabaseOptions): Promise<void>;

  /**
   * Get all Services objects from active agent.
   * @returns Array of found Services objects or an empty
   * array if no Services object were found
   */
  abstract getServices(): Promise<ServiceData[]>;

  /**
   * Set Services objects to active User.
   * @param services Services array
   */
  abstract setServices(services: ServiceData[]): Promise<void>;

  /**
   * Find and remove a Service object by its Principal ID.
   * @param principal Principal ID
   */
  abstract deleteService(principal: string): Promise<void>;
}
