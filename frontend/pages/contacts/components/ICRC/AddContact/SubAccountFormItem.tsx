import AddAssetOnCreate from "./AddAssetOnCreate";
import { Contact } from "@/@types/contacts";
import { Asset } from "@redux/models/AccountModels";
import { Dispatch, SetStateAction } from "react";
import AddSubAccountOnCreate from "./AssSubAccounOnCreate";

interface SubAccountFormItemProps {
  setNewContact: any;
  newContact: Contact;
  contactAssetSelected: string;
  contactAssets: Asset[];
  setContactAssetSelected: Dispatch<SetStateAction<string>>;
  setContactAssets: Dispatch<SetStateAction<Asset[]>>;
}

export default function SubAccountFormItem(props: SubAccountFormItemProps) {
  const { contactAssets, newContact, setContactAssetSelected, setNewContact, setContactAssets, contactAssetSelected } =
    props;

  return (
    <div className="flex flex-row items-start justify-start w-full h-full">
      <AddAssetOnCreate
        contactAssets={contactAssets}
        newContact={newContact}
        setContactAssetSelected={setContactAssetSelected}
        setContactAssets={setContactAssets}
        contactAssetSelected={contactAssetSelected}
        setNewContact={setNewContact}
      />
      <AddSubAccountOnCreate
        contactAssetSelected={contactAssetSelected}
        setNewContact={setNewContact}
        newContact={newContact}
      />
    </div>
  );
}
