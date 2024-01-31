import { NewContact, ValidationErrorsEnum } from "@/@types/transactions";
import { isHexadecimalValid } from "@/utils/checkers";
import { validatePrincipal } from "@/utils/identity";
import { CustomInput } from "@components/Input";
import { useAppSelector } from "@redux/Store";
import { removeErrorAction, setErrorAction, setReceiverNewContactAction } from "@redux/transaction/TransactionActions";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ReceiverManual() {
  const [inputValue, setInputValue] = useState("");
  const { receiver, errors } = useAppSelector((state) => state.transaction);
  const { t } = useTranslation();

  useEffect(() => {
    if (receiver?.thirdNewContact?.subAccountId?.length > 0) {
      const currentSubAccountId = receiver?.thirdNewContact?.subAccountId;

      const newInputValue = currentSubAccountId?.startsWith("0x") ? currentSubAccountId.slice(2) : currentSubAccountId;

      setInputValue(newInputValue);
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 mx-4 mt-4">
      <CustomInput
        className="rounded-md"
        value={receiver?.thirdNewContact?.principal || ""}
        intent="secondary"
        placeholder={t("principal")}
        border={hasPrincipalError() ? "error" : "primary"}
        onChange={onPrincipalChange}
      />
      <div className="w-[8rem]">
        <CustomInput
          className="rounded-md"
          value={inputValue || ""}
          intent="secondary"
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
      setErrorAction(ValidationErrorsEnum.Values["error.invalid.receiver.principal"]);
    } else {
      removeErrorAction(ValidationErrorsEnum.Values["error.invalid.receiver.principal"]);
    }

    const contact: NewContact = {
      ...receiver.thirdNewContact,
      principal: principalValue,
    };
    setReceiverNewContactAction(contact);
  }

  function onSubAccountChange(event: any) {
    const subAccountIndex = event.target.value.trim();
    setInputValue(subAccountIndex);

    if (!isHexadecimalValid(subAccountIndex)) {
      setErrorAction(ValidationErrorsEnum.Values["error.invalid.receiver.subaccount"]);
      return;
    } else {
      removeErrorAction(ValidationErrorsEnum.Values["error.invalid.receiver.subaccount"]);
    }

    const contact: NewContact = {
      ...receiver.thirdNewContact,
      subAccountId: subAccountIndex?.startsWith("0x") ? subAccountIndex : `0x${subAccountIndex}`,
    };
    setReceiverNewContactAction(contact);
  }

  function hasPrincipalError() {
    return errors?.includes(ValidationErrorsEnum.Values["error.invalid.receiver.principal"]);
  }

  function hasSubAccountError() {
    return errors?.includes(ValidationErrorsEnum.Values["error.invalid.receiver.subaccount"]);
  }
}
