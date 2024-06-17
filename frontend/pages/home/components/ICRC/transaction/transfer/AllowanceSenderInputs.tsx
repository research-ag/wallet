import { checkHexString } from "@common/utils/hexadecimal";
import { CustomInput } from "@components/input";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { isValidInputPrincipal } from "@pages/home/helpers/validators";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function AllownaceSenderInputs() {
  const { t } = useTranslation();
  const { transferState, setTransferState } = useTransfer();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (transferState.fromSubAccount.length > 0) {
      setInputValue(transferState.fromSubAccount);
    }
  }, []);

  const principalError = !isValidInputPrincipal(transferState.fromPrincipal);
  const subAccountError = !checkHexString(transferState.toSubAccount);

  return (
    <div className="flex flex-col gap-2 mx-4 mb-2">
      <CustomInput
        className="rounded-md"
        intent="secondary"
        value={transferState.fromPrincipal}
        placeholder={t("principal")}
        onChange={onPrincipalChange}
        border={principalError ? "error" : "primary"}
      />
      <div className="w-[8rem]">
        <CustomInput
          className="rounded-md"
          intent="secondary"
          value={inputValue}
          placeholder={t("sub-acc")}
          onChange={onSubAccountChange}
          border={subAccountError ? "error" : "primary"}
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
  }

  function onSubAccountChange(event: any) {
    const subAccountIndex = event.target.value.trim() as string;
    setInputValue(subAccountIndex);

    setTransferState((prev) => ({
      ...prev,
      fromSubAccount: subAccountIndex?.startsWith("0x") ? subAccountIndex : `0x${subAccountIndex}`,
    }));
  }
}
