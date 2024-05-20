import { retrieveAssetsWithAllowance } from "@/common/libs/icrc/";
import { db } from "@/database/db";
import store from "@redux/Store";
import { setReduxContacts } from "@redux/contacts/ContactsReducer";
import logger from "@/common/utils/logger";

export default async function contactCacheRefresh() {
  try {
    const contacts = await db().getContacts();

    if (contacts) {
      const promises = contacts.map(async (contact) => {
        const updatedAsset = await retrieveAssetsWithAllowance({
          accountPrincipal: contact.principal,
          assets: contact.assets,
        });

        return { ...contact, assets: updatedAsset };
      });

      const updatedContacts = await Promise.all(promises);

      store.dispatch(setReduxContacts(updatedContacts));
    }
  } catch (error) {
    logger.debug(error);
  }
}
