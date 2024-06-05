import { Contact, ContactAccount } from "@/@types/contacts";
import { validatePrincipal } from "@common/utils/definityIdentity";
import { checkHexString } from "@common/utils/hexadecimal";

export const isContactNameValid = (name: string): boolean => {
  return name.trim() !== "" && name.length <= 50;
};

export const isContactPrincipalValid = (principal: string): boolean => {
  return principal.trim() !== "" && validatePrincipal(principal);
};

export const isContactAccountNameValid = (name: string): boolean => {
  return name.trim() !== "" && name.length <= 50;
};

export const isContactSubaccountIdValid = (subaccountId: string): boolean => {
  return subaccountId.trim() !== "" && checkHexString(subaccountId);
};

export const isDuplicatedPrincipal = (principal: string, contacts: Contact[]) => {
  return contacts.some((contact) => contact.principal === principal);
};

export const isDuplicatedSubAccount = (account: ContactAccount, subAccounts: ContactAccount[]) => {
  return subAccounts.some(
    (subAccount) => subAccount.subaccountId === account.subaccountId && subAccount.tokenSymbol === account.tokenSymbol,
  );
};

export const isContactAccountValid = (account: ContactAccount): boolean => {
  const isValidSubaccount = isContactSubaccountIdValid(account.subaccountId);
  const isValidSubaccountName = isContactAccountNameValid(account.name);
  return isValidSubaccount && isValidSubaccountName;
};
