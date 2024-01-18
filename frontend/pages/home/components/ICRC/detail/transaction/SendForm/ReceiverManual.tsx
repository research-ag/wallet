import { NewContact } from "@/@types/transactions";
import { CustomInput } from "@components/Input";
import { useAppSelector } from "@redux/Store";
import { setReceiverNewContactAction } from "@redux/transaction/TransactionActions";
import { useTranslation } from "react-i18next";

export default function ReceiverManual() {
  const { receiver } = useAppSelector((state) => state.transaction);

  const { t } = useTranslation();
  function onPrincipalChange(event: any) {
    // TODO: validate principal value
    const principalValue = event.target.value.trim();
    const contact: NewContact = {
      ...receiver.thirdNewContact,
      principal: principalValue,
    };
    setReceiverNewContactAction(contact);
  }

  function onSubAccountChange(event: any) {
    // TODO: validate sub account
    const subAccountIndex = event.target.value.trim();
    const contact: NewContact = {
      ...receiver.thirdNewContact,
      subAccountId: subAccountIndex,
    };
    setReceiverNewContactAction(contact);
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
