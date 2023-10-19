import { IWalletDatabase } from "@/database/i-wallet-database";
import { Token } from "@redux/models/TokenModels";
import { Contact } from "@redux/models/ContactsModels";
import { Identity } from "@dfinity/agent";

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
  }

  async getTokens(): Promise<Token[]> {
    const userData = JSON.parse(localStorage.getItem(this.authPrincipal) || "null");
    return userData?.tokens || [];
  }

  async setTokens(allTokens: Token[]): Promise<void> {
    localStorage.setItem(this.authPrincipal, JSON.stringify({
      from: "II",
      tokens: allTokens.sort((a, b) => {
        return a.id_number - b.id_number;
      }),
    }));
  }

  async getContacts(): Promise<Contact[]> {
    const contactsData = JSON.parse(localStorage.getItem("contacts-" + this.authPrincipal) || "null");
    return contactsData?.contacts || [];
  }

  async setContacts(contacts: Contact[]): Promise<void> {
    localStorage.setItem(
      "contacts-" + this.authPrincipal,
      JSON.stringify({
        contacts,
      }),
    )
  }

}
