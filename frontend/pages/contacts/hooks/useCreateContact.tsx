import { Contact, NewContactErrors } from "@/@types/contacts";
import { useState } from "react";

export const useCreateContact = () => {
  const [newContact, setNewContact] = useState<Contact>({
    name: "",
    principal: "",
    accountIdentifier: "",
    accounts: [],
  });

  // TODO: probably show be located in the ContactMainDetails component
  const [newContactErrors, setNewContactErrors] = useState<NewContactErrors>({
    name: false,
    principal: false,
  });

  console.log("newContact: ", newContact);

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
    // newSubAccounts,
    // setNewSubaccounts,
    // newContactSubNameErr,
    // setNewContactSubNameErr,
    // newContactSubIdErr,
    // setNewContactSubIdErr,
  };
};
