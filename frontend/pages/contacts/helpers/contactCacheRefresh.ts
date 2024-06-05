import logger from "@/common/utils/logger";
import { db } from "@/database/db";
import { setReduxContacts } from "@redux/contacts/ContactsReducer";
import store from "@redux/Store";
import contactAccountToAllowanceArgs from "./mappers";
import addAllowanceToSubaccounts from "./addAllowanceToSubaccounts";
import { Contact } from "@/@types/contacts";

export default async function contactCacheRefresh() {
  try {
    const contacts = await db().getContacts();

    if (contacts) {
      const updatedContacts: Contact[] = [];

      for (const contact of contacts) {
        contact.accounts = [];

        const args = contactAccountToAllowanceArgs({
          allocatorPrincipal: store.getState().auth.userPrincipal.toString(),
          contactAccounts: contact.accounts,
          spenderPrincipal: contact.principal,
        });

        const updatedAccounts = await addAllowanceToSubaccounts(args);
        contact.accounts.push(...updatedAccounts);
        updatedContacts.push(contact);
      }

      store.dispatch(setReduxContacts(updatedContacts));
    }
  } catch (error) {
    logger.debug(error);
  }
}
