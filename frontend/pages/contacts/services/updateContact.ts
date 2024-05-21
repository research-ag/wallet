import { db } from "@/database/db";
import { Contact } from "@redux/models/ContactsModels";

export default async function updateContact(editedContact: Contact, pastPrincipal: string) {
  await db().updateContact(pastPrincipal, editedContact, { sync: true });
};
