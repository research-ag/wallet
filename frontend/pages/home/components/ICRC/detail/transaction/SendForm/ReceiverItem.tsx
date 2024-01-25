import ReceiverType from "./ReceiverType";
import ReceiverOwner from "./ReceiverOwner";
import ReceiverThird from "./ReceiverThird";
import { useAppSelector } from "@redux/Store";
import { clearReceiverAction, setReceiverOptionAction } from "@redux/transaction/TransactionActions";
import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
import { useTranslation } from "react-i18next";
import { TransactionReceiverOptionEnum } from "@/@types/transactions";

export default function ReceiverItem() {
  const { receiver } = useAppSelector((state) => state.transaction);
  const { t } = useTranslation();

  return (
    <div className="w-full mt-4 rounded-md bg-ToBoxColor">
      <div className="w-full py-2 border-b border-BorderColor">
        <ReceiverType />
      </div>

      <div className="p-4">
        {receiver.receiverOption === TransactionReceiverOptionEnum.Values.third && <ReceiverThird />}
        {receiver.receiverOption === TransactionReceiverOptionEnum.Values.own && <ReceiverOwner />}
      </div>

      <div className="flex p-4">
        {receiver.receiverOption === TransactionReceiverOptionEnum.Values.third && (
          <button onClick={onReceiverOptionChange}>
            <p className="text-md text-RadioCheckColor text-start">{t("transfer.between.accounts")}</p>
          </button>
        )}
        {receiver.receiverOption === TransactionReceiverOptionEnum.Values.own && (
          <button onClick={onReceiverOptionChange}>
            <p className="flex items-center justify-center text-md text-RadioCheckColor text-start">
              <DownAmountIcon className="relative mt-4 rotate-90 bottom-2 right-2" />
              {t("back")}
            </p>
          </button>
        )}
      </div>
    </div>
  );

  function onReceiverOptionChange() {
    if (receiver.receiverOption === TransactionReceiverOptionEnum.Values.third)
      setReceiverOptionAction(TransactionReceiverOptionEnum.Values.own);
    if (receiver.receiverOption === TransactionReceiverOptionEnum.Values.own)
      setReceiverOptionAction(TransactionReceiverOptionEnum.Values.third);
    clearReceiverAction();
  }
}
