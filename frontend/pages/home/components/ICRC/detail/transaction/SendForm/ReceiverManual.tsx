import { NewContact } from "@/@types/transactions";
import { isHexadecimalValid } from "@/utils/checkers";
import { validatePrincipal } from "@/utils/identity";
import { CustomInput } from "@components/Input";
import { useAppSelector } from "@redux/Store";
import { setReceiverNewContactAction } from "@redux/transaction/TransactionActions";
import { useTranslation } from "react-i18next";

export default function ReceiverManual() {
  const { receiver } = useAppSelector((state) => state.transaction);

  const { t } = useTranslation();
  function onPrincipalChange(event: any) {
    const principalValue = event.target.value.trim();

    if (validatePrincipal(principalValue)) {
      const contact: NewContact = {
        ...receiver.thirdNewContact,
        principal: principalValue,
      };
      setReceiverNewContactAction(contact);
    }

    // TODO: add principal no valid to error management system
  }

  function onSubAccountChange(event: any) {
    const subAccountIndex = event.target.value.trim();
    if (isHexadecimalValid(subAccountIndex)) {
      const contact: NewContact = {
        ...receiver.thirdNewContact,
        subAccountId: subAccountIndex,
      };
      setReceiverNewContactAction(contact);
      // QUESTION: format with 0x if not wast set?
    }
    // TODO: add principal no valid to error management system
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
