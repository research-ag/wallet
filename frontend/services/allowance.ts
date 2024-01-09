import { TAllowance, AllowancesTableColumns, AllowancesTableColumnsEnum } from "@/@types/allowance";
import { getFromLocalStorage, setInLocalStorage } from "../utils/localStorage";
import { SortOrder, SortOrderEnum } from "@/@types/common";
import {
  filterByAmount,
  filterByAsset,
  filterBySpender,
  sortByExpiration,
  sortBySubAccount,
} from "@/utils/allowanceSorters";

export const LOCAL_STORAGE_PREFIX = "allowances";

type ListAllowances = (
  tokenSymbol?: string,
  column?: AllowancesTableColumns,
  order?: SortOrder,
) => Promise<TAllowance[]>;

export const listAllowances: ListAllowances = (tokenSymbol, column, order = SortOrderEnum.Values.ASC) => {
  return new Promise((resolve) => {
    const allowances = getFromLocalStorage<TAllowance[]>(LOCAL_STORAGE_PREFIX);
    if (!allowances || !Array.isArray(allowances)) resolve([]);

    const filteredAllowances = tokenSymbol && allowances ? filterByAsset(tokenSymbol, allowances) : allowances;

    if (column === AllowancesTableColumnsEnum.Values.subAccount) {
      resolve(sortBySubAccount(order, filteredAllowances || []));
    }

    if (column === AllowancesTableColumnsEnum.Values.spender) {
      resolve(filterBySpender(order, filteredAllowances || []));
    }

    if (column === AllowancesTableColumnsEnum.Values.expiration) {
      resolve(sortByExpiration(order, filteredAllowances || []));
    }

    if (column === AllowancesTableColumnsEnum.Values.amount) {
      resolve(filterByAmount(order, filteredAllowances || []));
    }

    resolve([]);
  });
};

export function postAllowance(newAllowance: TAllowance): Promise<TAllowance> {
  return new Promise((resolve) => {
    let allowances = getFromLocalStorage<TAllowance[]>(LOCAL_STORAGE_PREFIX);

    if (!allowances || !Array.isArray(allowances)) {
      allowances = [newAllowance];
    }

    if (Array.isArray(allowances)) {
      allowances.push(newAllowance);
    }

    setInLocalStorage(LOCAL_STORAGE_PREFIX, allowances);
    resolve(newAllowance);
  });
}

export const updateAllowanceRequest = (newAllowance: TAllowance): Promise<TAllowance> => {
  return new Promise((resolve) => {
    const allowances = getFromLocalStorage<TAllowance[]>(LOCAL_STORAGE_PREFIX);
    if (Array.isArray(allowances)) {
      const newAllowances = allowances.map((allowance) => {
        if (allowance.id === newAllowance.id) {
          return { ...allowance, ...newAllowance };
        }
        return allowance;
      });
      setInLocalStorage(LOCAL_STORAGE_PREFIX, newAllowances);
    }
    resolve(newAllowance as TAllowance);
    return newAllowance as TAllowance;
  });
};

export function removeAllowance(id: string): Promise<void> {
  return new Promise((resolve) => {
    const allowances = getFromLocalStorage<TAllowance[]>(LOCAL_STORAGE_PREFIX);
    if (Array.isArray(allowances)) {
      const newAllowances = allowances.filter((allowance) => allowance.id !== id);
      setInLocalStorage(LOCAL_STORAGE_PREFIX, newAllowances);
    }
    resolve();
  });
}
