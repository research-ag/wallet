import { TAllowance } from "@/@types/allowance";
import { SortOrder, SortOrderEnum } from "@/@types/common";

export function filterByAsset(assetSymbols: string[], grossData: TAllowance[]): TAllowance[] {
  const filteredData = grossData.filter((allowance) => assetSymbols.includes(allowance?.asset?.tokenSymbol || ""));
  return filteredData;
}

export function sortBySubAccount(order: SortOrder, filteredData: TAllowance[]): TAllowance[] {
  const orderedAllowances = filteredData?.sort((a, b) => {
    const aSubAccountId = a.subAccountId || "";
    const bSubAccountId = b.subAccountId || "";
    const comparisonResult = aSubAccountId.localeCompare(bSubAccountId);
    return order === SortOrderEnum.Values.ASC ? comparisonResult : -comparisonResult;
  });
  return orderedAllowances;
}

export function filterBySpender(order: SortOrder, filteredData: TAllowance[]): TAllowance[] {
  const noSpenderNamed = filteredData.filter((allowance) => !allowance.spender);
  const spenderNamed = filteredData.filter((allowance) => allowance.spender);

  const mergedAllowances = [...noSpenderNamed, ...spenderNamed];
  const orderedAllowances = mergedAllowances.sort((a, b) => {
    const aSpenderPrincipal = a.spender || "";
    const bSpenderPrincipal = b.spender || "";
    const comparisonResult = aSpenderPrincipal.localeCompare(bSpenderPrincipal);
    return order === SortOrderEnum.Values.ASC ? comparisonResult : -comparisonResult;
  });
  return orderedAllowances;
}

export function sortByExpiration(order: SortOrder, filteredData: TAllowance[]): TAllowance[] {
  const noExpirationAllowances = filteredData.filter((allowance) => !allowance.expiration);
  const expirationAllowances = filteredData.filter((allowance) => allowance.expiration);
  const orderedAllowances = expirationAllowances.sort((a, b) => {
    const aExpiration = a.expiration || "";
    const bExpiration = b.expiration || "";
    const comparisonResult = aExpiration.localeCompare(bExpiration);
    return order === SortOrderEnum.Values.ASC ? comparisonResult : -comparisonResult;
  });

  const mergedAllowances =
    order === SortOrderEnum.Values.ASC
      ? [...noExpirationAllowances, ...orderedAllowances]
      : [...orderedAllowances, ...noExpirationAllowances];

  return mergedAllowances;
}

export function filterByAmount(order: SortOrder, filteredData: TAllowance[]): TAllowance[] {
  const orderedAllowances = filteredData.sort((a, b) => {
    const aAmount = Number(a.amount || 0);
    const bAmount = Number(b.amount || 0);
    const comparisonResult = aAmount - bAmount;
    return order === SortOrderEnum.Values.ASC ? comparisonResult : -comparisonResult;
  });

  return orderedAllowances;
}
