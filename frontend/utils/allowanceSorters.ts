import { Allowance } from "@/@types/allowance";
import { SortOrder } from "@/@types/common";

export function filterByAsset(tokenSymbol: string, grossData: Allowance[]): Allowance[] {
  const filteredData = grossData.filter((allowance) => allowance.asset.tokenSymbol === tokenSymbol);
  return filteredData;
}

export function sortBySubAccount(order: SortOrder, filteredData: Allowance[]): Allowance[] {
  const orderedAllowances = filteredData.sort((a, b) => {
    const aSubAccountId = a.subAccount?.sub_account_id || "";
    const bSubAccountId = b.subAccount?.sub_account_id || "";
    const comparisonResult = aSubAccountId.localeCompare(bSubAccountId);
    return order === SortOrder.ASC ? comparisonResult : -comparisonResult;
  });
  return orderedAllowances;
}

export function filterBySpender(order: SortOrder, filteredData: Allowance[]): Allowance[] {
  const noSpenderNamed = filteredData.filter((allowance) => !allowance.spender?.name);
  const spenderNamed = filteredData.filter((allowance) => allowance.spender?.name);
  const mergedAllowances = [...noSpenderNamed, ...spenderNamed];
  const orderedAllowances = mergedAllowances.sort((a, b) => {
    const aSpenderPrincipal = a.spender?.principal || "";
    const bSpenderPrincipal = b.spender?.principal || "";
    const comparisonResult = aSpenderPrincipal.localeCompare(bSpenderPrincipal);
    return order === SortOrder.ASC ? comparisonResult : -comparisonResult;
  });
  return orderedAllowances;
}

export function sortByExpiration(order: SortOrder, filteredData: Allowance[]): Allowance[] {
  const noExpirationAllowances = filteredData.filter((allowance) => !allowance.expiration);
  const expirationAllowances = filteredData.filter((allowance) => allowance.expiration);
  const orderedAllowances = expirationAllowances.sort((a, b) => {
    const aExpiration = a.expiration || "";
    const bExpiration = b.expiration || "";
    const comparisonResult = aExpiration.localeCompare(bExpiration);
    return order === SortOrder.ASC ? comparisonResult : -comparisonResult;
  });

  const mergedAllowances =
    order === SortOrder.ASC
      ? [...noExpirationAllowances, ...orderedAllowances]
      : [...orderedAllowances, ...noExpirationAllowances];

  return mergedAllowances;
}

export function filterByAmount(order: SortOrder, filteredData: Allowance[]): Allowance[] {
  const orderedAllowances = filteredData.sort((a, b) => {
    const aAmount = Number(a.amount || 0);
    const bAmount = Number(b.amount || 0);
    const comparisonResult = aAmount - bAmount;
    return order === SortOrder.ASC ? comparisonResult : -comparisonResult;
  });

  return orderedAllowances;
}
