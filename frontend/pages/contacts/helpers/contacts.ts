import { Contact } from "@redux/models/ContactsModels";
import store from "@redux/Store";
import { setContacts } from "@redux/contacts/ContactsReducer";
import { hasSubAccountAssetAllowances } from "@/helpers/icrc";

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

    store.dispatch(setContacts(contacts));
  } catch (error) {
    console.log(error);
  }
}
