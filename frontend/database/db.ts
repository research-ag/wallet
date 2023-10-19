import { RxdbDatabase } from "@/database/rxdb.database";
import { IWalletDatabase } from "@/database/i-wallet-database";
import { LocalStorageDatabase } from "@/database/local-storage.database";


const _db: IWalletDatabase = import.meta.env.VITE_DB_STORAGE === "rxdb" ? RxdbDatabase.instance : LocalStorageDatabase.instance;
export const db: () => IWalletDatabase = () => {
  return _db;
};
