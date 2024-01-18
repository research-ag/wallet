import { NewContact } from "@/@types/transactions";
import { isHexadecimalValid } from "@/utils/checkers";
import { validatePrincipal } from "@/utils/identity";
import { CustomInput } from "@components/Input";
import { useAppSelector } from "@redux/Store";
import { setSenderContactNewAction } from "@redux/transaction/TransactionActions";

export default function SenderNewContact() {
  const { sender } = useAppSelector((state) => state.transaction);
  function onPrincipalChange(event: any) {
    const principalValue = event.target.value.trim();

    if (validatePrincipal(principalValue)) {
      const newAllowanceContact: NewContact = {
        ...sender.newAllowanceContact,
        principal: principalValue,
      };
      setSenderContactNewAction(newAllowanceContact);
      return;
    }

    // TODO: add principal no valid to error management system
  }

  function onSubAccountChange(event: any) {
    const subAccountIndex = event.target.value.trim();

    if (isHexadecimalValid(subAccountIndex)) {
      const newAllowanceContact: NewContact = {
        ...sender.newAllowanceContact,
        subAccountId: subAccountIndex,
      };
      setSenderContactNewAction(newAllowanceContact);
      // QUESTION: format with 0x if not wast set?
    }
    // TODO: add principal no valid to error management system
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
