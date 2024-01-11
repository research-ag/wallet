import { CustomInput } from "@components/Input";
import { Contact } from "@redux/models/ContactsModels";

interface PrincipalFormItemProps {
  newContactPrinErr: boolean;
  newContact: Contact;
  onPrincipalChange(value: string): void;
}

export default function PrincipalFormItem(props: PrincipalFormItemProps) {
  const { newContactPrinErr, newContact, onPrincipalChange } = props;

  return (
    <div className="flex flex-col items-start justify-start w-full">
      <p>{"Principal"}</p>
      <CustomInput
        sizeInput={"medium"}
        placeholder={""}
        border={newContactPrinErr ? "error" : undefined}
        value={newContact.principal}
        onChange={(e) => {
          onPrincipalChange(e.target.value);
        }}
      />
    </div>
  );
}
