import { IWalletDatabase } from "@/database/i-wallet-database";
import { Contact } from "@redux/models/ContactsModels";
import { TAllowance } from "@/@types/allowance";
import { Identity } from "@dfinity/agent";
import { BehaviorSubject, Observable } from "rxjs";
import { Principal } from "@dfinity/principal";
import { defaultTokens } from "@/defaultTokens";
import { Asset } from "@redux/models/AccountModels";

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
  private readonly _tokens$: BehaviorSubject<Asset[]> = new BehaviorSubject<Asset[]>(this._getTokens());
  private readonly _contacts$: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>(this._getContacts());
  private readonly _allowances$: BehaviorSubject<TAllowance[]> = new BehaviorSubject<TAllowance[]>(
    this._getAllowances(),
  );

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
   * @param fixedPrincipal Watch-only login Principal ID
   */
  async setIdentity(identity: Identity | null, fixedPrincipal?: Principal): Promise<void> {
    this.principalId = fixedPrincipal?.toString() || identity?.getPrincipal().toText() || "";
    this._tokens$.next(this._getTokens());
    this._contacts$.next(this._getContacts());
    this._allowances$.next(this._getAllowances());
    !!this.principalId && this._doesRecordByPrincipalExist();
  }

  /**
   * Get a Token object by its ID.
   * @param address Address ID of a Token object
   * @returns Token object or NULL if not found
   */
  async getToken(address: string): Promise<Asset | null> {
    return this._getTokens().find((x) => x.address === address) || null;
  }

  /**
   * Get all Token objects from the active agent.
   * @returns Array of found Token objects or an empty
   * array if no Token objects were found
   */
  async getTokens(): Promise<Asset[]> {
    return this._getTokens();
  }

  /**
   * Add a new Token object to the list of Token objects
   * current active agent has.
   * @param token Token object to be added
   */
  async addToken(token: Asset): Promise<void> {
    const tokens = this._getTokens();
    this._setTokens([...tokens, token]);
  }

  /**
   * Find a Token object by its ID and replace it with
   * another Token object with the date of update.
   * @param address Address ID of a Token object
   * @param newDoc Token object
   */
  async updateToken(address: string, newDoc: Asset): Promise<void> {
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
   * Update Contacts in bulk.
   * @param newDocs Array of Allowance objects
   */
  async updateContacts(newDocs: Contact[]): Promise<void> {
    this._setContacts(newDocs);
  }

  /**
   * Find and remove a Contact object by its Principal ID.
   * @param principal Principal ID
   */
  async deleteContact(principal: string): Promise<void> {
    this._setContacts(this._getContacts().filter((cnts) => cnts.principal !== principal));
  }

  /**
   * Find a Allowance object.
   * @param id Primary Key
   * @returns Allowance object or NULL if not found
   */
  async getAllowance(id: string): Promise<TAllowance | null> {
    return this._getAllowances().find((x) => x.id === id) || null;
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
  async addAllowance(allowance: TAllowance): Promise<void> {
    const allowances = this._getAllowances();
    this._setAllowances([...allowances, allowance]);
  }

  /**
   * Find a Allowance object and replace it
   * with another Allowance object with the date of update.
   * @param id Primary Key
   * @param newDoc Allowance object
   */
  async updateAllowance(id: string, newDoc: TAllowance): Promise<void> {
    this._setAllowances(
      this._getAllowances().map((allowance) => {
        if (allowance.id === id) {
          return newDoc;
        } else return allowance;
      }),
    );
  }

  /**
   * Update Allowances in bulk.
   * @param newDocs Array of Allowance objects
   */
  async updateAllowances(newDocs: TAllowance[]): Promise<void> {
    this._setAllowances(newDocs);
  }

  /**
   * Find and remove a Allowance object.
   * @param id Primary Key
   */
  async deleteAllowance(id: string): Promise<void> {
    this._setAllowances(this._getAllowances().filter((allowance) => allowance.id !== id));
  }

  /**
   * Subscribable Observable that triggers after
   * a new Identity has been set.
   * @returns Array of Token objects from current
   * active agent
   */
  subscribeToAllTokens(): Observable<Asset[]> {
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

  /**
   * Subscribable Observable that trigger after
   * a new Identity has been set.
   * @returns Array of Allowances objects from current
   * active agent
   */
  subscribeToAllAllowances(): Observable<TAllowance[]> {
    return this._allowances$.asObservable();
  }

  private _getTokens(): Asset[] {
    const tokensData = JSON.parse(localStorage.getItem(`assets-${this.principalId}`) || "null");
    return tokensData || [];
  }

  private _setTokens(allTokens: Asset[]) {
    const tokens = [...allTokens].sort((a, b) => a.sortIndex - b.sortIndex);
    localStorage.setItem(`assets-${this.principalId}`, JSON.stringify(tokens));
    this._tokens$.next(tokens);
  }

  private _getContacts(): Contact[] {
    const contactsData = JSON.parse(localStorage.getItem(`contacts-${this.principalId}`) || "null");
    return contactsData || [];
  }

  private _setContacts(contacts: Contact[]) {
    localStorage.setItem(`contacts-${this.principalId}`, JSON.stringify(contacts));
    this._contacts$.next(contacts);
  }

  private _getAllowances(): TAllowance[] {
    const allowancesData = JSON.parse(localStorage.getItem(`allowances-${this.principalId}`) || "null");
    return allowancesData || [];
  }

  private _setAllowances(allowances: TAllowance[]) {
    localStorage.setItem(`allowances-${this.principalId}`, JSON.stringify(allowances));
    this._allowances$.next(allowances);
  }

  private _doesRecordByPrincipalExist() {
    // Look for entry record by current prinicpal ID
    const exist = !!localStorage.getItem(`assets-${this.principalId}`);

    // If does not exist it means that this is a brand new account
    if (!exist) {
      this._setTokens([...defaultTokens]);
      this._tokens$.next(this._getTokens());
    }
  }
}
