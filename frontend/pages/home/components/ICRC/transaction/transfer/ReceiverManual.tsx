import { CustomInput } from "@components/input";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ReceiverManual() {
  const [inputValue, setInputValue] = useState("");
  const { transferState, setTransferState } = useTransfer();
  const { t } = useTranslation();

  // useEffect(() => {
  //   if (receiver?.thirdNewContact?.subAccountId?.length > 0) {
  //     const currentSubAccountId = receiver?.thirdNewContact?.subAccountId;

  //     const newInputValue = currentSubAccountId?.startsWith("0x") ? currentSubAccountId.slice(2) : currentSubAccountId;

  //     setInputValue(newInputValue);
  //   }
  // }, []);

  return (
    <div className="max-w-[21rem] mx-auto py-[1rem] space-y-1">
      <CustomInput
        className="rounded-md"
        value={transferState.toPrincipal}
        intent="secondary"
        placeholder={t("principal")}
        // border={hasPrincipalError() ? "error" : "primary"}
        onChange={onPrincipalChange}
      />
      <div className="w-[8rem]">
        <CustomInput
          className="rounded-md"
          value={inputValue || ""}
          intent="secondary"
          placeholder={t("sub-acc")}
          onChange={onSubAccountChange}
          // border={hasSubAccountError() ? "error" : "primary"}
        />
      </div>
    </div>
  );

  function onPrincipalChange(event: any) {
    const principalValue = event.target.value.trim();
    setTransferState((prev) => ({
      ...prev,
      toPrincipal: principalValue,
    }));

    // const contact: NewContact = {
    //   ...receiver.thirdNewContact,
    //   principal: principalValue,
    // };
    // setReceiverNewContactAction(contact);

    // if (!validatePrincipal(principalValue)) {
    //   setErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.receiver.principal"]);
    // } else {
    //   removeErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.receiver.principal"]);
    // }
  }

  function onSubAccountChange(event: any) {
    const subAccountIndex = event.target.value.trim();
    setInputValue(subAccountIndex);

    setTransferState((prev) => ({
      ...prev,
      toSubAccount: subAccountIndex?.startsWith("0x") ? subAccountIndex : `0x${subAccountIndex}`,
    }));

    // const contact: NewContact = {
    //   ...receiver.thirdNewContact,
    //   subAccountId: subAccountIndex?.startsWith("0x") ? subAccountIndex : `0x${subAccountIndex}`,
    // };

    // setReceiverNewContactAction(contact);

    // if (!isHexadecimalValid(subAccountIndex)) {
    //   setErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.receiver.subaccount"]);
    //   return;
    // } else {
    //   removeErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.receiver.subaccount"]);
    // }
  }

  // function hasPrincipalError() {
  //   return errors?.includes(TransactionValidationErrorsEnum.Values["error.invalid.receiver.principal"]);
  // }

  // function hasSubAccountError() {
  //   return errors?.includes(TransactionValidationErrorsEnum.Values["error.invalid.receiver.subaccount"]);
  // }
}
