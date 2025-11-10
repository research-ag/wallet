import { hexToUint8Array } from "@common/utils/hexadecimal";
import { CustomInput } from "@components/input";
import { encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
// import { getSubAccountId } from "@pages/contacts/helpers/formatters";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
// import { isHexadecimalValid } from "@pages/home/helpers/checkers";
import { isValidICRC1Account } from "@pages/home/helpers/validators";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function AllownaceSenderInputs() {
  const { t } = useTranslation();
  const { transferState, setTransferState } = useTransfer();
  // const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (transferState.fromPrincipal && transferState.fromSubAccount) {
      setTransferState({
        ...transferState,
        fromPrincipal: encodeIcrcAccount({
          owner: Principal.fromText(transferState.fromPrincipal),
          subaccount: hexToUint8Array(transferState.fromSubAccount || "0x0"),
        }),
      });
    }
  }, []);

  const principalError = !isValidICRC1Account(transferState.fromPrincipal);

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
    </div>
  );

  function onPrincipalChange(event: any) {
    const principalValue = event.target.value?.trim()?.toLowerCase() as string;

    setTransferState((prev) => ({
      ...prev,
      fromPrincipal: principalValue,
    }));
  }
}
