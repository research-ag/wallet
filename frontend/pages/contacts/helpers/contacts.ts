import store from "@redux/Store";
import { setReduxContacts } from "@redux/contacts/ContactsReducer";
import { retrieveAssetsWithAllowance } from "@/pages/home/helpers/icrc/";

export default async function contactCacheRefresh() {
  try {
    const contacts = store.getState().contacts.contacts;

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
