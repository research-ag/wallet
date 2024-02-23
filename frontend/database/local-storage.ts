import { IWalletDatabase } from "@/database/i-wallet-database";
import { Token } from "@redux/models/TokenModels";
import { Contact } from "@redux/models/ContactsModels";
import { Identity } from "@dfinity/agent";
import { BehaviorSubject, Observable } from "rxjs";
import { defaultTokens } from "@/defaultTokens";

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
  private readonly _tokens$: BehaviorSubject<Token[]> = new BehaviorSubject<Token[]>(this._getTokens());
  private readonly _contacts$: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>(this._getContacts());

  /**
   * Initialice all necessary external systema and
   * data structure before first use.
   */
  init(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Set Identity object or fixed Principal ID
   * as current active agent.
   * @param identity Identity object
   * @param principalId Principal ID
   */
  setIdentity(identity: Identity | null): void {
    this.principalId = identity?.getPrincipal().toText() || "";
    this._tokens$.next(this._getTokens());
    this._contacts$.next(this._getContacts());
    !!this.principalId && this._doesRecordByPrincipalExist();
  }

  /**
   * Get a Token object by its ID.
   * @param address Address ID of a Token object
   * @returns Token object or NULL if not found
   */
  async getToken(address: string): Promise<Token | null> {
    return this._getTokens().find((x) => x.address === address) || null;
  }

  /**
   * Get all Token objects from the active agent.
   * @returns Array of found Token objects or an empty
   * array if no Token objects were found
   */
  async getTokens(): Promise<Token[]> {
    return this._getTokens();
  }

  /**
   * Add a new Token object to the list of Token objects
   * current active agent has.
   * @param token Token object to be added
   */
  async addToken(token: Token): Promise<void> {
    const tokens = this._getTokens();
    this._setTokens([...tokens, token]);
  }

  /**
   * Find a Token object by its ID and replace it with
   * another Token object with the date of update.
   * @param address Address ID of a Token object
   * @param newDoc Token object
   */
  async updateToken(address: string, newDoc: Token): Promise<void> {
    this._setTokens(
      this._getTokens().map((tkn) => {
        if (tkn.address === address) {
          return newDoc;
        } else return tkn;
      }),
    );
  }

  /**
   * Find and remove a Token object by its ID.
   * @param address Address ID of a Token object
   */
  async deleteToken(address: string): Promise<void> {
    this._setTokens(this._getTokens().filter((tkn) => tkn.address !== address));
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
  async addContact(contact: Contact): Promise<void> {
    const contacts = this._getContacts();
    this._setContacts([...contacts, contact]);
  }

  /**
   * Find a Contact object by its Principal ID and replace it
   * with another Contact object with the date of update.
   * @param principal Principal ID
   * @param newDoc Contact object
   */
  async updateContact(principal: string, newDoc: Contact): Promise<void> {
    this._setContacts(
      this._getContacts().map((cnts) => {
        if (cnts.principal === principal) {
          return newDoc;
        } else return cnts;
      }),
    );
  }

  /**
   * Find and remove a Contact object by its Principal ID.
   * @param principal Principal ID
   */
  async deleteContact(principal: string): Promise<void> {
    this._setContacts(this._getContacts().filter((cnts) => cnts.principal !== principal));
  }

  /**
   * Subscribable Observable that triggers after
   * a new Identity has been set.
   * @returns Array of Token objects from current
   * active agent
   */
  subscribeToAllTokens(): Observable<Token[]> {
    return this._tokens$.asObservable();
  }

  /**
   * Subscribable Observable that trigger after
   * a new Identity has been set.
   * @returns Array of Contact objects from current
   * active agent
   */
  subscribeToAllContacts(): Observable<Contact[]> {
    return this._contacts$.asObservable();
  }

  private _getTokens(): Token[] {
    const userData = JSON.parse(localStorage.getItem(`tokens-${this.principalId}`) || "null");
    return userData?.tokens || [];
  }

  private _setTokens(allTokens: Token[]) {
    const tokens = allTokens.sort((a, b) => {
      return a.id_number - b.id_number;
    });
    localStorage.setItem(
      `tokens-${this.principalId}`,
      JSON.stringify({
        from: "II",
        tokens,
      }),
    );
    this._tokens$.next(tokens);
  }

  private _getContacts(): Contact[] {
    const contactsData = JSON.parse(localStorage.getItem(`contacts-${this.principalId}`) || "null");
    return contactsData?.contacts || [];
  }

  private _setContacts(contacts: Contact[]) {
    localStorage.setItem(
      `contacts-${this.principalId}`,
      JSON.stringify({
        contacts,
      }),
    );
    this._contacts$.next(contacts);
  }

  private _doesRecordByPrincipalExist() {
    // Look for entry record by current prinicpal ID
    const exist = !!localStorage.getItem(`tokens-${this.principalId}`);

    // If does not exist it means that this is a brand new account
    if (!exist) {
      this._setTokens(defaultTokens);
      this._tokens$.next(this._getTokens());
    }
  }
}
