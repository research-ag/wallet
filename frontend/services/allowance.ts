import { Allowance, AllowancesTableColumns } from "@/@types/allowance";
import { getFromLocalStorage, setInLocalStorage } from "../utils/localStorage";
import { SortOrder } from "@/@types/common";
import {
  filterByAmount,
  filterByAsset,
  filterBySpender,
  sortByExpiration,
  sortBySubAccount,
} from "@/utils/allowanceSorters";
import store from "@redux/Store";

export const LOCAL_STORAGE_PREFIX = `allowances-${store.getState().auth.userPrincipal.toText()}`;

type ListAllowances = (
  tokenSymbol?: string,
  column?: AllowancesTableColumns,
  order?: SortOrder,
) => Promise<Allowance[]>;

export const listAllowances: ListAllowances = (tokenSymbol, column, order = SortOrder.ASC) => {
  return new Promise((resolve) => {
    const allowances = getFromLocalStorage<Allowance[]>(LOCAL_STORAGE_PREFIX);
    if (!allowances || !Array.isArray(allowances)) resolve([]);

    const filteredAllowances = tokenSymbol && allowances ? filterByAsset(tokenSymbol, allowances) : allowances;

    if (column === AllowancesTableColumns.subAccount) {
      resolve(sortBySubAccount(order, filteredAllowances || []));
    }

    if (column === AllowancesTableColumns.spender) {
      resolve(filterBySpender(order, filteredAllowances || []));
    }

    if (column === AllowancesTableColumns.expiration) {
      resolve(sortByExpiration(order, filteredAllowances || []));
    }

    if (column === AllowancesTableColumns.amount) {
      resolve(filterByAmount(order, filteredAllowances || []));
    }

    resolve([]);
  });
};

export function postAllowance(newAllowance: Allowance): Promise<Allowance> {
  return new Promise((resolve) => {
    let allowances = getFromLocalStorage<Allowance[]>(LOCAL_STORAGE_PREFIX);

    if (!allowances || !Array.isArray(allowances)) {
      allowances = [newAllowance];
    }

    if (Array.isArray(allowances)) {
      const allowanceId = newAllowance.id;
      allowances = allowances.filter((allowance) => allowance.id !== allowanceId);
      allowances.push(newAllowance);
    }

    setTimeout(() => {
      setInLocalStorage(LOCAL_STORAGE_PREFIX, allowances);
      resolve(newAllowance);
    }, 500);
  });
}

export const updateAllowanceRequest = (newAllowance: Allowance): Promise<Allowance> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allowances = getFromLocalStorage<Allowance[]>(LOCAL_STORAGE_PREFIX);
      if (Array.isArray(allowances)) {
        const newAllowances = allowances.map((allowance) => {
          if (allowance.id === newAllowance.id) {
            return { ...allowance, ...newAllowance };
          }
          return allowance;
        });
        setInLocalStorage(LOCAL_STORAGE_PREFIX, newAllowances);
      }
      resolve(newAllowance as Allowance);
    }, 500);
    return newAllowance as Allowance;
  });
};

export function removeAllowance(id: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allowances = getFromLocalStorage<Allowance[]>(LOCAL_STORAGE_PREFIX);
      if (Array.isArray(allowances)) {
        const newAllowances = allowances.filter((allowance) => allowance.id !== id);
        setInLocalStorage(LOCAL_STORAGE_PREFIX, newAllowances);
      }
      resolve();
    }, 500);
  });
}