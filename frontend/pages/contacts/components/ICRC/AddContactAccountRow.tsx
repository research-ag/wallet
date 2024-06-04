import { Contact, ContactAccount } from "@/@types/contacts";
import { CustomButton } from "@components/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";

interface AddContactAccountRowProps {
  contact: Contact;
}

const baseAccount: ContactAccount = {
  name: "",
  subaccount: "",
  subaccountId: "",
  tokenSymbol: "",
};

export default function AddContactAccountRow(props: AddContactAccountRowProps) {
  const [newAccount, setNewAccount] = useState<ContactAccount | null>(null);
  console.log(props);
  return (
    <div className="h-10">
      {newAccount ? (
        <div className="flex w-full bg-red-500">
          <div className="border w-[20%]">
            <p>Select Asset</p>
          </div>
          <div className="border w-[20%]">
            <p>Input Name</p>
          </div>
          <div className="border w-[10%]">
            <p>Sub account</p>
          </div>
          <div className="border w-[30%]">
            <p>Account identifier</p>
          </div>
          <div className="border w-[10%]">
            <p>Test button</p>
          </div>
          <div className="border w-[10%]">
            <p>Save/Cancel</p>
          </div>
        </div>
      ) : (
        <CustomButton size="small" onClick={() => setNewAccount(baseAccount)} className="flex items-center">
          <PlusIcon className="w-4 h-4 mr-2 mb-0.5" />
          <p className="mt-0.5 font-bold text-md">Sub-account</p>
        </CustomButton>
      )}
    </div>
  );
}
