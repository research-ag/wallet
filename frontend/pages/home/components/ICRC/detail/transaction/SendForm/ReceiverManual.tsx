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
  
  //   TODO: if the sender if allowance the receiver can not be the same sub and principal
  function onPrincipalChange(event: any) {
    const principalValue = event.target.value.trim();

    if (validatePrincipal(principalValue)) {
      const contact: NewContact = {
        ...receiver.thirdNewContact,
        principal: principalValue,
      };
      setReceiverNewContactAction(contact);
    }

    // TODO: set error if principal is not valid bordered
  }

  function onSubAccountChange(event: any) {
    const subAccountIndex = event.target.value.trim();
    if (isHexadecimalValid(subAccountIndex)) {
      const contact: NewContact = {
        ...receiver.thirdNewContact,
        subAccountId: subAccountIndex?.startsWith("0x") ? subAccountIndex : `0x${subAccountIndex}`,
      };
      setReceiverNewContactAction(contact);
    }
    // TODO: set error if sub account id is not valid bordered
  }

  return (
    <div className="flex flex-col gap-2">
      <CustomInput
        className="rounded-md"
        value={receiver?.thirdNewContact?.principal}
        intent="secondary"
        placeholder="Principal"
        onChange={onPrincipalChange}
      />
      <div className="w-20">
        <CustomInput
          className="rounded-md"
          value={
            receiver?.thirdNewContact?.subAccountId?.startsWith("0x")
              ? receiver?.thirdNewContact?.subAccountId.slice(2)
              : receiver?.thirdNewContact?.subAccountId
          }
          intent="secondary"
          placeholder={t("sub-acc")}
          onChange={onSubAccountChange}
        />
      </div>
    </div>
  );
}
