import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
import { BasicSwitch } from "@components/switch";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ReceiverThird from "./ReceiverThird";
import ReceiverManual from "./ReceiverManual";
import ReceiverOwner from "./ReceiverOwner";

enum ReceiverType {
  third = "third",
  own = "own",
}

export default function Receiver() {
  const { t } = useTranslation();
  const { setTransferState } = useTransfer();
  const [receiverType, setReceiverType] = useState<ReceiverType>(ReceiverType.third);
  const [isManual, setIsManual] = useState<boolean>(false);

  //
  return (
    <div className="w-full mt-4 rounded-md bg-secondary-color-1-light dark:bg-level-1-color max-w-[23rem] mx-auto">
      <div className="w-full py-2 border-b border-opacity-25 border-gray-color-2">
        <div className="flex items-center justify-between w-full px-4 py-1">
          <p className="font-bold opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">To</p>
          {receiverType !== ReceiverType.own && (
            <div className="flex items-center justify-center">
              <p className="mr-2 text-black-color text-md dark:text-white">{t("manual")}</p>
              <BasicSwitch checked={isManual} onChange={onCheckedChange} />
            </div>
          )}
        </div>
      </div>

      <div>
        <div>
          {/* inputs (principal and subaccount), scanner, icrc idenfier, contact book, services (not if sender is allowance) */}

          {isManual && <ReceiverManual />}

          {!isManual && (
            <>
              {receiverType === ReceiverType.third && <ReceiverThird />}
              {receiverType === ReceiverType.own && <ReceiverOwner />}
              <div className="max-w-[21rem] text-start">
                {receiverType === ReceiverType.own ? (
                  <button onClick={() => setReceiverType(ReceiverType.third)}>
                    <p className="flex items-center justify-center text-md text-primary-color text-start">
                      <DownAmountIcon className="relative mt-4 rotate-90 bottom-2 right-2" />
                      {t("back")}
                    </p>
                  </button>
                ) : (
                  <button onClick={() => setReceiverType(ReceiverType.own)}>
                    <p className="flex text-md text-primary-color text-start">
                      {t("transfer.between.accounts")}
                      <DownAmountIcon className="relative mt-2 -rotate-90 bottom-2 left-2" />
                    </p>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  function onCheckedChange(checked: boolean) {
    setIsManual(checked);
    setTransferState((prev) => ({ ...prev, toPrincipal: "", toSubAccount: "" }));
  }
}
