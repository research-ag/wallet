import { Switch } from "@components/switch";
import { useAppSelector } from "@redux/Store";
import { setReceiverIsManualAction } from "@redux/transaction/TransactionActions";

export default function ReceiverType() {
  const { receiver } = useAppSelector((state) => state.transaction);
  function onCheckedChange(checked: boolean) {
    setReceiverIsManualAction(checked);
  }
  return (
    <div className="flex items-center justify-between w-full px-4">
      <p className="font-bold opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">To</p>
      <div className="flex items-center justify-center">
        <p className="mr-2 text-md">Manual</p>
        <Switch checked={receiver.isManual} onChange={onCheckedChange} />
      </div>
    </div>
  );
}
