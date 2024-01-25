import { NewContact, ValidationErrorsEnum } from "@/@types/transactions";
import { validatePrincipal } from "@/utils/identity";
import { CustomInput } from "@components/Input";
import { useAppSelector } from "@redux/Store";
import { removeErrorAction, setErrorAction, setReceiverNewContactAction } from "@redux/transaction/TransactionActions";
import { useTranslation } from "react-i18next";

export default function ReceiverManual() {
  const { receiver, errors } = useAppSelector((state) => state.transaction);
  const { t } = useTranslation();

  // TODO: the receiver can not has the same data of the sender
  function onPrincipalChange(event: any) {
    const principalValue = event.target.value.trim();

    if (!validatePrincipal(principalValue)) {
      setErrorAction(ValidationErrorsEnum.Values["invalid.receiver.principal"]);
    } else {
      removeErrorAction(ValidationErrorsEnum.Values["invalid.receiver.principal"]);
    }

    const contact: NewContact = {
      ...receiver.thirdNewContact,
      principal: principalValue,
    };
    setReceiverNewContactAction(contact);
  }

  function onSubAccountChange(event: any) {
    const subAccountIndex = event.target.value.trim();

    const contact: NewContact = {
      ...receiver.thirdNewContact,
      subAccountId: subAccountIndex?.startsWith("0x") ? subAccountIndex : `0x${subAccountIndex}`,
    };
    setReceiverNewContactAction(contact);
  }

  return (
    <div className="flex flex-col gap-2">
      <CustomInput
        className="rounded-md"
        value={receiver?.thirdNewContact?.principal}
        intent="secondary"
        placeholder={t("principal")}
        border={hasPrincipalError() ? "error" : "primary"}
        onChange={onPrincipalChange}
      />
      <div className="w-[8rem]">
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
          border={hasSubAccountError() ? "error" : "primary"}
        />
      </div>
    </div>
  );

  function hasPrincipalError() {
    return errors?.includes(ValidationErrorsEnum.Values["invalid.receiver.principal"]);
  }

  function hasSubAccountError() {
    return errors?.includes(ValidationErrorsEnum.Values["invalid.receiver.subaccount"]);
  }
}
