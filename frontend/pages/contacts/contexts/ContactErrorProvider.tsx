import { NewContactErrors } from "@/@types/contacts";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

export interface SubAccountError {
  name: boolean;
  subAccountId: boolean;
  tokenSymbol: boolean;
  index: number;
}

export const ContactErrorContext = createContext<{
  subAccountError: SubAccountError | null;
  setSubAccountError: Dispatch<SetStateAction<SubAccountError | null>>;
  newContactErrors: NewContactErrors;
  setNewContactErrors: Dispatch<SetStateAction<NewContactErrors>>;
} | null>(null);

export default function ContactErrorProvider({ children }: { children: JSX.Element }) {
  const [subAccountError, setSubAccountError] = useState<SubAccountError | null>(null);

  const [newContactErrors, setNewContactErrors] = useState<NewContactErrors>({
    name: false,
    principal: false,
  });

  return (
    <ContactErrorContext.Provider
      value={{ subAccountError, setSubAccountError, newContactErrors, setNewContactErrors }}
    >
      {children}
    </ContactErrorContext.Provider>
  );
}

export const useContactError = () => {
  const context = useContext(ContactErrorContext);
  if (!context) {
    throw new Error("useContactError must be used within a ContactAccountErrorProvider");
  }

  return context;
};
