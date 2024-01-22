import { Switch } from "@components/switch";
import { Dispatch, SetStateAction } from "react";

interface ReceiverTypeProps {
  isManual: boolean;
  setIsManual: Dispatch<SetStateAction<boolean>>;
}

export default function ReceiverType(props: ReceiverTypeProps) {
  const { isManual, setIsManual } = props;
  function onCheckedChange(checked: boolean) {
    setIsManual(checked);
  }
  return (
    <div className="flex items-center justify-between w-full px-4">
      <p className="font-bold opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">To</p>
      <div className="flex items-center justify-center">
        <p className="mr-2 text-md">Manual</p>
        <Switch checked={isManual} onChange={onCheckedChange} />
      </div>
    </div>
  );
}
