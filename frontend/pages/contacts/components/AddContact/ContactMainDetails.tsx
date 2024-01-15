import { Principal } from "@dfinity/principal";
import NameFormItem from "./NameFormItem";
import PrincipalFormItem from "./PrincipalFormItem";

interface ContactMainDetailsProps {
  newContact: any;
  setNewContact: any;
  setNewContactErr: any;
  newContactNameErr: any;
  setNewContactNameErr: any;
  newContactPrinErr: any;
  setNewContactPrinErr: any;
}
export default function ContactMainDetails(props: ContactMainDetailsProps) {
  const {
    newContact,
    setNewContact,
    setNewContactErr,
    newContactNameErr,
    setNewContactNameErr,
    newContactPrinErr,
    setNewContactPrinErr,
  } = props;

  return (
    <div className="flex flex-row items-start justify-start w-full gap-3">
      <NameFormItem newContactNameErr={newContactNameErr} newContact={newContact} onNameChange={onNameChange} />
      <PrincipalFormItem
        newContactPrinErr={newContactPrinErr}
        newContact={newContact}
        onPrincipalChange={onPrincipalChange}
      />
    </div>
  );

  function onPrincipalChange(value: string) {
    setNewContact((prev) => {
      return { ...prev, principal: value };
    });
    setNewContactErr("");
    if (value.trim() !== "")
      try {
        Principal.fromText(value);
        setNewContactPrinErr(false);
      } catch {
        setNewContactPrinErr(true);
      }
    else setNewContactPrinErr(false);
  }

  function onNameChange(value: string) {
    setNewContact((prev) => {
      return { ...prev, name: value };
    });
    setNewContactErr("");
    setNewContactNameErr(false);
  }
}
