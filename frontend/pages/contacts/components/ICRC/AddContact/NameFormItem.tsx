import { CustomInput } from "@components/input";
import { Contact } from "@redux/models/ContactsModels";
import { useTranslation } from "react-i18next";

interface NameFormItemProps {
  newContactNameErr: boolean;
  newContact: Contact;
  onNameChange: (value: string) => void;
}

export default function NameFormItem(props: NameFormItemProps) {
  const { newContactNameErr, newContact, onNameChange } = props;
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-start items-start w-[50%]">
      <p>{t("name")}</p>
      <CustomInput
        sizeInput={"medium"}
        placeholder={""}
        border={newContactNameErr ? "error" : undefined}
        value={newContact.name}
        onChange={(e) => {
          onNameChange(e.target.value);
        }}
      />
    </div>
  );
}
