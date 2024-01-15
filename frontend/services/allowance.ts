import { TAllowance } from "@/@types/allowance";
import { getFromLocalStorage, setInLocalStorage } from "../utils/localStorage";
import store from "@redux/Store";

export const LOCAL_STORAGE_PREFIX = `allowances-${store.getState().auth.userPrincipal.toText()}`;

export function postAllowance(newAllowance: TAllowance): Promise<TAllowance[]> {
  return new Promise((resolve) => {
    let allowances = getFromLocalStorage<TAllowance[]>(LOCAL_STORAGE_PREFIX);

    if (!allowances || !Array.isArray(allowances)) {
      allowances = [newAllowance];
    }

    if (Array.isArray(allowances)) {
      const allowanceId = newAllowance.id;
      allowances = allowances.filter((allowance) => allowance.id !== allowanceId);
      allowances.push(newAllowance);
    }

    setInLocalStorage(LOCAL_STORAGE_PREFIX, allowances);
    resolve(allowances);
  });
}

export const updateAllowanceRequest = (newAllowance: TAllowance): Promise<TAllowance[]> => {
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
      resolve(newAllowances);
    }

    resolve(allowances || []);
  });
};

export function removeAllowance(id: string): Promise<TAllowance[]> {
  return new Promise((resolve) => {
    const allowances = getFromLocalStorage<TAllowance[]>(LOCAL_STORAGE_PREFIX);
    if (Array.isArray(allowances)) {
      const newAllowances = allowances.filter((allowance) => allowance.id !== id);
      setInLocalStorage(LOCAL_STORAGE_PREFIX, newAllowances);
      resolve(newAllowances);
    }
    resolve(allowances || []);
  });
}
