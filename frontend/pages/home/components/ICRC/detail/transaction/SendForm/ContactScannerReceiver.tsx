import { CustomInput } from "@components/Input";
import { ReactComponent as SearchIcon } from "@assets/svg/files/icon-search.svg";
import { ChangeEvent, useState } from "react";
import {
  removeErrorAction,
  setErrorAction,
  setReceiverIsManualAction,
  setReceiverNewContactAction,
} from "@redux/transaction/TransactionActions";
import { useTranslation } from "react-i18next";
import { decodeIcrcAccount } from "@dfinity/ledger";
import { subUint8ArrayToHex } from "@/utils";
import ContactSuffix from "./ContactSuffix";
import { ValidationErrorsEnum } from "@/@types/transactions";
import { useAppSelector } from "@redux/Store";

export default function ContactScannerReceiver() {
  const { errors } = useAppSelector((state) => state.transaction);
  const [ICRCAccountString, setICRCAccountString] = useState<string>("");
  const { t } = useTranslation();

  return (
    <CustomInput
      prefix={<SearchIcon className="mx-2" />}
      sufix={<ContactSuffix />}
      intent="secondary"
      value={ICRCAccountString}
      border={hasError() ? "error" : "primary"}
      placeholder={t("icrc.account")}
      onChange={onInputChange}
      onKeyUp={onEnterPress}
    />
  );

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    try {
      const fullICRC = e.target.value.trim();
      decodeIcrcAccount(fullICRC);
      setICRCAccountString(fullICRC);
      removeErrorAction(ValidationErrorsEnum.Values["invalid.sender"]);
    } catch (error) {
      setErrorAction(ValidationErrorsEnum.Values["invalid.sender"]);
      console.error(error);
    }
  }

  function onEnterPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handlerSetReceiver();
    }
  }

  function handlerSetReceiver() {
    try {
      const decoded = decodeIcrcAccount(ICRCAccountString);
      const icrcAccount = {
        principal: decoded.owner.toText(),
        subAccountId: `0x${subUint8ArrayToHex(decoded.subaccount)}`,
      };
      setReceiverNewContactAction(icrcAccount);
      setReceiverIsManualAction(true);
      removeErrorAction(ValidationErrorsEnum.Values["invalid.sender"]);
    } catch (error) {
      setErrorAction(ValidationErrorsEnum.Values["invalid.sender"]);
      console.error(error);
    }
  }
  function hasError() {
    return errors?.includes(ValidationErrorsEnum.Values["invalid.sender"]);
  }
}
