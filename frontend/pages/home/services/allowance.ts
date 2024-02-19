import { TAllowance } from "@/@types/allowance";
import { setInLocalStorage } from "../../../utils/localStorage";
import store from "@redux/Store";

export const LOCAL_STORAGE_PREFIX = `allowances-${store.getState().auth.userPrincipal.toText()}`;

export function postAllowance(newAllowance: TAllowance): Promise<TAllowance[]> {
  return new Promise((resolve) => {
    const storageAllowances = localStorage.getItem(LOCAL_STORAGE_PREFIX);
    const allowances = JSON.parse(storageAllowances || "[]") as TAllowance[];
    setInLocalStorage(LOCAL_STORAGE_PREFIX, [...allowances, newAllowance]);
    resolve(allowances);
  });
}

export const updateAllowanceRequest = (updatedAllowance: TAllowance): Promise<TAllowance[]> => {
  return new Promise((resolve) => {
    const storageAllowances = localStorage.getItem(LOCAL_STORAGE_PREFIX);
    const allowances = JSON.parse(storageAllowances || "[]") as TAllowance[];

    const filteredAllowances = allowances.filter((allowance) =>
      Boolean(
        allowance.subAccountId !== updatedAllowance.subAccountId ||
          allowance.spender !== updatedAllowance.spender ||
          allowance.asset.tokenSymbol !== updatedAllowance.asset.tokenSymbol,
      ),
    );

    const newAllowances = [...filteredAllowances, updatedAllowance];
    setInLocalStorage(LOCAL_STORAGE_PREFIX, newAllowances);
    resolve(newAllowances);
  });
};

export function removeAllowance(allowance: TAllowance): Promise<TAllowance[]> {
  return new Promise((resolve) => {
    const storageAllowances = localStorage.getItem(LOCAL_STORAGE_PREFIX);
    const allowances = JSON.parse(storageAllowances || "[]") as TAllowance[];
    const filteredAllowances = allowances.filter((currentAllowance) => {
      return Boolean(
        allowance.subAccountId !== currentAllowance.subAccountId ||
          allowance.spender !== currentAllowance.spender ||
          allowance.asset.tokenSymbol !== currentAllowance.asset.tokenSymbol,
      );
    });
    setInLocalStorage(LOCAL_STORAGE_PREFIX, filteredAllowances);
    resolve(filteredAllowances);
    resolve([]);
  });
}
