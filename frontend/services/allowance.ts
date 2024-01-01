import { Allowance } from "@/@types/allowance";
import { getFromLocalStorage, setInLocalStorage } from "../utils/localStorage";

export const LOCAL_STORAGE_PREFIX = "allowances";

export function listAllowances(tokenSymbol?: string): Promise<Allowance[]> {
  return new Promise((resolve) => {
    const allowances = getFromLocalStorage<Allowance[]>(LOCAL_STORAGE_PREFIX);
    const filteredAllowances = allowances?.filter((allowance) => {
      return allowance?.asset?.tokenSymbol === tokenSymbol;
    });
    resolve(filteredAllowances || []);
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
    }, 5000);
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
    }, 2000);
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
    }, 2000);
  });
}
