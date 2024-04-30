import { TAllowance } from "@/@types/allowance";
import { excludeNamesFromAllowance, includeNamesToAllowances } from "./mappers";

export function filterByAsset(assetSymbols: string[], grossData: TAllowance[]): TAllowance[] {
  if (assetSymbols.length === 0) return grossData;

  const filteredData = grossData.filter((allowance) => {
    const assetToken = allowance.asset.tokenSymbol;
    return assetSymbols.includes(assetToken);
  }, []);

  return filteredData;
}

export function filterBySpenderAndSubAccount(searchKey: string, allowances: TAllowance[]): TAllowance[] {
  const allowancesWithFull = includeNamesToAllowances(allowances);

  const filtered = allowancesWithFull.filter((allowance) => {
    const spender = allowance.spender?.toLocaleLowerCase() || "";
    const spenderName = allowance.spenderName?.toLocaleLowerCase() || "";
    const subAccountId = allowance.subAccountId.toLocaleLowerCase() || "";
    const subAccountName = allowance.subAccountName?.toLocaleLowerCase() || "";

    const subAccountIdIncluded = subAccountId.includes(searchKey?.toLocaleLowerCase());
    const subAccountNameIncluded = subAccountName.includes(searchKey?.toLocaleLowerCase());
    const spenderIncluded = spender.includes(searchKey?.toLocaleLowerCase());
    const spenderNameIncluded = spenderName.includes(searchKey?.toLocaleLowerCase());

    return subAccountIdIncluded || subAccountNameIncluded || spenderIncluded || spenderNameIncluded;
  });

  return excludeNamesFromAllowance(filtered);
}
