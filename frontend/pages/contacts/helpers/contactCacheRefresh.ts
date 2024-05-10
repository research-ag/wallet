import { retrieveAssetsWithAllowance } from "@/common/libs/icrc/";
import { db } from "@/database/db";
import store from "@redux/Store";
import { setReduxContacts } from "@redux/contacts/ContactsReducer";

export default async function contactCacheRefresh() {
  try {
    const contacts = await db().getContacts();

    const updatedContacts = [];
    if (contacts) {
      for (const contact of contacts) {
        const updatedAsset = await retrieveAssetsWithAllowance({
          accountPrincipal: contact.principal,
          assets: contact.assets,
        });

        updatedContacts.push({ ...contact, assets: updatedAsset });
      }
    }

    store.dispatch(setReduxContacts(updatedContacts));
  } catch (error) {
    console.error(error);
  }
}
