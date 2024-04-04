import { hexToNumber } from "@/utils";
import { SubAccount } from "@redux/models/AccountModels";
import bigInt from "big-integer";

export function sortSubAccounts(subAccounts: SubAccount[]): SubAccount[] {
  return subAccounts.sort((a, b) =>
    hexToNumber(a.sub_account_id)?.compare(hexToNumber(b.sub_account_id) || bigInt()) || 0
  );
}

export function getFirstNonEmptyString(...strings: string[]): string | undefined {
  return strings.find((str) => str !== "");
}
