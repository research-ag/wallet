import { AuthNetwork, Token } from "@redux/models/TokenModels";
import { Contact } from "@redux/models/ContactsModels";
import { Identity } from "@dfinity/agent";
import { Observable } from "rxjs";

export abstract class IWalletDatabase {
  // various client settings
  getLanguage(): string | null {
    return localStorage.getItem("language");
  }

  setLanguage(value: string): void {
    localStorage.setItem("language", value);
  }

  getTheme(): "dark" | "light" | null {
    return localStorage.theme;
  }

  setTheme(value: "dark" | "light"): void {
    localStorage.theme = value;
  }

  getNetworkType(): AuthNetwork | null {
    return JSON.parse(localStorage.getItem("network_type") || "null");
  }

  getDbLocation(): "local" | "rxdb" | null {
    return localStorage.dbLocation;
  }

  setDbLocation(value: "local" | "rxdb"): void {
    localStorage.dbLocation = value;
  }

  getCustomDbCanisterId(): string | null {
    return localStorage.getItem("customDbCanisterId");
  }

  setCustomDbCanisterId(value: string): void {
    localStorage.setItem("customDbCanisterId", value);
  }

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
   * Initialice all necessary external systema and
   * data structure before first use.
   */
  abstract init(): Promise<void>;

  /**
   * Set Identity object or fixed Principal ID
   * as current active agent.
   * @param identity Identity object
   * @param principalId Principal ID
   */
  abstract setIdentity(identity: Identity | null): void;

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
   * Find and remove a Contact object by its Principal ID.
   * @param principal Principal ID
   */
  abstract deleteContact(principal: string): Promise<void>;
}
