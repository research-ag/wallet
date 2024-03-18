import { AuthNetwork, Token } from "@redux/models/TokenModels";
import { Contact } from "@redux/models/ContactsModels";
import { TAllowance } from "@/@types/allowance";
import { Identity } from "@dfinity/agent";
import { Observable } from "rxjs";
import { Principal } from "@dfinity/principal";
import { DB_Type } from "./db";

export abstract class IWalletDatabase {
  /**
   * Retrieves the current language setting from local storage.
   * 
   * @returns The language code stored in local storage, or null if not set.
   */
  getLanguage(): string | null {
    return localStorage.getItem("language");
  }

  /**
     * Sets the language setting in local storage.
     * 
     * @param value The language code to store.
     */
  setLanguage(value: string): void {
    localStorage.setItem("language", value);
  }

  /**
     * Retrieves the current theme setting from local storage.
     * 
     * @returns The theme value ("dark" or "light") stored in local storage, or null if not set.
     */
  getTheme(): "dark" | "light" | null {
    return localStorage.theme;
  }

  /**
    * Sets the theme setting in local storage.
    * 
    * @param value The theme value ("dark" or "light") to store.
    */
  setTheme(value: "dark" | "light"): void {
    localStorage.theme = value;
  }

  /**
   * Retrieves the current network type setting from local storage.
   * 
   * @returns The parsed network type object from local storage, or null if not set.
   */
  getNetworkType(): AuthNetwork | null {
    return JSON.parse(localStorage.getItem("network_type") || "null");
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
    console.log("i wallet database db-location: ", value);
    localStorage.dbLocation = value;
  }

  /**
   * Retrieves the current custom database canister ID setting from local storage.
   * 
   * @returns The custom database canister ID value from local storage, or null if not set.
   */
  getCustomDbCanisterId(): string | null {
    return localStorage.getItem("customDbCanisterId");
  }

  /**
   * Sets the custom database canister ID setting in local storage.
   * 
   * @param value The custom database canister ID value to store.
   */
  setCustomDbCanisterId(value: string): void {
    localStorage.setItem("customDbCanisterId", value);
  }

  /**
   * Retrieves the current network type setting from local storage.
   * 
   * @returns The parsed network type object from local storage, or null if not set.
   */
  setNetworkType(value: AuthNetwork): void {
    localStorage.setItem(
      "network_type",
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
  abstract setIdentity(identity: Identity | null, fixedPrincipal?: Principal): void;

  /**
   * Get a Token object by its ID.
   * @param address Address ID of a Token object
   * @returns Token object or NULL if not found
   */
  abstract getToken(address: string): Promise<Token | null>;

  /**
   * Get all Token objects from the active agent.
   * @returns Array of found Token objects or an empty
   * array if no Token objects were found
   */
  abstract getTokens(): Promise<Token[]>;

  /**
   * Subscribable Observable that triggers after
   * a new Identity has been set.
   * @returns Array of Token objects from current
   * active agent
   */
  abstract subscribeToAllTokens(): Observable<Token[]>;

  /**
   * Add a new Token object to the list of Token objects
   * current active agent has.
   * @param token Token object to be added
   */
  abstract addToken(token: Token): Promise<void>;

  /**
   * Find a Token object by its ID and replace it with
   * another Token object with the date of update.
   * @param address Address ID of a Token object
   * @param newDoc Token object
   */
  abstract updateToken(address: string, newDoc: Token): Promise<void>;

  /**
   * Find and remove a Token object by its ID.
   * @param address Address ID of a Token object
   */
  abstract deleteToken(address: string): Promise<void>;

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
   * Subscribable Observable that trigger after
   * a new Identity has been set.
   * @returns Array of Contact objects from current
   * active agent
   */
  abstract subscribeToAllContacts(): Observable<Contact[]>;

  /**
   * Add a new Contact object to the list of Contact objects
   * current active agent has.
   * @param contact Contact object to be added
   */
  abstract addContact(contact: Contact): Promise<void>;

  /**
   * Find a Contact object by its Principal ID and replace it
   * with another Contact object with the date of update.
   * @param principal Principal ID
   * @param newDoc Contact object
   */
  abstract updateContact(principal: string, newDoc: Contact): Promise<void>;

  /**
   * Update Contacts in bulk.
   * @param newDocs Array of Allowance objects
   */
  abstract updateContacts(newDocs: Contact[]): Promise<void>;

  /**
   * Find and remove a Contact object by its Principal ID.
   * @param principal Principal ID
   */
  abstract deleteContact(principal: string): Promise<void>;

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
   * Subscribable Observable that trigger after
   * a new Identity has been set.
   * @returns Array of Allowances objects from current
   * active agent
   */
  abstract subscribeToAllAllowances(): Observable<TAllowance[]>;

  /**
   * Add a new Allowance object to the list of Allowance objects
   * current active agent has.
   * @param allowance Allowance object to be added
   */
  abstract addAllowance(allowance: TAllowance): Promise<void>;

  /**
   * Find a Allowance object and replace it
   * with another Allowance object with the date of update.
   * @param id Primary Key
   * @param newDoc Allowance object
   */
  abstract updateAllowance(id: string, newDoc: TAllowance): Promise<void>;

  /**
   * Update Allowances in bulk.
   * @param newDocs Array of Allowance objects
   */
  abstract updateAllowances(newDocs: TAllowance[]): Promise<void>;

  /**
   * Find and remove a Allowance object.
   * @param id Primary Key
   */
  abstract deleteAllowance(id: string): Promise<void>;
}
