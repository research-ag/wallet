import { IWalletDatabase } from "@/database/i-wallet-database";
import { Token } from "@redux/models/TokenModels";
import { Contact } from "@redux/models/ContactsModels";
import { Identity } from "@dfinity/agent";
import { BehaviorSubject, Observable } from "rxjs";

export class LocalStorageDatabase extends IWalletDatabase {
  private static _instance: LocalStorageDatabase | undefined;
  public static get instance(): LocalStorageDatabase {
    if (!this._instance) {
      this._instance = new LocalStorageDatabase();
    }
    return this._instance!;
  }

  private authPrincipal = "";

  init(): Promise<void> {
    return Promise.resolve();
  }

  setIdentity(identity: Identity | null): void {
    this.authPrincipal = identity?.getPrincipal().toText() || "";
    this.tokens$.next(this._getTokens());
    this.contacts$.next(this._getContacts());
  }

  private readonly tokens$: BehaviorSubject<Token[]> = new BehaviorSubject<Token[]>(this._getTokens());

  private _getTokens(): Token[] {
    const userData = JSON.parse(localStorage.getItem(this.authPrincipal) || "null");
    return userData?.tokens || [];
  }

  async getToken(id_number: number): Promise<Token | null> {
    return this._getTokens().find((x) => x.id_number === id_number) || null;
  }

  async getTokens(): Promise<Token[]> {
    return this._getTokens();
  }

  subscribeToAllTokens(): Observable<Token[]> {
    return this.tokens$.asObservable();
  }

  async addToken(token: Token): Promise<void> {
    const tokens = this._getTokens();
    this.setTokens([...tokens, token]);
  }

  async updateToken(id_number: number, newDoc: Token): Promise<void> {
    this.setTokens(
      this._getTokens().map((tkn) => {
        if (tkn.id_number === id_number) {
          return newDoc;
        } else return tkn;
      }),
    );
  }

  private setTokens(allTokens: Token[]) {
    const tokens = allTokens.sort((a, b) => {
      return a.id_number - b.id_number;
    });
    localStorage.setItem(
      this.authPrincipal,
      JSON.stringify({
        from: "II",
        tokens,
      }),
    );
    this.tokens$.next(tokens);
  }

  private readonly contacts$: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>(this._getContacts());

  async getContact(principal: string): Promise<Contact | null> {
    return this._getContacts().find((x) => x.principal === principal) || null;
  }

  private _getContacts(): Contact[] {
    const contactsData = JSON.parse(localStorage.getItem("contacts-" + this.authPrincipal) || "null");
    return contactsData?.contacts || [];
  }

  async getContacts(): Promise<Contact[]> {
    return this._getContacts();
  }

  subscribeToAllContacts(): Observable<Contact[]> {
    return this.contacts$.asObservable();
  }

  async addContact(contact: Contact): Promise<void> {
    const contacts = this._getContacts();
    this.setContacts([...contacts, contact]);
  }

  async updateContact(principal: string, newDoc: Contact): Promise<void> {
    this.setContacts(
      this._getContacts().map((cnts) => {
        if (cnts.principal === principal) {
          return newDoc;
        } else return cnts;
      }),
    );
  }

  async deleteContact(principal: string): Promise<void> {
    this.setContacts(this._getContacts().filter((cnts) => cnts.principal !== principal));
  }

  private setContacts(contacts: Contact[]) {
    localStorage.setItem(
      "contacts-" + this.authPrincipal,
      JSON.stringify({
        contacts,
      }),
    );
    this.contacts$.next(contacts);
  }
}
