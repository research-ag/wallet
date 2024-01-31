import { NewContact, ValidationErrorsEnum } from "@/@types/transactions";
import { isHexadecimalValid } from "@/utils/checkers";
import { validatePrincipal } from "@/utils/identity";
import { CustomInput } from "@components/Input";
import { useAppSelector } from "@redux/Store";
import { removeErrorAction, setErrorAction, setSenderContactNewAction } from "@redux/transaction/TransactionActions";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SenderNewContact() {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");

  const { sender, errors } = useAppSelector((state) => state.transaction);
  useEffect(() => {
    if (sender?.newAllowanceContact?.subAccountId?.length > 0) {
      const currentSubAccountId = sender?.newAllowanceContact?.subAccountId;

      const newInputValue = currentSubAccountId?.startsWith("0x") ? currentSubAccountId.slice(2) : currentSubAccountId;

      setInputValue(newInputValue);
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 mx-4 mb-2">
      <CustomInput
        className="rounded-md"
        value={sender?.newAllowanceContact?.principal || ""}
        placeholder={t("principal")}
        onChange={onPrincipalChange}
        border={hasPrincipalError() ? "error" : "primary"}
      />
      <div className="w-[8rem]">
        <CustomInput
          className="rounded-md"
          value={inputValue}
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
      setErrorAction(ValidationErrorsEnum.Values["error.invalid.sender.principal"]);
    } else {
      removeErrorAction(ValidationErrorsEnum.Values["error.invalid.sender.principal"]);
    }

    const newAllowanceContact: NewContact = {
      ...sender.newAllowanceContact,
      principal: principalValue,
    };
    setSenderContactNewAction(newAllowanceContact);
  }

  function onSubAccountChange(event: any) {
    const subAccountIndex = event.target.value.trim() as string;
    setInputValue(subAccountIndex);

    if (!isHexadecimalValid(subAccountIndex)) {
      setErrorAction(ValidationErrorsEnum.Values["error.invalid.sender.subaccount"]);
      return;
    } else {
      removeErrorAction(ValidationErrorsEnum.Values["error.invalid.sender.subaccount"]);
    }

    const newAllowanceContact: NewContact = {
      ...sender.newAllowanceContact,
      subAccountId: subAccountIndex?.startsWith("0x") ? subAccountIndex : `0x${subAccountIndex}`,
    };

    setSenderContactNewAction(newAllowanceContact);
  }

  function hasPrincipalError() {
    return errors?.includes(ValidationErrorsEnum.Values["error.invalid.sender.principal"]);
  }

  function hasSubAccountError() {
    return errors?.includes(ValidationErrorsEnum.Values["error.invalid.sender.subaccount"]);
  }
}
