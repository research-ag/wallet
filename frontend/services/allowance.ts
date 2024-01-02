import { Allowance, AllowancesTableColumns } from "@/@types/allowance";
import { getFromLocalStorage, setInLocalStorage } from "../utils/localStorage";
import { SortOrder } from "@/@types/common";

export const LOCAL_STORAGE_PREFIX = "allowances";

export function listAllowances(
  tokenSymbol?: string,
  column?: AllowancesTableColumns,
  order?: SortOrder,
): Promise<Allowance[]> {
  return new Promise((resolve) => {
    const allowances = getFromLocalStorage<Allowance[]>(LOCAL_STORAGE_PREFIX);

    const filteredAllowances = allowances?.filter((allowance) => {
      return allowance?.asset?.tokenSymbol === tokenSymbol;
    });

    let sorted;

    if (column === AllowancesTableColumns.subAccount) {
      console.log(`sort by ${column} in order ${order}`);
    }

    if (column === AllowancesTableColumns.spender) {
      // sort asc or desc, first spender with no name and later spender with name.
      console.log(`filter by ${column} in order ${order}`);
    }

    if (column === AllowancesTableColumns.expiration) {
      // sort asc or desc, first where noExpire is true and later order by date
      console.log(`filter by ${column} in order ${order}`);
    }

    if (column === AllowancesTableColumns.amount) {
      // sort asc or desc, depending of the amount
      console.log(`filter by ${column} in order ${order}`);
    }

    resolve(sorted || filteredAllowances || []);
  });
}

export function postAllowance(newAllowance: Allowance): Promise<Allowance> {
  return new Promise((resolve) => {
    let allowances = getFromLocalStorage<Allowance[]>(LOCAL_STORAGE_PREFIX);

    if (!allowances || !Array.isArray(allowances)) {
      allowances = [newAllowance];
    }

    if (Array.isArray(allowances)) {
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
