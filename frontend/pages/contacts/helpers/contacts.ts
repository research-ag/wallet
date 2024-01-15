import { Identity } from "@dfinity/agent";
import { Contact } from "@redux/models/ContactsModels";
import store from "@redux/Store";
import { setContacts } from "@redux/contacts/ContactsReducer";
import { hasSubAccountAssetAllowances } from "@/helpers/icrc";

export default async function contactCachedRefresh(authIdentity: Identity) {
  try {
    const contactPrefix = `contacts-${authIdentity.getPrincipal().toString()}`;
    const contactsData = localStorage.getItem(contactPrefix);
    const { contacts } = JSON.parse(contactsData || "[]") as { contacts: Contact[] };
    const updatedContacts = [];

    for (const contact of contacts) {
      const updatedAsset = await hasSubAccountAssetAllowances(contact.principal, contact.assets);
      updatedContacts.push({ ...contact, assets: updatedAsset });
    }

    store.dispatch(setContacts(updatedContacts));
  } catch (error) {
    console.log(error);
  }
}
