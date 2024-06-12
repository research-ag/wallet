import { CustomInput } from "@components/input";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// TODO: add validations on inputs for principal and sub account
export default function AllownaceSenderInputs() {
  const { t } = useTranslation();
  const { transferState, setTransferState } = useTransfer();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (transferState.fromPrincipal.length > 0) {
      const currentSubAccountId = transferState.fromSubAccount;
      const newInputValue = currentSubAccountId?.startsWith("0x") ? currentSubAccountId.slice(2) : currentSubAccountId;
      setInputValue(newInputValue);
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 mx-4 mb-2">
      <CustomInput
        className="rounded-md"
        value={transferState.fromPrincipal}
        placeholder={t("principal")}
        onChange={onPrincipalChange}
        // border={hasPrincipalError() ? "error" : "primary"}
      />
      <div className="w-[8rem]">
        <CustomInput
          className="rounded-md"
          value={inputValue}
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
      fromPrincipal: principalValue,
    }));

    // if (!validatePrincipal(principalValue)) {
    //   setErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.sender.principal"]);
    // } else {
    //   removeErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.sender.principal"]);
    // }
  }

  function onSubAccountChange(event: any) {
    const subAccountIndex = event.target.value.trim() as string;
    setInputValue(subAccountIndex);

    setTransferState((prev) => ({
      ...prev,
      fromSubAccount: subAccountIndex,
    }));

    // if (!isHexadecimalValid(subAccountIndex)) {
    //   setErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.sender.subaccount"]);
    //   return;
    // } else {
    //   removeErrorAction(TransactionValidationErrorsEnum.Values["error.invalid.sender.subaccount"]);
    // }
  }

  // function hasPrincipalError() {
  // return errors?.includes(TransactionValidationErrorsEnum.Values["error.invalid.sender.principal"]);
  // }

  // function hasSubAccountError() {
  // return errors?.includes(TransactionValidationErrorsEnum.Values["error.invalid.sender.subaccount"]);
  // }
}
