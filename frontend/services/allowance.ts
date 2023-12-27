import { Allowance } from "@/@types/allowance";
import { getFromLocalStorage, setInLocalStorage } from "../utils/localStorage";

const LOCAL_STORAGE_PREFIX = "allowances";

export function listAllowances(tokenSymbol?: string): Promise<Allowance[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allowances = getFromLocalStorage<Allowance[]>(LOCAL_STORAGE_PREFIX);

      const filteredAllowances = allowances?.filter((allowance) => {
        return allowance?.asset?.tokenSymbol === tokenSymbol;
      });

      resolve(filteredAllowances || []);
    }, 2000);
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
