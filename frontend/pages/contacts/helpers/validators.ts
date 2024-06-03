import { ContactAccount } from "@/@types/contacts";
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

export const isContactAccountValid = (account: ContactAccount): boolean => {
  return checkHexString(account.subaccountId) && isContactAccountNameValid(account.name);
};

