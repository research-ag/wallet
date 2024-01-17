import SenderTypeSelect from "./SenderTypeSelect";
import SenderSubAccount from "./SenderSubAccount";
import { SenderInitialState } from "@pages/home/hooks/useSender";
import { SubAccount } from "@redux/models/AccountModels";

interface SenderItemProps {
  sender: SenderInitialState;
  setSenderSubAccount: (subAccount: SubAccount) => void;
}

export default function SenderItem(props: SenderItemProps) {
  const { sender, setSenderSubAccount } = props;
  return (
    <div className="w-full rounded-md bg-ToBoxColor">
      <div className="w-full py-2 border-b border-BorderColor">
        <SenderTypeSelect />
      </div>
      <div className="p-2">
        <SenderSubAccount sender={sender} setSenderSubAccount={setSenderSubAccount} />
      </div>
    </div>
  );
}
