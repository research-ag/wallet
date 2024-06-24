import { Contact, ContactAccount } from "@redux/models/ContactsModels";
import { useState } from "react";
import { SubAccountError, useContactError } from "@/pages/contacts/contexts/ContactErrorProvider";
import addAllowanceToSubaccounts from "@pages/contacts/helpers/addAllowanceToSubaccounts";
import { useAppSelector } from "@redux/Store";
import { useContact } from "@pages/contacts/contexts/ContactProvider";
import {
  isContactAccountNameValid,
  isContactAccountValid,
  isContactNameValid,
  isContactPrincipalValid,
  isContactSubaccountIdValid,
  isDuplicatedPrincipal,
} from "@pages/contacts/helpers/validators";
import logger from "@common/utils/logger";
import { validatePrincipal } from "@common/utils/definityIdentity";
import { useTranslation } from "react-i18next";
import { db } from "@/database/db";
import { getAccountIdentifier } from "@common/utils/icrc";
import contactAccountToAllowanceArgs from "../helpers/mappers";
import { Principal } from "@dfinity/principal";

export const useCreateContact = (onClose: () => void) => {
  const { t } = useTranslation();
  const { newContact, setNewContact } = useContact();
  const { setNewContactErrors, setSubAccountError } = useContactError();
  const contacts = useAppSelector((state) => state.contacts.contacts);
  const userPrincipal = useAppSelector((state) => state.auth.userPrincipal);
  const [isAllowancesChecking, setIsAllowancesChecking] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState(false);

  async function includeAllowanceToAccounts(contactAccounts: ContactAccount[]): Promise<ContactAccount[]> {
    try {
      const args = contactAccountToAllowanceArgs({
        contactAccounts,
        allocatorPrincipal: newContact.principal,
        spenderPrincipal: userPrincipal.toString(),
      });

      return await addAllowanceToSubaccounts(args);
    } catch (error) {
      logger.debug("includeAllowanceToAccounts failed: ", error);
      return newContact.accounts;
    }
  }

  async function onCheckAccountsAllowances() {
    try {
      setIsAllowancesChecking(true);

      if (!validatePrincipal(newContact.principal)) {
        setNewContactErrors((prev) => ({
          ...prev,
          name: false,
          principal: true,
          message: t("contact.error.invalid.principal"),
        }));

        return;
      } else {
        setNewContactErrors((prev) => ({
          ...prev,
          name: false,
          principal: false,
          message: "",
        }));
      }

      const duplicatedSubAccount = newContact.accounts
        .map((account, index): SubAccountError | null => {
          const duplicated = newContact.accounts.filter((sa) => {
            const isEmptyAccountId = account.subaccountId === "";
            const isSameToken = sa.tokenSymbol === account.tokenSymbol;
            const isSameSubAccountId = sa.subaccountId === account.subaccountId;
            return !isEmptyAccountId && isSameSubAccountId && isSameToken;
          });

          if (duplicated.length > 1) {
            return {
              index,
              subAccountId: true,
              message: t("contact.error.account.exist"),
              name: false,
              tokenSymbol: account.tokenSymbol,
            };
          }

          return null;
        })
        .filter((error) => error !== null);

      if (duplicatedSubAccount.length > 0) {
        setSubAccountError(duplicatedSubAccount[0]);
        return;
      }

      const noTestableAccounts = newContact.accounts.filter(
        (account) => !isContactSubaccountIdValid(account.subaccountId),
      );

      const newSubAccounts = await includeAllowanceToAccounts(newContact.accounts);

      setNewContact((prev) => ({ ...prev, accounts: [...newSubAccounts, ...noTestableAccounts] }));
      setSubAccountError(null);
    } catch (error) {
      logger.debug(error);
    } finally {
      setIsAllowancesChecking(false);
    }
  }

  function isContactValidOnCreate(contact: Contact): boolean {
    try {
      // --- Reset errors ---
      setNewContactErrors((prev) => ({ ...prev, name: false, principal: false, message: "" }));
      setSubAccountError(null);

      // --- name and principal validation ---
      if (!isContactNameValid(contact.name)) {
        setNewContactErrors((prev) => ({
          ...prev,
          name: true,
          message: t("contact.error.invalid.name"),
        }));
        return false;
      }

      if (!isContactPrincipalValid(contact.principal)) {
        setNewContactErrors((prev) => ({
          ...prev,
          principal: true,
          message: t("contact.error.invalid.principal"),
        }));
        return false;
      }

      if (Principal.fromText(contact.principal).compareTo(userPrincipal) === "eq") {
        setNewContactErrors((prev) => ({
          ...prev,
          principal: true,
          message: t("contact.error.principal.self"),
        }));
        return false;
      }

      if (isDuplicatedPrincipal(contact.principal, contacts)) {
        setNewContactErrors((prev) => ({
          ...prev,
          principal: true,
          message: t("contact.error.duplicated.principal"),
        }));

        return false;
      }

      // --- subaccount validation ---
      const filteredAccounts = contact.accounts.filter((account) => account.name !== "" || account.subaccountId !== "");

      const subAccountErrors = filteredAccounts.map((account, index): SubAccountError | null => {
        if (isContactAccountValid(account)) return null;

        const hasNameError = !isContactAccountNameValid(account.name);
        const hasSubAccountIdError = !isContactSubaccountIdValid(account.subaccountId);

        const message = hasNameError ? t("contact.error.invalid.account.name") : t("contact.error.invalid.account.id");

        return {
          index,
          name: hasNameError,
          subAccountId: hasSubAccountIdError,
          tokenSymbol: account.tokenSymbol,
          message,
        };
      });

      const accountErrors = subAccountErrors.filter((error) => error !== null);

      if (accountErrors.length > 0) {
        setSubAccountError(accountErrors[0]);
        return false;
      }

      // --- validate subaccounts duplication ---

      const subAccountIds = contact.accounts.map((account) => ({
        subaccountId: account.subaccountId,
        tokenSymbol: account.tokenSymbol,
      }));

      const duplicatedSubAccount: (SubAccountError | null)[] = contact.accounts.map(
        (account, index): SubAccountError | null => {
          const duplicated = subAccountIds.filter((subAccountId) => {
            const isEmptyAccountId = account.subaccountId === "";
            const isSameToken = subAccountId.tokenSymbol === account.tokenSymbol;
            const isSameSubAccountId = subAccountId.subaccountId === account.subaccountId;
            return !isEmptyAccountId && isSameSubAccountId && isSameToken;
          });

          if (duplicated.length > 1) {
            return {
              index,
              subAccountId: true,
              message: t("contact.error.account.exist"),
              name: false,
              tokenSymbol: account.tokenSymbol,
            };
          }

          return null;
        },
      );

      const noNulls = duplicatedSubAccount.filter((error) => error !== null);

      if (noNulls.length > 0) {
        setSubAccountError(noNulls[0]);
        return false;
      }

      return true;
    } catch (error) {
      logger.debug("isContactValidOnCreate failed: ", error);
      return false;
    }
  }

  async function onAddContact() {
    try {
      setIsCreating(true);

      const toCreateContact = {
        ...newContact,
        accounts: newContact.accounts.filter((account) => account.name !== "" || account.subaccountId !== ""),
      };

      if (!isContactValidOnCreate(toCreateContact)) throw new Error("Create contact validation failed");
      const newSubAccounts = await includeAllowanceToAccounts(toCreateContact.accounts);

      await db().addContact(
        {
          ...toCreateContact,
          accountIdentifier: getAccountIdentifier(toCreateContact.principal, 0),
          accounts: newSubAccounts,
        },
        { sync: true },
      );

      onClose();
    } catch (error) {
      logger.debug("onAddContact failed: ", error);
    } finally {
      setIsCreating(false);
    }
  }

  return { newContact, onAddContact, onCheckAccountsAllowances, isAllowancesChecking, isCreating };
};
