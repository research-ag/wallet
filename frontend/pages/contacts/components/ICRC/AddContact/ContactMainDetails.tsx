import { Contact } from "@redux/models/ContactsModels";
import { CustomInput } from "@components/input";
import { useTranslation } from "react-i18next";
import { validatePrincipal } from "@common/utils/definityIdentity";
import { useContactError } from "@pages/contacts/contexts/ContactErrorProvider";
import { useContact } from "@pages/contacts/contexts/ContactProvider";
import { NewContactErrors } from "@/@types/contacts";

export default function ContactMainDetails() {
  const { newContact, setNewContact } = useContact();
  const { setNewContactErrors, newContactErrors } = useContactError();
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-start justify-start w-full gap-3">
      <div className="flex flex-col justify-start items-start w-[65%]">
        <p>{t("name")}</p>
        <CustomInput
          sizeInput={"medium"}
          placeholder={""}
          border={newContactErrors.name ? "error" : undefined}
          value={newContact.name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col items-start justify-start w-full">
        <p>{"Principal"}</p>
        <CustomInput
          sizeInput={"medium"}
          placeholder={""}
          border={newContactErrors.principal ? "error" : undefined}
          value={newContact.principal}
          onChange={(e) => onPrincipalChange(e.target.value.trim())}
        />
      </div>
    </div>
  );

  function onPrincipalChange(value: string) {
    setNewContact((prev: Contact) => ({ ...prev, principal: value }));

    if (!validatePrincipal(value)) {
      setNewContactErrors((prev: NewContactErrors) => ({
        ...prev,
        principal: true,
        name: false,
        message: t("contact.error.invalid.principal"),
      }));
    } else {
      setNewContactErrors((prev: NewContactErrors) => ({
        ...prev,
        principal: false,
        name: false,
        message: "",
      }));
    }
  }

  function onNameChange(value: string) {
    if (value.length <= 32) {
      setNewContact((prev: Contact) => ({ ...prev, name: value }));
      if (value.length === 0 || value.length > 32)
        setNewContactErrors((prev) => ({
          ...prev,
          name: true,
          principal: false,
          message: t("contact.error.invalid.name"),
        }));
      else
        setNewContactErrors((prev) => ({
          ...prev,
          name: false,
          principal: false,
          message: "",
        }));
    }
  }
}
