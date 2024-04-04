import { RxdbDatabase } from "@/database/rxdb";
import { IWalletDatabase } from "@/database/i-wallet-database";
import { LocalStorageDatabase } from "@/database/local-storage";

export enum DB_Type {
  LOCAL = "local",
  CANISTER = "rxdb",
}

export const localDb = () => LocalStorageDatabase.instance;

export const rxDb = () => RxdbDatabase.instance;

// TODO: enable switching between local and rxdb

export const db: () => IWalletDatabase = () => {
  return localDb();
};
