import { SupportedStandardEnum } from "@/@types/icrc";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useAppSelector } from "@redux/Store";
import { clsx } from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import OwnSenderAccountSelector from "./OwnSenderAccountSelector";
import AllowanceSenderAccountSelector from "./AllowanceSenderAccountSelector";
import SenderServiceSelector from "./ServiceSenderSelector";

enum TransactionSenderTypeEnum {
  own = "OWN",
  allowance = "ALLOWANCE",
  service = "SERVICE",
}

export default function Sender() {
  const { t } = useTranslation();
  const { assets } = useAppSelector((state) => state.asset.list);
  const { setTransferState } = useTransfer();
  const [senderType, setSenderType] = useState<TransactionSenderTypeEnum>(TransactionSenderTypeEnum.own);

  return (
    <div className="rounded-md bg-secondary-color-1-light dark:bg-level-1-color max-w-[23rem] mx-auto">
      <div className="w-full py-2 border-b border-opacity-25 border-gray-color-2">
        <div className="flex items-center justify-between w-full px-4">
          <p className="font-bold opacity-50 text-black-color dark:text-white">{t("from")}</p>

          <RadioGroup.Root value={senderType} onValueChange={onValueChange} className="flex items-center gap-x-2">
            <div className="flex items-center">
              <RadioGroup.Item
                className={getRadioGroupStyles(senderType === TransactionSenderTypeEnum.own)}
                value={TransactionSenderTypeEnum.own}
                id="r-light"
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-primary-color" />
              </RadioGroup.Item>
              <p className={getRadioTextStyles(senderType === TransactionSenderTypeEnum.own)}>{t("own")}</p>
            </div>

            {isSupportedICRC2() && (
              <div className="flex items-center">
                <RadioGroup.Item
                  className={getRadioGroupStyles(senderType === TransactionSenderTypeEnum.allowance)}
                  value={TransactionSenderTypeEnum.allowance}
                  id="r-light"
                >
                  <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-primary-color" />
                </RadioGroup.Item>
                <p className={getRadioTextStyles(senderType === TransactionSenderTypeEnum.allowance)}>
                  {t("allowance")}
                </p>
              </div>
            )}

            <div className="flex items-center">
              <RadioGroup.Item
                className={getRadioGroupStyles(senderType === TransactionSenderTypeEnum.service)}
                value={TransactionSenderTypeEnum.service}
                id="r-light"
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-primary-color" />
              </RadioGroup.Item>
              <p className={getRadioTextStyles(senderType === TransactionSenderTypeEnum.service)}>{t("services")}</p>
            </div>
          </RadioGroup.Root>
        </div>
      </div>

      <div className="py-4">
        {senderType === TransactionSenderTypeEnum.own && <OwnSenderAccountSelector />}
        {senderType === TransactionSenderTypeEnum.allowance && <AllowanceSenderAccountSelector />}
        {senderType === TransactionSenderTypeEnum.service && <SenderServiceSelector />}
      </div>
    </div>
  );

  function isSupportedICRC2() {
    return assets.find((asset) => asset.supportedStandards.includes(SupportedStandardEnum.Values["ICRC-2"]));
  }

  function onValueChange(selected: TransactionSenderTypeEnum) {
    if (senderType !== selected) {
      setSenderType(selected);
      // TODO: on change the sender data must be cleared, probably select default if senderType own
      setTransferState((prevState) => ({
        ...prevState,
        fromPrincipal: "",
        fromSubAccount: "",
      }));
    }
  }
}

function getRadioGroupStyles(isActive: boolean) {
  return clsx(
    "w-5 h-5 rounded-full border-2  outline-none p-0",
    isActive ? "border-primary-color" : "border-RadioNoCheckColorLight",
  );
}

function getRadioTextStyles(isActive: boolean) {
  return clsx(
    "ml-1 text-lg opacity-50 opacity-50",
    isActive ? "text-primary-color font-bold" : "text-black-color dark:text-white",
  );
}
