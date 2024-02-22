import { SupportedStandardEnum } from "@/@types/icrc";
import { TransactionSenderOption, TransactionSenderOptionEnum } from "@/@types/transactions";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useAppSelector } from "@redux/Store";
import { clearSenderAction, setSenderOptionAction } from "@redux/transaction/TransactionActions";
import clsx from "clsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface SenderTypeProps {
  senderOption: TransactionSenderOption;
}

export default function SenderType(props: SenderTypeProps) {
  const { t } = useTranslation();
  const { senderOption } = props;
  const { sender } = useAppSelector((state) => state.transaction);

  const isAssetICRC2Supported = useMemo(() => {
    return sender?.asset?.supportedStandards?.includes(SupportedStandardEnum.Values["ICRC-2"]);
  }, [sender]);

  return (
    <div className="flex items-center justify-between w-full px-4">
      <p className="font-bold opacity-50 text-black-color dark:text-white">{t("from")}</p>
      <RadioGroup.Root value={senderOption} onValueChange={onValueChange} className="flex">
        <div className="flex flex-row items-center p-1">
          <RadioGroup.Item
            className={getRadioGroupStyles(senderOption === TransactionSenderOptionEnum.Values.own)}
            value={TransactionSenderOptionEnum.Values.own}
            id="r-light"
          >
            <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-primary-color" />
          </RadioGroup.Item>
          <p className={getRadioTextStyles(senderOption === TransactionSenderOptionEnum.Values.own)}>{t("own")}</p>
        </div>
        {isAssetICRC2Supported && (
          <div className="flex flex-row items-center p-1">
            <RadioGroup.Item
              className={getRadioGroupStyles(senderOption === TransactionSenderOptionEnum.Values.allowance)}
              value={TransactionSenderOptionEnum.Values.allowance}
              id="r-light"
            >
              <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-primary-color" />
            </RadioGroup.Item>
            <p className={getRadioTextStyles(senderOption === TransactionSenderOptionEnum.Values.allowance)}>
              {t("allowance")}
            </p>
          </div>
        )}
      </RadioGroup.Root>
    </div>
  );

  function onValueChange(selected: TransactionSenderOption) {
    if (senderOption !== selected) {
      setSenderOptionAction(selected);

      if (selected === TransactionSenderOptionEnum.Values.allowance) {
        clearSenderAction();
        return;
      }
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
    "ml-4 text-lg opacity-50  ml-4 opacity-50",
    isActive ? "text-primary-color font-bold" : "text-black-color dark:text-white",
  );
}
