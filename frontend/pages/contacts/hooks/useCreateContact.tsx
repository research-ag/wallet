import { Contact, NewContactErrors } from "@/@types/contacts";
import { useState } from "react";

export const useCreateContact = () => {
  const [newContact, setNewContact] = useState<Contact>({
    name: "",
    principal: "",
    accountIdentifier: "",
    accounts: [],
  });

  const [newContactErrors, setNewContactErrors] = useState<NewContactErrors>({
    name: false,
    principal: false,
  });

  // -------------------------- Accounts --------------------------

  const [isCreating, setIsCreating] = useState(false);

  return {
    newContact,
    setNewContact,
    newContactErrors,
    setNewContactErrors,
    //
    isCreating,
    setIsCreating,
  };
};
