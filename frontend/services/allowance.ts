import { Allowance } from "@/@types/allowance";
import { getFromLocalStorage, setInLocalStorage } from "../utils/localStorage";

const LOCAL_STORAGE_PREFIX = "allowances";

export function listAllowances(): Promise<Allowance[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allowances = getFromLocalStorage<Allowance[]>(LOCAL_STORAGE_PREFIX);
      resolve(allowances || []);
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
