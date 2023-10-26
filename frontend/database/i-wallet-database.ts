import { AuthNetwork, Token } from "@redux/models/TokenModels";
import { Contact } from "@redux/models/ContactsModels";
import { Identity } from "@dfinity/agent";
import { Observable } from "rxjs";

export abstract class IWalletDatabase {
  abstract init(): Promise<void>;

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

  setNetworkType(value: AuthNetwork): void {
    localStorage.setItem("network_type", JSON.stringify({
      type: value.type,
      network: value.network,
      name: value.name,
    }));
  }

  // user data
  abstract setIdentity(identity: Identity | null): void;

  abstract getToken(id_number: number): Promise<Token | null>;

  abstract getTokens(): Promise<Token[]>;

  abstract subscribeToAllTokens(): Observable<Token[]>;

  abstract addToken(token: Token): Promise<void>;

  abstract updateToken(id_number: number, newDoc: Token): Promise<void>;

  abstract getContact(principal: string): Promise<Contact | null>;

  abstract getContacts(): Promise<Contact[]>;

  abstract subscribeToAllContacts(): Observable<Contact[]>;

  abstract addContact(contact: Contact): Promise<void>;

  abstract updateContact(principal: string, newDoc: Contact): Promise<void>;

  abstract deleteContact(principal: string): Promise<void>;
}
