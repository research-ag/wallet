import { Contact, NewContactErrors } from "@/@types/contacts";
import { CustomInput } from "@components/input";
import { useTranslation } from "react-i18next";
import { validatePrincipal } from "@common/utils/definityIdentity";
import { useContactError } from "@pages/contacts/contexts/ContactErrorProvider";
import { useContact } from "@pages/contacts/contexts/ContactProvider";

// TODO: validate that the principal is a valid principal
// TODO: validate the name length
// TODO: validate that the principal does not already exist
export default function ContactMainDetails() {
  const { newContact, setNewContact } = useContact();
  const { setNewContactErrors, newContactErrors } = useContactError();
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-start justify-start w-full gap-3">
      <div className="flex flex-col justify-start items-start w-[50%]">
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
          onChange={(e) => onPrincipalChange(e.target.value)}
        />
      </div>
    </div>
  );

  function onPrincipalChange(value: string) {
    setNewContact((prev: Contact) => ({ ...prev, principal: value }));

    if (!validatePrincipal(value)) {
      setNewContactErrors((prev: NewContactErrors) => ({ ...prev, principal: true }));
    } else {
      setNewContactErrors((prev: NewContactErrors) => ({ ...prev, principal: false }));
    }
  }

  function onNameChange(value: string) {
    setNewContact((prev: Contact) => ({ ...prev, name: value }));
    if (value.length === 0) setNewContactErrors((prev) => ({ ...prev, name: true }));
    else setNewContactErrors((prev) => ({ ...prev, name: false }));
  }
}
