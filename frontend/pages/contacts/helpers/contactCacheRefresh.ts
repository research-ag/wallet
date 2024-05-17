import { retrieveAssetsWithAllowance } from "@/common/libs/icrcledger/";
import { db } from "@/database/db";
import store from "@redux/Store";
import { setReduxContacts } from "@redux/contacts/ContactsReducer";

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
    console.error(error);
  }
}
