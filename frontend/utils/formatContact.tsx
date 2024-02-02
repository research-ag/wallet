import { Contact } from "@redux/models/ContactsModels";
import { middleTruncation } from "./strings";
import { AvatarEmpty } from "@components/avatar";

export default function formatContact(contact: Contact) {
  return {
    value: contact.principal,
    label: contact.name,
    subLabel: middleTruncation(contact.principal, 3, 3),
    icon: <AvatarEmpty title={contact.name} size="medium" className="mr-4" />,
  };
}
