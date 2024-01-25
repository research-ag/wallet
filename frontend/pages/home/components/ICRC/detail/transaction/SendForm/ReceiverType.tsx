import { TransactionReceiverOptionEnum } from "@/@types/transactions";
import { Switch } from "@components/switch";
import { useAppSelector } from "@redux/Store";
import { clearReceiverAction, setReceiverIsManualAction } from "@redux/transaction/TransactionActions";
import { useTranslation } from "react-i18next";

export default function ReceiverType() {
  const { t } = useTranslation();
  const { receiver } = useAppSelector((state) => state.transaction);
  function onCheckedChange(checked: boolean) {
    setReceiverIsManualAction(checked);
    clearReceiverAction();
  }
  return (
    <div className="flex items-center justify-between w-full px-4">
      <p className="font-bold opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">To</p>
      {receiver.receiverOption !== TransactionReceiverOptionEnum.Values.own && (
        <div className="flex items-center justify-center">
          <p className="mr-2 text-md">{t("manual")}</p>
          <Switch checked={receiver.isManual} onChange={onCheckedChange} />
        </div>
      )}
    </div>
  );
}
