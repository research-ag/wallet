import { Contact, SubAccountContact } from "@redux/models/ContactsModels";

import { useState } from "react";

export const useCreateContact = () => {
  const [newContact, setNewContact] = useState<Contact>({
    name: "",
    principal: "",
    assets: [],
  });
  const [isCreating, setIsCreating] = useState(false);
  const [selAstContact, setSelAstContact] = useState("");
  const [newSubAccounts, setNewSubaccounts] = useState<SubAccountContact[]>([]);

  const [newContactErr, setNewContactErr] = useState("");
  const [newContactNameErr, setNewContactNameErr] = useState(false);
  const [newContactPrinErr, setNewContactPrinErr] = useState(false);
  const [newContactSubNameErr, setNewContactSubNameErr] = useState<number[]>([]);
  const [newContactSubIdErr, setNewContactSubIdErr] = useState<number[]>([]);

  console.log("newSubAccounts", newSubAccounts);
  console.log("newContact", newContact);

  return {
    isCreating,
    setIsCreating,
    newContact,
    setNewContact,
    selAstContact,
    setSelAstContact,
    newSubAccounts,
    setNewSubaccounts,
    newContactErr,
    setNewContactErr,
    newContactNameErr,
    setNewContactNameErr,
    newContactPrinErr,
    setNewContactPrinErr,
    newContactSubNameErr,
    setNewContactSubNameErr,
    newContactSubIdErr,
    setNewContactSubIdErr,
  };
};
