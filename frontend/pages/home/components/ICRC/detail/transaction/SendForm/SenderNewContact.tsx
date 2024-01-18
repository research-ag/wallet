import { NewAllowanceContact, SenderState } from "@/@types/transactions";
import { CustomInput } from "@components/Input";

interface NewContactProps {
  sender: SenderState;
  setSenderNewAllowanceContact: (newAllowanceContact: NewAllowanceContact) => void;
}

export default function NewContact(props: NewContactProps) {
  const { sender, setSenderNewAllowanceContact } = props;

  function onPrincipalChange(event: any) {
    // TODO: validate principal value
    const principalValue = event.target.value.trim();

    const newAllowanceContact: NewAllowanceContact = {
      ...sender.newAllowanceContact,
      principal: principalValue,
    };

    setSenderNewAllowanceContact(newAllowanceContact);
  }

  function onSubAccountChange(event: any) {
    // TODO: validate sub account
    const subAccountIndex = event.target.value.trim();
    const newAllowanceContact: NewAllowanceContact = {
      ...sender.newAllowanceContact,
      subAccountId: subAccountIndex,
    };
    setSenderNewAllowanceContact(newAllowanceContact);
  }

  return (
    <div className="flex flex-col gap-2">
      <CustomInput className="rounded-md" placeholder="Principal" onChange={onPrincipalChange} />
      <div className="w-20">
        <CustomInput className="rounded-md" placeholder="Sub" onChange={onSubAccountChange} />
      </div>
    </div>
  );
}
