import { ReceiverOption } from "@/@types/transactions";
import { Switch } from "@components/switch";
import { useAppSelector } from "@redux/Store";
import { clearReceiverAction, setReceiverIsManualAction } from "@redux/transaction/TransactionActions";

export default function ReceiverType() {
  const { receiver } = useAppSelector((state) => state.transaction);
  function onCheckedChange(checked: boolean) {
    setReceiverIsManualAction(checked);
    console.log("checked chagned");
    clearReceiverAction();
  }
  return (
    <div className="flex items-center justify-between w-full px-4">
      <p className="font-bold opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">To</p>
      {receiver.receiverOption !== ReceiverOption.own && (
        <div className="flex items-center justify-center">
          <p className="mr-2 text-md">Manual</p>
          <Switch checked={receiver.isManual} onChange={onCheckedChange} />
        </div>
      )}
    </div>
  );
}
