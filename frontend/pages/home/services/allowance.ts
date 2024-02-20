import { TAllowance } from "@/@types/allowance";
import store from "@redux/Store";
import { getToCreateAllowance } from "../helpers/allowanceMappers";

export const LOCAL_STORAGE_PREFIX = `allowances-${store.getState()?.auth?.userPrincipal?.toText()}`;

function getAllowanceKey(principal?: string) {
  if (principal) return `allowances-${principal}`;
  return LOCAL_STORAGE_PREFIX;
}

export function getAllowancesFromStorage(principal?: string): TAllowance[] {
  const storageAllowances = localStorage.getItem(getAllowanceKey(principal));
  return JSON.parse(storageAllowances || "[]") as TAllowance[];
}

export function replaceAllowancesToStorage(allowances: TAllowance[], principal?: string) {
  localStorage.setItem(getAllowanceKey(principal), JSON.stringify(allowances.map(getToCreateAllowance)));
  return allowances;
}
