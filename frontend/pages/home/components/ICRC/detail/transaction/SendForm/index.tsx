import SenderAsset from "./SenderAsset";
import SenderItem from "./SenderItem";
import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
import ReceiverItem from "./ReceiverItem";

export default function SendForm() {
  return (
    <div className="w-full">
      <SenderAsset />
      <SenderItem />
      <DownAmountIcon className="w-full mt-4" />
      <ReceiverItem />
    </div>
  );
}
