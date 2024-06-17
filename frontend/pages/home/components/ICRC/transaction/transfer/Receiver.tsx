import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
import { BasicSwitch } from "@components/switch";
import { TransferFromTypeEnum, TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ReceiverThird from "@/pages/home/components/ICRC/transaction/transfer/ReceiverThird";
import ReceiverManual from "@/pages/home/components/ICRC/transaction/transfer/ReceiverManual";
import ReceiverOwner from "@/pages/home/components/ICRC/transaction/transfer/ReceiverOwner";

export default function Receiver() {
  const { t } = useTranslation();
  const { setTransferState, transferState } = useTransfer();
  const [isManual, setIsManual] = useState<boolean>(false);

  const isService = transferState.fromType === TransferFromTypeEnum.service;
  const isTransferToOwn = transferState.toType === TransferToTypeEnum.own;

  //
  return (
    <div className="w-full mt-4 rounded-md bg-secondary-color-1-light dark:bg-level-1-color max-w-[23rem] mx-auto">
      <div className="w-full py-2 border-b border-opacity-25 border-gray-color-2">
        <div className="flex items-center justify-between w-full px-4 py-1">
          <p className="font-bold opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">To</p>
          {!isTransferToOwn && !isService && (
            <div className="flex items-center justify-center">
              <p className="mr-2 text-black-color text-md dark:text-white">{t("manual")}</p>
              <BasicSwitch checked={isManual} onChange={onCheckedChange} />
            </div>
          )}
        </div>
      </div>

      <div>
        <div>
          {isManual && <ReceiverManual />}
          {!isManual && (
            <>
              {!isTransferToOwn && !isService && <ReceiverThird />}
              {(isTransferToOwn || isService) && <ReceiverOwner />}
              {!isService && (
                <div className="max-w-[21rem] text-start">
                  {isTransferToOwn ? (
                    <button onClick={onChangeToThird}>
                      <p className="flex items-center justify-center text-md text-primary-color text-start">
                        <DownAmountIcon className="relative mt-4 rotate-90 bottom-2 right-2" />
                        {t("back")}
                      </p>
                    </button>
                  ) : (
                    <button onClick={onChangeToOwn}>
                      <p className="flex text-md text-primary-color text-start">
                        {t("transfer.between.accounts")}
                        <DownAmountIcon className="relative mt-2 -rotate-90 bottom-2 left-2" />
                      </p>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  function onCheckedChange(checked: boolean) {
    setIsManual(checked);
    setTransferState((prev) => ({
      ...prev,
      toPrincipal: "",
      toSubAccount: "",
      // INFO: will keep in manual after switch false, on select another receiver type, will set the right type
      toType: checked ? TransferToTypeEnum.manual : prev.toType,
    }));
  }

  function onChangeToThird() {
    setTransferState((prev) => ({
      ...prev,
      toPrincipal: "",
      toSubAccount: "",
      toType: TransferToTypeEnum.thirdPartyICRC,
    }));
  }

  function onChangeToOwn() {
    setTransferState((prev) => ({
      ...prev,
      toPrincipal: "",
      toSubAccount: "",
      toType: TransferToTypeEnum.own,
    }));
  }
}
