import { IWalletDatabase } from "@/database/i-wallet-database";
import { Contact } from "@redux/models/ContactsModels";
import { TAllowance } from "@/@types/allowance";
import { Identity } from "@dfinity/agent";
import { BehaviorSubject, Observable } from "rxjs";
import { Principal } from "@dfinity/principal";
import { defaultTokens } from "@/defaultTokens";
import { Asset } from "@redux/models/AccountModels";
import store from "@redux/Store";
import { setAssets } from "@redux/assets/AssetReducer";
import { setReduxContacts } from "@redux/contacts/ContactsReducer";
import { setReduxAllowances } from "@redux/allowance/AllowanceReducer";

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
  private readonly _assets$: BehaviorSubject<Asset[]> = new BehaviorSubject<Asset[]>(this._getAssets());
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
    this._doesRecordByPrincipalExist();
    //
    this.assetStateSync();
    this.contactStateSync();
    this.allowanceStateSync();
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
  async addAssets(asset: Asset): Promise<void> {
    const assets = this._getAssets();
    this._setAssets([...assets, asset]);
  }

  assetStateSync(newAssets?: Asset[]): void {
    const assets = newAssets || this._getAssets();
    store.dispatch(setAssets(assets));
  }

  /**
   * Find a Asset object by its ID and replace it with
   * another Asset object with the date of update.
   * @param address Address ID of a Asset object
   * @param newDoc Asset object
   */
  async updateAsset(address: string, newDoc: Asset): Promise<void> {
    this._setAssets(
      this._getAssets().map((tkn) => {
        if (tkn.address === address) {
          return newDoc;
        } else return tkn;
      }),
    );
  }

  /**
   * Find and remove a Asset object by its ID.
   * @param address Address ID of a Asset object
   */
  async deleteAsset(address: string): Promise<void> {
    this._setAssets(this._getAssets().filter((tkn) => tkn.address !== address));
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

  contactStateSync(newContacts?: Contact[]): void {
    const contacts = newContacts || this._getContacts();
    store.dispatch(setReduxContacts(contacts));
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

  allowanceStateSync(newAllowances?: TAllowance[]): void {
    const allowances = newAllowances || this._getAllowances();
    store.dispatch(setReduxAllowances(allowances));
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
   * @returns Array of Asset objects from current
   * active agent
   */
  subscribeToAllAssets(): Observable<Asset[]> {
    return this._assets$.asObservable();
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

  private _getAssets(): Asset[] {
    const assetsData = JSON.parse(localStorage.getItem(`assets-${this.principalId}`) || "null");
    return assetsData || [];
  }

  private _setAssets(allAssets: Asset[]) {
    const assets = [...allAssets].sort((a, b) => a.sortIndex - b.sortIndex);
    localStorage.setItem(`assets-${this.principalId}`, JSON.stringify(assets));
    this._assets$.next(assets);
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

    if (!assetExist) this._setAssets([...defaultTokens]);
    if (!contactExist) this._setContacts([]);
    if (!allowanceExist) this._setAllowances([]);
  }
}
