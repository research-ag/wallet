import { Contact } from "@redux/models/ContactsModels";
import React, { createContext, useContext, useState } from "react";

type ContactProviderProps = {
  children: JSX.Element;
};

type ContactProviderType = {
  newContact: Contact;
  setNewContact: React.Dispatch<React.SetStateAction<Contact>>;
};

export const ContactContext = createContext<ContactProviderType | null>(null);

export default function ContactProvider({ children }: ContactProviderProps) {
  const [newContact, setNewContact] = useState<Contact>({
    name: "",
    principal: "",
    accountIdentifier: "",
    accounts: [],
  });
  return <ContactContext.Provider value={{ newContact, setNewContact }}>{children}</ContactContext.Provider>;
}

export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContact must be used within a ContactProvider");
  }

  return context;
};
