import { AvatarEmpty } from "@components/avatar";
import { middleTruncation } from "@/common/utils/strings";
import { Contact } from "@redux/models/ContactsModels";

export default function formatContact(contact: Contact) {
  return {
    value: contact.principal,
    label: contact.name,
    subLabel: middleTruncation(contact.principal, 3, 3),
    icon: <AvatarEmpty title={contact.name} size="medium" className="mr-4" />,
  };
}
