import { TAllowance } from "@/@types/allowance";
import { SortOrder, SortOrderEnum } from "@/@types/common";
import { excludeNamesFromAllowance, includeNamesToAllowances } from "./mappers";
import { toHoleBigInt } from "@common/utils/amount";

export function sortBySubAccount(order: SortOrder, filteredData: TAllowance[]) {
  const includedNames = includeNamesToAllowances(filteredData);
  const sorted = includedNames.sort((a, b) => {
    const aSubAccountName = a.subAccountName || "";
    const bSubAccountName = b.subAccountName || "";
    const aSubAccountId = a.subAccountId || "";
    const bSubAccountId = b.subAccountId || "";
    const comparisonResult =
      aSubAccountName.localeCompare(bSubAccountName) || aSubAccountId.localeCompare(bSubAccountId);
    return order === SortOrderEnum.Values.ASC ? comparisonResult : -comparisonResult;
  });

  return excludeNamesFromAllowance(sorted);
}

export function sortBySpender(order: SortOrder, filteredData: TAllowance[]): TAllowance[] {
  const includedNames = includeNamesToAllowances(filteredData);

  const noSpenderNamed = filteredData.filter((allowance) => !allowance.spender);
  const spenderNamed = includedNames.filter((allowance) => allowance.spender);

  const sorted = spenderNamed.sort((a, b) => {
    const aSpenderPrincipal = a.spender || "";
    const bSpenderPrincipal = b.spender || "";

    const aSpenderName = a.spenderName || "";
    const bSpenderName = b.spenderName || "";

    const comparisonResult =
      aSpenderName.localeCompare(bSpenderName) || aSpenderPrincipal.localeCompare(bSpenderPrincipal);

    return order === SortOrderEnum.Values.ASC ? comparisonResult : -comparisonResult;
  });

  return [...noSpenderNamed, ...excludeNamesFromAllowance(sorted)];
}

function fixDecimals(amount: string) {
  const regex = /^[\+-]?\d*(?:\.\d{1,8})?$/;

  if (regex.test(amount)) {
    return amount;
  } else {
    const [integerPart, decimalPart] = amount.split(".");
    const truncatedDecimal = decimalPart ? decimalPart.slice(0, 8) : "";
    return `${integerPart}.${truncatedDecimal}`;
  }
}

export function sortByAmount(order: SortOrder, filteredData: TAllowance[]): TAllowance[] {
  // INFO: 8 is the most accuracy, that's why it's fixed number. Remove this comment if this behaviors changes.
  return order === SortOrderEnum.Values.ASC
    ? [...filteredData].sort((a, b) => {
        const aAmount = toHoleBigInt(fixDecimals(a.amount || "0"), 8);
        const bAmount = toHoleBigInt(fixDecimals(b.amount || "0"), 8);
        return Number(aAmount - bAmount);
      })
    : [...filteredData].sort((a, b) => {
        const aAmount = toHoleBigInt(fixDecimals(a.amount || "0"), 8);
        const bAmount = toHoleBigInt(fixDecimals(b.amount || "0"), 8);
        return Number(bAmount - aAmount);
      });
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
      ? [...orderedAllowances, ...noExpirationAllowances]
      : [...noExpirationAllowances, ...orderedAllowances];

  return mergedAllowances;
}
