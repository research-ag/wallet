import { ReactComponent as SearchIcon } from "@assets/svg/files/icon-search.svg";
import logger from "@/common/utils/logger";
import { CustomInput } from "@components/input";
import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ThidInputSufix from "@/pages/home/components/ICRC/transaction/transfer/ThirdInputSufix";
import { decodeIcrcAccount, encodeIcrcAccount } from "@dfinity/ledger";
import { subUint8ArrayToHex } from "@common/utils/unitArray";
import { TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import useReceiver from "@pages/home/hooks/useReceiver";
import ContactBookReceiver from "@/pages/home/components/ICRC/transaction/transfer/ReceiverContactSelector";
import ServiceBookReceiver from "@/pages/home/components/ICRC/transaction/transfer/ReceiverServiceSelector";
import { Principal } from "@dfinity/principal";
import { hexToUint8Array } from "@common/utils/hexadecimal";

export default function ReceiverThird() {
  const { isToFilled, toType } = useReceiver();
  if (!isToFilled) return <ICRCInput />;

  switch (toType) {
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
  const { setTransferState, transferState } = useTransfer();

  useEffect(() => {
    const isICRC = transferState.toType === TransferToTypeEnum.thirdPartyICRC;
    const isScanner = transferState.toType === TransferToTypeEnum.thidPartyScanner;
    const isNotEmpty = transferState.toPrincipal && transferState.toSubAccount;

    if ((isICRC || isScanner) && isNotEmpty) {
      const principal = transferState.toPrincipal;
      const subAccountId = transferState.toSubAccount;

      const encodedICRCIdentifier = encodeIcrcAccount({
        owner: Principal.fromText(principal),
        subaccount: hexToUint8Array(subAccountId),
      });

      setInputValue(encodedICRCIdentifier);
    }
  }, []);

  const icrcError = !(inputValue === "") && !isIcrcValid(inputValue);

  return (
    <div className="max-w-[21rem] mx-auto py-[1rem]">
      <CustomInput
        prefix={<SearchIcon className="mx-2" />}
        sufix={<ThidInputSufix />}
        intent="secondary"
        value={inputValue}
        border={icrcError ? "error" : "primary"}
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
    } catch (error) {
      logger.debug(error);
    }
  }

  function isIcrcValid(icrc: string) {
    try {
      decodeIcrcAccount(icrc);
      return true;
    } catch (error) {
      return false;
    }
  }
}
