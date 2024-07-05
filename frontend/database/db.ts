import { RxdbDatabase } from "@/database/rxdb";
import { IWalletDatabase } from "@/database/i-wallet-database";
import { LocalStorageDatabase } from "@/database/local-storage";

export enum DB_Type {
  LOCAL = "local",
  CANISTER = "rxdb",
}

export const localDb = () => LocalStorageDatabase.instance;

export const rxDb = () => RxdbDatabase.instance;

export const db: () => IWalletDatabase = () => {
  return localStorage.getItem("dbLocation") === DB_Type.CANISTER ? rxDb() : localDb();
};
