import { AuthNetwork, Token } from "@redux/models/TokenModels";
import { Contact } from "@redux/models/ContactsModels";
import { Identity } from "@dfinity/agent";

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

  abstract getTokens(): Promise<Token[]>;

  abstract setTokens(allTokens: Token[]): Promise<void>;

  abstract getContacts(): Promise<Contact[]>;

  abstract setContacts(allContacts: Contact[]): Promise<void>;
}
