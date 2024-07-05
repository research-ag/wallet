import { CustomInput } from "@components/input";
import { getSubAccountId } from "@pages/contacts/helpers/formatters";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { isHexadecimalValid } from "@pages/home/helpers/checkers";
import { isValidInputPrincipal } from "@pages/home/helpers/validators";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ReceiverManual() {
  const [inputValue, setInputValue] = useState("");
  const { transferState, setTransferState } = useTransfer();
  const { t } = useTranslation();

  useEffect(() => {
    if (transferState.toSubAccount.length > 0) {
      setInputValue(transferState.toSubAccount);
    }
  }, []);

  const principalError = !isValidInputPrincipal(transferState.toPrincipal);
  const subAccountError = !isHexadecimalValid(transferState.toSubAccount) && transferState.toSubAccount.length > 0;

  return (
    <div className="max-w-[21rem] mx-auto py-[1rem] space-y-1">
      <CustomInput
        className="rounded-md"
        value={transferState.toPrincipal}
        intent="secondary"
        placeholder={t("principal")}
        border={principalError ? "error" : "primary"}
        onChange={onPrincipalChange}
      />
      <div className="w-[8rem]">
        <CustomInput
          className="rounded-md"
          value={inputValue || ""}
          intent="secondary"
          placeholder={t("sub-acc")}
          onChange={onSubAccountChange}
          border={subAccountError ? "error" : "primary"}
        />
      </div>
    </div>
  );

  function onPrincipalChange(event: any) {
    const principalValue = event.target.value.trim()?.toLowerCase();
    setTransferState((prev) => ({
      ...prev,
      toPrincipal: principalValue,
    }));
  }

  function onSubAccountChange(event: any) {
    const subAccountIndex = event.target.value.trim()?.toLowerCase() as string;
    setInputValue(subAccountIndex);

    setTransferState((prev) => ({
      ...prev,
      toSubAccount: getSubAccountId(subAccountIndex),
    }));
  }
}
