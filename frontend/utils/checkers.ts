import { hexToNumber } from "@/utils";
import { SubAccountContact } from "@redux/models/ContactsModels";
import bigInt from "big-integer";

export function isSubAccountIdValid(subAccountIndex: string, subAccounts: SubAccountContact[]) {
  if (subAccountIndex.trim() === "") return false;

  const subAccount = subAccounts.find((subAccount) => {
    return hexToNumber(`0x${subAccount.subaccount_index}`)?.eq(hexToNumber(`0x${subAccountIndex}`) || bigInt());
  });

  return subAccount ? false : true;
}
