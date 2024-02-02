import { Contact } from "@redux/models/ContactsModels";
import store from "@redux/Store";
import { setContacts } from "@redux/contacts/ContactsReducer";
import { retrieveAssetsWithAllowance } from "@/pages/home/helpers/icrc";

export default async function contactCacheRefresh(authIdentity: string) {
  try {
    const contactPrefix = `contacts-${authIdentity}`;
    const contactsData = localStorage.getItem(contactPrefix);

    const { contacts } = JSON.parse(contactsData || "[]") as { contacts: Contact[] };
    store.dispatch(setContacts(contacts));

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
    store.dispatch(setContacts(updatedContacts));
  } catch (error) {
    console.error(error);
  }
}
