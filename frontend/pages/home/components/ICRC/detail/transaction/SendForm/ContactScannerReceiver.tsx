import { CustomInput } from "@components/Input";
import { ReactComponent as SearchIcon } from "@assets/svg/files/icon-search.svg";
import { ChangeEvent, useState } from "react";
import { setReceiverIsManualAction, setReceiverNewContactAction } from "@redux/transaction/TransactionActions";
import { useTranslation } from "react-i18next";
import { decodeIcrcAccount } from "@dfinity/ledger";
import { subUint8ArrayToHex } from "@/utils";
import ContactSuffix from "./ContactSuffix";

export default function ContactScannerReceiver() {
  const [ICRCAccountString, setICRCAccountString] = useState<string>("");
  const { t } = useTranslation();

  // TODO: show bordered error if the icrc account has not right format
  return (
    <CustomInput
      prefix={<SearchIcon className="mx-2" />}
      sufix={<ContactSuffix />}
      intent="secondary"
      value={ICRCAccountString}
      // border={errAddress ? "error" : undefined}
      placeholder={t("icrc.account")}
      onChange={onInputChange}
      onKeyUp={onEnterPress}
    />
  );

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    // TODO: validate like the following
    // setNewAccount(e.target.value);
    // if (newAccountErr !== "") setNewAccountErr("");
    // if (e.target.value.trim() !== "")
    //   try {
    //     decodeIcrcAccount(e.target.value);
    //     setErrAddress(false);
    //   } catch {
    //     setErrAddress(true);
    //   }
    // else setErrAddress(false);

    setICRCAccountString(e.target.value.trim());
  }
  function onEnterPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handlerSetReceiver();
    }
  }

  function handlerSetReceiver() {
    // TODO: implement logic that decode and validate icrcAccount string
    const decoded = decodeIcrcAccount(ICRCAccountString);

    const icrcAccount = {
      principal: decoded.owner.toText(),
      subAccountId: `0x${subUint8ArrayToHex(decoded.subaccount)}`,
    };
    setReceiverNewContactAction(icrcAccount);
    setReceiverIsManualAction(true);
  }
}
