import logger from "@/common/utils/logger";
import { db } from "@/database/db";
import { setReduxContacts } from "@redux/contacts/ContactsReducer";
import store from "@redux/Store";
import contactAccountToAllowanceArgs from "./mappers";
import addAllowanceToSubaccounts from "./addAllowanceToSubaccounts";

export default async function contactCacheRefresh() {
  try {
    const contacts = await db().getContacts();
    const updatePromises = [];

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];

      const args = contactAccountToAllowanceArgs({
        allocatorPrincipal: contact.principal,
        contactAccounts: contact.accounts,
        spenderPrincipal: store.getState().auth.userPrincipal.toString(),
      });

      const updatePromise = addAllowanceToSubaccounts(args).then((updatedAccounts) => ({
        ...contact,
        accounts: updatedAccounts,
      }));

      updatePromises.push(updatePromise);
    }

    const updatedContacts = await Promise.all(updatePromises);
    store.dispatch(setReduxContacts(updatedContacts));
  } catch (error) {
    logger.debug(error);
  }
}
