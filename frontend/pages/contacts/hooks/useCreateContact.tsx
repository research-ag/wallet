import { Contact } from "@/@types/contacts";
import { useState } from "react";

export const useCreateContact = () => {
  const [newContact, setNewContact] = useState<Contact>({
    name: "",
    principal: "",
    accountIdentifier: "",
    accounts: [],
  });
  return { newContact, setNewContact };
};
