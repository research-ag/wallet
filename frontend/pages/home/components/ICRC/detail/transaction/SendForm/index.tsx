import useSender from "@pages/home/hooks/useSender";
import SenderAsset from "./SenderAsset";
import SenderItem from "./SenderItem";
import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
import ReceiverItem from "./ReceiverItem";

interface SendFormProps {
  setDrawerOpen(value: boolean): void;
  drawerOpen: boolean;
}

export default function SendForm(props: SendFormProps) {
  const { setDrawerOpen, drawerOpen } = props;
  const { sender, setSenderAsset, setSenderSubAccount, setSenderAllowanceContact, setSenderNewAllowanceContact } =
    useSender();

  return (
    <div className="w-full">
      <SenderAsset asset={sender.asset} setSenderAsset={setSenderAsset} />
      <SenderItem
        sender={sender}
        setSenderSubAccount={setSenderSubAccount}
        setSenderAllowanceContact={setSenderAllowanceContact}
        setSenderNewAllowanceContact={setSenderNewAllowanceContact}
      />
      <DownAmountIcon className="w-full mt-4" />
      <ReceiverItem setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} sender={sender} />
    </div>
  );
}
