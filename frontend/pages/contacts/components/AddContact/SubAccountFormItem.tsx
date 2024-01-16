import { Asset } from "@redux/models/AccountModels";
import { AssetContact, Contact, SubAccountContact } from "@redux/models/ContactsModels";
import AddAssetOnCreate from "./AddAssetOnCreate";
import AddSubAccountOnCreate from "./AssSubAccounOnCreate";

interface SubAccountFormItemProps {
  assets: Array<Asset>;
  newContact: Contact;
  newSubAccounts: SubAccountContact[];
  newContactSubNameErr: number[];
  newContactSubIdErr: number[];
  asciiHex: string[];
  selAstContact: string;
  isValidSubacc: (from: string, validContact: boolean, contAst?: AssetContact) => any;
  setNewSubaccounts: any;
  setNewContact: any;
  setNewContactSubNameErr: any;
  setNewContactErr: any;
  setNewContactSubIdErr: any;
}

export default function SubAccountFormItem(props: SubAccountFormItemProps) {
  const {
    assets,
    newContact,
    newSubAccounts,
    newContactSubNameErr,
    newContactSubIdErr,
    asciiHex,
    selAstContact,
    isValidSubacc,
    setNewSubaccounts,
    setNewContact,
    setNewContactSubNameErr,
    setNewContactErr,
    setNewContactSubIdErr,
  } = props;

  return (
    <div className="flex flex-row items-start justify-start w-full h-full">
      <AddAssetOnCreate
        assets={assets}
        newContact={newContact}
        newSubAccounts={newSubAccounts}
        selAstContact={selAstContact}
        isValidSubacc={isValidSubacc}
        setNewSubaccounts={setNewSubaccounts}
        setNewContact={setNewContact}
      />
      <AddSubAccountOnCreate
        newContactSubNameErr={newContactSubNameErr}
        newContactSubIdErr={newContactSubIdErr}
        asciiHex={asciiHex}
        newSubAccounts={newSubAccounts}
        setNewContactSubIdErr={setNewContactSubIdErr}
        setNewContactSubNameErr={setNewContactSubNameErr}
        setNewContactErr={setNewContactErr}
        setNewSubaccounts={setNewSubaccounts}
        setNewContact={setNewContact}
      />
    </div>
  );
}
