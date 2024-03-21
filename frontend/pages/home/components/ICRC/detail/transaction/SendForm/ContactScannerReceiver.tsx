import { CustomInput } from "@components/input";
import { ReactComponent as SearchIcon } from "@assets/svg/files/icon-search.svg";
import { ChangeEvent, useEffect, useState } from "react";
import { removeErrorAction, setErrorAction, setReceiverNewContactAction } from "@redux/transaction/TransactionActions";
import { useTranslation } from "react-i18next";
import { decodeIcrcAccount, encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { hexToUint8Array, subUint8ArrayToHex } from "@/utils";
import ContactSuffix from "./ContactSuffix";
import { TransactionValidationErrorsEnum } from "@/@types/transactions";
import { useAppSelector } from "@redux/Store";
import { isHexadecimalValid } from "@/utils/checkers";
import { validatePrincipal } from "@/utils/identity";
import { Principal } from "@dfinity/principal";

export default function ContactScannerReceiver() {
  const [inputValue, setInputValue] = useState("");
  const { errors, receiver } = useAppSelector((state) => state.transaction);
  const { t } = useTranslation();

  useEffect(() => {
    if (receiver?.thirdNewContact?.subAccountId) {
      initializeICRCIdentifier();
    }
  }, []);

  return (
    <div className="mx-4 mt-4">
      <CustomInput
        prefix={<SearchIcon className="mx-2" />}
        sufix={<ContactSuffix />}
        intent="secondary"
        value={inputValue}
        border={hasError() ? "error" : "primary"}
        placeholder={t("icrc.account")}
        onChange={onInputChange}
      />
    </div>
  );

  function initializeICRCIdentifier() {
    const principal = receiver?.thirdNewContact?.principal;
    const subAccountId = receiver?.thirdNewContact?.subAccountId;
    if (isHexadecimalValid(subAccountId) && validatePrincipal(principal)) {
      const encodedICRCIdentifier = getICRCIdentifier(principal, subAccountId);
      setInputValue(encodedICRCIdentifier);
    }
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    try {
      const fullICRC = e.target.value?.trim();
      setInputValue(fullICRC);
      const decoded = decodeIcrcAccount(fullICRC);

      const icrcAccount = {
        principal: decoded.owner.toText(),
        subAccountId: `0x${subUint8ArrayToHex(decoded.subaccount)}`,
      };

      setReceiverNewContactAction(icrcAccount);
      removeErrorAction(TransactionValidationErrorsEnum.Values["invalid.receiver.identifier"]);
    } catch (error) {
      console.log(error);
      setErrorAction(TransactionValidationErrorsEnum.Values["invalid.receiver.identifier"]);
    }
  }

  function hasError() {
    return errors?.includes(TransactionValidationErrorsEnum.Values["invalid.receiver.identifier"]);
  }

  function getICRCIdentifier(principal: string, subAccountId: string) {
    try {
      return encodeIcrcAccount({
        owner: Principal.fromText(principal),
        subaccount: hexToUint8Array(subAccountId),
      });
    } catch (error) {
      setErrorAction(TransactionValidationErrorsEnum.Values["invalid.receiver.identifier"]);
      return "";
    }
  }
}
