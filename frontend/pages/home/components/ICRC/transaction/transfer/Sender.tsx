import { SupportedStandardEnum } from "@/@types/icrc";
import { TransferFromTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useAppSelector } from "@redux/Store";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import OwnSenderAccountSelector from "@/pages/home/components/ICRC/transaction/transfer/OwnSenderAccountSelector";
import AllowanceSenderAccountSelector from "@/pages/home/components/ICRC/transaction/transfer/AllowanceSenderAccountSelector";
import SenderServiceSelector from "@/pages/home/components/ICRC/transaction/transfer/ServiceSenderSelector";

export default function Sender() {
  const { t } = useTranslation();
  const { assets } = useAppSelector((state) => state.asset.list);
  const { setTransferState, transferState } = useTransfer();

  //
  const senderType = transferState.fromType;
  const isFromOwn = senderType === TransferFromTypeEnum.own;
  const isFromService = senderType === TransferFromTypeEnum.service;
  //
  const isFromAllowanceContact = senderType === TransferFromTypeEnum.allowanceContactBook;
  const isFromAllowanceManual = senderType === TransferFromTypeEnum.allowanceManual;
  const isFromAllowance = isFromAllowanceContact || isFromAllowanceManual;

  const radioButtonValue = isFromAllowanceManual
    ? TransferFromTypeEnum.allowanceManual
    : TransferFromTypeEnum.allowanceContactBook;

  return (
    <div className="rounded-md bg-secondary-color-1-light dark:bg-level-1-color max-w-[23rem] mx-auto">
      <div className="w-full py-2 border-b border-opacity-25 border-gray-color-2">
        <div className="flex items-center justify-between w-full px-4">
          <p className="font-bold opacity-50 text-black-color dark:text-white">{t("from")}</p>

          <RadioGroup.Root value={senderType} onValueChange={onValueChange} className="flex items-center gap-x-2">
            <div className="flex items-center">
              <RadioGroup.Item className={getRadioGroupStyles(isFromOwn)} value={TransferFromTypeEnum.own} id="r-light">
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-primary-color" />
              </RadioGroup.Item>
              <p className={getRadioTextStyles(isFromOwn)}>{t("own")}</p>
            </div>

            {isSupportedICRC2() && (
              <div className="flex items-center">
                <RadioGroup.Item className={getRadioGroupStyles(isFromAllowance)} value={radioButtonValue} id="r-light">
                  <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-primary-color" />
                </RadioGroup.Item>
                <p className={getRadioTextStyles(isFromAllowance)}>{t("allowance")}</p>
              </div>
            )}

            <div className="flex items-center">
              <RadioGroup.Item
                className={getRadioGroupStyles(isFromService)}
                value={TransferFromTypeEnum.service}
                id="r-light"
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-primary-color" />
              </RadioGroup.Item>
              <p className={getRadioTextStyles(isFromService)}>{t("services")}</p>
            </div>
          </RadioGroup.Root>
        </div>
      </div>

      <div className="py-4">
        {senderType === TransferFromTypeEnum.own && <OwnSenderAccountSelector />}
        {isFromAllowance && <AllowanceSenderAccountSelector />}
        {senderType === TransferFromTypeEnum.service && <SenderServiceSelector />}
      </div>
    </div>
  );

  function isSupportedICRC2() {
    return assets.find((asset) => asset.supportedStandards.includes(SupportedStandardEnum.Values["ICRC-2"]));
  }

  function onValueChange(selected: TransferFromTypeEnum) {
    if (senderType !== selected) {
      setTransferState((prevState) => ({
        ...prevState,
        fromPrincipal: "",
        fromSubAccount: "",
        toPrincipal: selected === TransferFromTypeEnum.service ? "" : prevState.toPrincipal,
        toSubAccount: selected === TransferFromTypeEnum.service ? "" : prevState.toSubAccount,
        fromType: selected,
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
