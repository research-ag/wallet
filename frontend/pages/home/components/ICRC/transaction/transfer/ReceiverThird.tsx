import { ReactComponent as SearchIcon } from "@assets/svg/files/icon-search.svg";
import logger from "@/common/utils/logger";
import { CustomInput } from "@components/input";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import ThidInputSufix from "./ThirdInputSufix";
import { decodeIcrcAccount } from "@dfinity/ledger";
import { subUint8ArrayToHex } from "@common/utils/unitArray";
import { TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import useReceiver from "@pages/home/hooks/useReceiver";
import ReceiverManual from "./ReceiverManual";
import ContactBookReceiver from "./ReceiverContactSelector";
import ServiceBookReceiver from "./ReceiverServiceSelector";

export default function ReceiverThird() {
  const { isToFilled, toType } = useReceiver();

  if (!isToFilled) {
    return <ICRCInput />;
  }

  switch (toType) {
    case TransferToTypeEnum.thirdPartyICRC:
      return <ReceiverManual />;
    case TransferToTypeEnum.thidPartyScanner:
      return <ReceiverManual />;
    case TransferToTypeEnum.thirdPartyContact:
      return <ContactBookReceiver />;
    case TransferToTypeEnum.thirdPartyService:
      return <ServiceBookReceiver />;
    default:
      return <ICRCInput />;
  }
}

function ICRCInput() {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const { setTransferState } = useTransfer();

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

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    try {
      const fullICRC = e.target.value?.trim();
      setInputValue(fullICRC);
      const decoded = decodeIcrcAccount(fullICRC);

      const toPrincipal = decoded.owner.toText();
      const toSubAccount = `0x${subUint8ArrayToHex(decoded.subaccount)}`;

      setTransferState((prevState) => ({
        ...prevState,
        toPrincipal,
        toSubAccount,
        toType: TransferToTypeEnum.thirdPartyICRC,
      }));

      // TODO: manage error cases
    } catch (error) {
      logger.debug(error);
    }
  }

  // function initializeICRCIdentifier() {
  // const principal = receiver?.thirdNewContact?.principal;
  // const subAccountId = receiver?.thirdNewContact?.subAccountId;
  // if (isHexadecimalValid(subAccountId) && validatePrincipal(principal)) {
  //   const encodedICRCIdentifier = getICRCIdentifier(principal, subAccountId);
  //   setInputValue(encodedICRCIdentifier);
  // }
  // }

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
