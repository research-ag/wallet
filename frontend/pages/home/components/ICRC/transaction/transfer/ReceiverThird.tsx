import { ReactComponent as SearchIcon } from "@assets/svg/files/icon-search.svg";

// icrc idenfier, contact book, services (not if sender is allowance), scanner

import { CustomInput } from "@components/input";
// import { useAppSelector } from "@redux/Store";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import ThidInputSufix from "./ThirdInputSufix";

export default function ReceiverThird() {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  // const { errors, receiver } = useAppSelector((state) => state.transaction);

  // useEffect(() => {
  //   if (receiver?.thirdNewContact?.subAccountId) {
  //     initializeICRCIdentifier();
  //   }
  // }, []);

  // if (toPrincipal and toSubaccount is selected) { display inputs or select based on the toType };

  return (
    <div className="max-w-[21rem] mx-auto py-[1rem]">
      <CustomInput
        prefix={<SearchIcon className="mx-2" />}
        sufix={<ThidInputSufix />}
        intent="secondary"
        value={inputValue}
        // border={hasError() ? "error" : "primary"}
        placeholder={t("icrc.account")}
        onChange={onInputChange}
      />
    </div>
  );

  // function initializeICRCIdentifier() {
  // const principal = receiver?.thirdNewContact?.principal;
  // const subAccountId = receiver?.thirdNewContact?.subAccountId;
  // if (isHexadecimalValid(subAccountId) && validatePrincipal(principal)) {
  //   const encodedICRCIdentifier = getICRCIdentifier(principal, subAccountId);
  //   setInputValue(encodedICRCIdentifier);
  // }
  // }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    console.log(e);
    // try {
    //   const fullICRC = e.target.value?.trim();
    //   setInputValue(fullICRC);
    //   const decoded = decodeIcrcAccount(fullICRC);

    //   const icrcAccount = {
    //     principal: decoded.owner.toText(),
    //     subAccountId: `0x${subUint8ArrayToHex(decoded.subaccount)}`,
    //   };

    //   setReceiverNewContactAction(icrcAccount);
    //   removeErrorAction(TransactionValidationErrorsEnum.Values["invalid.receiver.identifier"]);
    // } catch (error) {
    //   logger.debug(error);
    //   setErrorAction(TransactionValidationErrorsEnum.Values["invalid.receiver.identifier"]);
    // }
  }

  // function hasError() {
  //   return errors?.includes(TransactionValidationErrorsEnum.Values["invalid.receiver.identifier"]);
  // }

  // function getICRCIdentifier(principal: string, subAccountId: string) {
  //   try {
  //     return encodeIcrcAccount({
  //       owner: Principal.fromText(principal),
  //       subaccount: hexToUint8Array(subAccountId),
  //     });
  //   } catch (error) {
  //     setErrorAction(TransactionValidationErrorsEnum.Values["invalid.receiver.identifier"]);
  //     return "";
  //   }
  // }
}
