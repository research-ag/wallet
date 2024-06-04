import { Contact, ContactAccount } from "@/@types/contacts";
import { useState } from "react";
import { useContactError } from "../contexts/ContactErrorProvider";
import addAllowanceToSubaccounts, { RequestAccountAllowance } from "@pages/contacts/helpers/addAllowanceToSubaccounts";
import { useAppSelector } from "@redux/Store";
import { useContact } from "@pages/contacts/contexts/ContactProvider";
import {
  isContactAccountNameValid,
  isContactAccountValid,
  isContactNameValid,
  isContactPrincipalValid,
  isContactSubaccountIdValid,
} from "@pages/contacts/helpers/validators";
import logger from "@common/utils/logger";
import { validatePrincipal } from "@common/utils/definityIdentity";
import { getAccountIdentifier } from "@common/utils/icrc";

export const useCreateContact = () => {
  const { newContact, setNewContact } = useContact();
  const { setNewContactErrors, setSubAccountError } = useContactError();
  const assets = useAppSelector((state) => state.asset.list.assets);
  const userPrincipal = useAppSelector((state) => state.auth.userPrincipal);
  const [isAllowancesChecking, setIsAllowancesChecking] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState(false);

  // --- functions ---

  async function includeAllowanceToAccounts(contactAccounts: ContactAccount[]): Promise<ContactAccount[]> {
    try {
      const accounts = contactAccounts
        .map((account) => {
          return isContactAccountValid(account) ? account : null;
        })
        .filter((account) => account !== null);

      const requestArgs: RequestAccountAllowance[] = accounts
        .map((account) => {
          const currentAsset = assets.find((asset) => asset.tokenSymbol === account?.tokenSymbol);

          if (!currentAsset) {
            logger.debug("onCheckAccountsAllowances: Asset not found", account?.tokenSymbol);
            return;
          }

          return {
            assetAddress: currentAsset?.address,
            assetDecimal: currentAsset?.decimal,
            spenderPrincipal: newContact.principal,
            allocatorSubaccount: account?.subaccountId,
            allocatorPrincipal: userPrincipal.toString(),
            account,
          };
        })
        .filter((item) => Boolean(item)) as RequestAccountAllowance[];

      return await addAllowanceToSubaccounts(requestArgs);
    } catch (error) {
      logger.debug("includeAllowanceToAccounts failed: ", error);
      return newContact.accounts;
    }
  }

  async function onCheckAccountsAllowances() {
    try {
      setIsAllowancesChecking(true);
      const isPrincipalValid = validatePrincipal(newContact.principal);

      if (!isPrincipalValid) setNewContactErrors((prev) => ({ ...prev, principal: true }));
      else setNewContactErrors((prev) => ({ ...prev, principal: false }));

      const newSubAccounts = await includeAllowanceToAccounts(newContact.accounts);

      // TODO: if no name set but id empty, it will be removed.
      // TODO: if (no name) or (no name and no id) explit and include after test

      setNewContact((prev) => ({ ...prev, accounts: newSubAccounts }));
    } catch (error) {
      logger.debug(error);
    } finally {
      setIsAllowancesChecking(false);
    }
  }

  function isContactValidOnCreate(contact: Contact): boolean {
    try {
      // --- Reset errors ---
      setNewContactErrors((prev) => ({ ...prev, name: false, principal: false }));
      setSubAccountError(null);

      // --- name and principal validation ---
      if (!isContactNameValid(contact.name)) {
        setNewContactErrors((prev) => ({ ...prev, name: true }));
        return false;
      }

      if (!isContactPrincipalValid(contact.principal)) {
        setNewContactErrors((prev) => ({ ...prev, principal: true }));
        return false;
      }

      // --- subaccount validation ---
      const filteredAccounts = contact.accounts.filter((account) => account.name !== "" || account.subaccountId !== "");
      const subAccountErrors = filteredAccounts.map((account, index) => {
        if (isContactAccountValid(account)) return null;
        return {
          index,
          name: !isContactAccountNameValid(account.name),
          subAccountId: !isContactSubaccountIdValid(account.subaccountId),
          tokenSymbol: account.tokenSymbol,
        };
      });
      const accountErrors = subAccountErrors.filter((error) => error !== null);

      if (accountErrors.length > 0) {
        setSubAccountError(accountErrors[0]);
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
        accountIdentier: getAccountIdentifier(newContact.principal, 0),
        accounts: newContact.accounts.filter((account) => account.name !== "" || account.subaccountId !== ""),
      };

      // --- Validation ---
      if (isContactValidOnCreate(toCreateContact)) throw new Error("Create contact validation failed");

      // --- include allowaces ---
      const newSubAccounts = await includeAllowanceToAccounts(toCreateContact.accounts);

      // --- save contact ---
      console.log("save new contact", { ...toCreateContact, accounts: newSubAccounts });

      // TODO: rxdb types and close on success (is it good?)
      // await db().addContact({ ...toCreateContact, accounts: newSubAccounts, }, { sync: true });
      // onClose();
    } catch (error) {
      logger.debug("onAddContact failed: ", error);
    } finally {
      setIsCreating(false);
    }
  }

  return { newContact, onAddContact, onCheckAccountsAllowances, isAllowancesChecking, isCreating };
};
