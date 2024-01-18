import { NewContact } from "@/@types/transactions";
import { CustomInput } from "@components/Input";
import { useAppSelector } from "@redux/Store";
import { setSenderContactNewAction } from "@redux/transaction/TransactionActions";

export default function SenderNewContact() {
  const { sender } = useAppSelector((state) => state.transaction);
  function onPrincipalChange(event: any) {
    // TODO: validate principal value
    const principalValue = event.target.value.trim();

    const newAllowanceContact: NewContact = {
      ...sender.newAllowanceContact,
      principal: principalValue,
    };

    setSenderContactNewAction(newAllowanceContact);
  }

  function onSubAccountChange(event: any) {
    // TODO: validate sub account
    const subAccountIndex = event.target.value.trim();
    const newAllowanceContact: NewContact = {
      ...sender.newAllowanceContact,
      subAccountId: subAccountIndex,
    };
    setSenderContactNewAction(newAllowanceContact);
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
