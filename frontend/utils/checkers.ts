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

    if (formattedSubAccountId?.startsWith("0x")) {
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
        sub_account_id: `0x${formattedSubAccountId}`,
      });
    }
  });

  return { formattedSubAccounts, subAccountNamesErrors, subAccountIdsErrors };
}

export function validateSubaccounts(newSubAccounts: SubAccountContact[]) {
  const auxNewSub: SubAccountContact[] = [];
  const errName: number[] = [];
  const errId: number[] = [];
  let validSubaccounts = true;
  const ids: string[] = [];

  newSubAccounts.map((newSa, j) => {
    let subacc = newSa.subaccount_index.trim();
    // Check if string contains prefix "0x" and remove it if is the case
    if (subacc.slice(0, 2).toLowerCase() === "0x") subacc = subacc.substring(2);
    // Check if subaccount have data
    if (newSa.name.trim() !== "" || newSa.subaccount_index.trim() !== "") {
      // Removing zeros and check if subaccount index is not empty
      if (removeLeadingZeros(subacc) === "") {
        if (newSa.subaccount_index.length !== 0) subacc = "0";
      } else subacc = removeLeadingZeros(subacc);
      let valid = true;
      // Pushing position index of subaccounts that contains errors in the name (empty)
      if (newSa.name.trim() === "") {
        errName.push(j);
        valid = false;
        validSubaccounts = false;
      }
      // Pushing position index of sub
      if (subacc === "" || newSa.subaccount_index.trim().toLowerCase() === "0x" || ids.includes(subacc)) {
        errId.push(j);
        valid = false;
        validSubaccounts = false;
      } else {
        ids.push(subacc);
      }
      // Adding SubAccountContact to the new contact
      if (valid)
        auxNewSub.push({
          name: newSa.name.trim(),
          subaccount_index: subacc,
          sub_account_id: newSa.sub_account_id,
          allowance: newSa.allowance,
        });
    }
  });

  return { auxNewSub, errName, errId, validSubaccounts };
}

export function isHexadecimalValid(hexadecimal: string) {
  const trimmedHex = hexadecimal.trim();
  const normalizedHex = trimmedHex?.startsWith("0x") ? trimmedHex.slice(2) : trimmedHex;
  return normalizedHex.length < 65 && /^[a-fA-F0-9]+$/.test(normalizedHex);
}

export function isObjectValid(object: any) {
  if (typeof object !== "object") return false;
  return Object.keys(object).length !== 0;
}
