import useSender from "@pages/home/hooks/useSender";
import SendAssetItem from "./SendAssetItem";
import SenderItem from "./SenderItem";

export default function SendForm() {
  const { sender, setSenderAsset, setSenderSubAccount, setSenderAllowanceContact, setSenderNewAllowanceContact } =
    useSender();
  return (
    <div className="w-full">
      <SendAssetItem asset={sender.asset} setSenderAsset={setSenderAsset} />
      <SenderItem
        sender={sender}
        setSenderSubAccount={setSenderSubAccount}
        setSenderAllowanceContact={setSenderAllowanceContact}
        setSenderNewAllowanceContact={setSenderNewAllowanceContact}
      />
      {/* <SendToItem /> */}
    </div>
  );
}
