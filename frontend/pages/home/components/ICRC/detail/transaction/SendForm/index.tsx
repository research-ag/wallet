import useSendFrom from "@pages/home/hooks/useSendFrom";
import SendAssetItem from "./SendAssetItem";
import SendFromItem from "./SendFromItem";
import SendToItem from "./SendToItem";

export default function SendForm() {
  const { sender, setSender } = useSendFrom();
  return (
    <div className="w-full">
      <SendAssetItem asset={sender.asset} setSender={setSender} />
      <SendFromItem />
      <SendToItem />
    </div>
  );
}
