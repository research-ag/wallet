import { NewContact, ValidationErrorsEnum } from "@/@types/transactions";
import { isHexadecimalValid } from "@/utils/checkers";
import { validatePrincipal } from "@/utils/identity";
import { CustomInput } from "@components/Input";
import { useAppSelector } from "@redux/Store";
import { removeErrorAction, setErrorAction, setSenderContactNewAction } from "@redux/transaction/TransactionActions";
import { useTranslation } from "react-i18next";

export default function SenderNewContact() {
  const { t } = useTranslation();
  const { sender, errors } = useAppSelector((state) => state.transaction);

  return (
    <div className="flex flex-col gap-2">
      <CustomInput
        className="rounded-md"
        value={sender?.newAllowanceContact?.principal}
        placeholder={t("principal")}
        onChange={onPrincipalChange}
        border={hasPrincipalError() ? "error" : "primary"}
      />
      <div className="w-[8rem]">
        <CustomInput
          className="rounded-md"
          value={
            sender?.newAllowanceContact?.subAccountId?.startsWith("0x")
              ? sender?.newAllowanceContact?.subAccountId.slice(2)
              : sender?.newAllowanceContact?.subAccountId
          }
          placeholder={t("sub-acc")}
          onChange={onSubAccountChange}
          border={hasSubAccountError() ? "error" : "primary"}
        />
      </div>
    </div>
  );

  function onPrincipalChange(event: any) {
    const principalValue = event.target.value.trim();

    if (!validatePrincipal(principalValue)) {
      setErrorAction(ValidationErrorsEnum.Values["invalid.sender.principal"]);
    } else {
      removeErrorAction(ValidationErrorsEnum.Values["invalid.sender.principal"]);
    }
    const newAllowanceContact: NewContact = {
      ...sender.newAllowanceContact,
      principal: principalValue,
    };
    setSenderContactNewAction(newAllowanceContact);
  }

  function onSubAccountChange(event: any) {
    const subAccountIndex = event.target.value.trim() as string;

    if (!isHexadecimalValid(subAccountIndex)) {
      setErrorAction(ValidationErrorsEnum.Values["invalid.sender.subaccount"]);
    } else {
      removeErrorAction(ValidationErrorsEnum.Values["invalid.sender.subaccount"]);
    }

    const newAllowanceContact: NewContact = {
      ...sender.newAllowanceContact,
      subAccountId: subAccountIndex?.startsWith("0x") ? subAccountIndex : `0x${subAccountIndex}`,
    };

    setSenderContactNewAction(newAllowanceContact);
  }

  function hasPrincipalError() {
    return errors?.includes(ValidationErrorsEnum.Values["invalid.sender.principal"]);
  }

  function hasSubAccountError() {
    return errors?.includes(ValidationErrorsEnum.Values["invalid.sender.subaccount"]);
  }
}
