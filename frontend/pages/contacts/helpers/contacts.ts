import { Contact } from "@redux/models/ContactsModels";
import store from "@redux/Store";
import { setContacts } from "@redux/contacts/ContactsReducer";
import { hasSubAccountAssetAllowances } from "@/pages/home/helpers/icrc";

export default async function contactCachedRefresh(authIdentity: string) {
  try {
    const contactPrefix = `contacts-${authIdentity}`;
    const contactsData = localStorage.getItem(contactPrefix);
    const { contacts } = JSON.parse(contactsData || "[]") as { contacts: Contact[] };
    const updatedContacts = [];

    if (contacts) {
      for (const contact of contacts) {
        const updatedAsset = await hasSubAccountAssetAllowances(contact.principal, contact.assets);
        updatedContacts.push({ ...contact, assets: updatedAsset });
      }
    }

    store.dispatch(setContacts(updatedContacts));
  } catch (error) {
    console.error(error);
  }
}
