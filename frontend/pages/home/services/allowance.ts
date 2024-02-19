import { TAllowance } from "@/@types/allowance";
import store from "@redux/Store";

export const LOCAL_STORAGE_PREFIX = `allowances-${store.getState()?.auth?.userPrincipal?.toText()}`;

function getAllowanceKey(principal?: string) {
  if (principal) return `allowances-${principal}`;
  return LOCAL_STORAGE_PREFIX;
}

export function getAllowancesFromStorage(principal?: string): TAllowance[] {
  const storageAllowances = localStorage.getItem(getAllowanceKey(principal));
  return JSON.parse(storageAllowances || "[]") as TAllowance[];
}

export function postAllowanceToStorage(newAllowance: TAllowance, principal?: string): TAllowance[] {
  const allowances = getAllowancesFromStorage(principal);
  const newAllowances = [...allowances, newAllowance];
  localStorage.setItem(getAllowanceKey(principal), JSON.stringify(newAllowances));
  return newAllowances;
}

export const putAllowanceToStorage = (updatedAllowance: TAllowance, principal?: string): TAllowance[] => {
  const allowances = getAllowancesFromStorage(principal);

  const filteredAllowances = allowances.filter((allowance) =>
    Boolean(
      allowance.subAccountId !== updatedAllowance.subAccountId ||
        allowance.spender !== updatedAllowance.spender ||
        allowance.asset.tokenSymbol !== updatedAllowance.asset.tokenSymbol,
    ),
  );

  const newAllowances = [...filteredAllowances, updatedAllowance];
  localStorage.setItem(LOCAL_STORAGE_PREFIX, JSON.stringify(newAllowances));
  return newAllowances;
};

export function replaceAllowancesToStorage(allowances: TAllowance[], principal?: string) {
  localStorage.setItem(getAllowanceKey(principal), JSON.stringify(allowances));
  return allowances;
}

export function deleteAllowanceFromStorage(allowance: TAllowance, principal?: string): TAllowance[] {
  const allowances = getAllowancesFromStorage(principal);
  const filteredAllowances = allowances.filter((currentAllowance) => {
    return Boolean(
      allowance.subAccountId !== currentAllowance.subAccountId ||
        allowance.spender !== currentAllowance.spender ||
        allowance.asset.tokenSymbol !== currentAllowance.asset.tokenSymbol,
    );
  });
  localStorage.setItem(LOCAL_STORAGE_PREFIX, JSON.stringify(filteredAllowances));
  return filteredAllowances;
}
