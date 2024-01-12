import { hexToNumber, removeLeadingZeros } from "@/utils";
import { SubAccountContact } from "@redux/models/ContactsModels";
import bigInt from "big-integer";

export function isSubAccountIdValid(subAccountIndex: string, subAccounts: SubAccountContact[]) {
  if (subAccountIndex.trim() === "") return false;

  const subAccount = subAccounts.find((subAccount) => {
    return hexToNumber(`0x${subAccount.subaccount_index}`)?.eq(hexToNumber(`0x${subAccountIndex}`) || bigInt());
  });

  return subAccount ? false : true;
}

export function formatSubAccountIds(subAccounts: SubAccountContact[]) {
  const formattedSubAccounts: SubAccountContact[] = [];
  const uniqueSubAccountIds: string[] = [];
  const subAccountNamesErrors: number[] = [];
  const subAccountIdsErrors: number[] = [];

  subAccounts.forEach((subAccount, index) => {
    let formattedSubAccountId = subAccount.subaccount_index.trim();
    let isSubAccountValid = true;

    if (formattedSubAccountId.startsWith("0x")) {
      formattedSubAccountId = formattedSubAccountId.substring(2);
    }
    formattedSubAccountId = removeLeadingZeros(formattedSubAccountId);

    if (subAccount.name.trim() === "") {
      subAccountNamesErrors.push(index);
      isSubAccountValid = false;
    }

    // Check for invalid subaccount ID
    if (
      formattedSubAccountId === "" ||
      formattedSubAccountId.toLowerCase() === "0x" ||
      uniqueSubAccountIds.includes(formattedSubAccountId)
    ) {
      subAccountIdsErrors.push(index);
      isSubAccountValid = false;
    } else {
      uniqueSubAccountIds.push(formattedSubAccountId);
    }

    // Add formatted subaccount to the output if valid
    if (isSubAccountValid) {
      formattedSubAccounts.push({
        name: subAccount.name.trim(),
        subaccount_index: formattedSubAccountId,
        sub_account_id: `0x${formattedSubAccountId}`
      });
    }
  });

  return { formattedSubAccounts, subAccountNamesErrors, subAccountIdsErrors };
}
