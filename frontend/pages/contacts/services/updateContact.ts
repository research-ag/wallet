import { Contact } from "@redux/models/ContactsModels";
import { db } from "@/database/db";

export default async function updateContact(editedContact: Contact, pastPrincipal: string) {
  await db().updateContact(pastPrincipal, editedContact, { sync: true });
}
