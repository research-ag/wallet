import { Contact } from "@/@types/contacts";
import React, { createContext, useContext, useState } from "react";

export const ContactContext = createContext<{
  newContact: Contact;
  setNewContact: React.Dispatch<React.SetStateAction<Contact>>;
} | null>(null);

export default function ContactProvider({ children }: { children: JSX.Element }) {
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
