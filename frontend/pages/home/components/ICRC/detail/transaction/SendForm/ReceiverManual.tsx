import { NewContact, ReceiverState, SetReceiverNewContact } from "@/@types/transactions";
import { CustomInput } from "@components/Input";
import { useTranslation } from "react-i18next";

interface ReceiverManualProps {
  setReceiverNewContact: SetReceiverNewContact;
  receiver: ReceiverState;
}

export default function ReceiverManual(props: ReceiverManualProps) {
  const { setReceiverNewContact, receiver } = props;

  const { t } = useTranslation();
  function onPrincipalChange(event: any) {
    // TODO: validate principal value
    const principalValue = event.target.value.trim();
    const contact: NewContact = {
      ...receiver.thirdNewContact,
      principal: principalValue,
    };
    setReceiverNewContact(contact);
  }

  function onSubAccountChange(event: any) {
    // TODO: validate sub account
    const subAccountIndex = event.target.value.trim();
    const contact: NewContact = {
      ...receiver.thirdNewContact,
      subAccountId: subAccountIndex,
    };
    setReceiverNewContact(contact);
  }

  return (
    <div className="flex flex-col gap-2">
      <CustomInput className="rounded-md" intent="secondary" placeholder="Principal" onChange={onPrincipalChange} />
      <div className="w-20">
        <CustomInput
          className="rounded-md"
          intent="secondary"
          placeholder={t("sub-acc")}
          onChange={onSubAccountChange}
        />
      </div>
    </div>
  );
}
