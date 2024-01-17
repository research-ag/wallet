import SenderTypeSelect from "./SenderTypeSelect";
import SenderSubAccount from "./SenderSubAccount";
import { AllowanceContactSubAccount, SenderInitialState } from "@pages/home/hooks/useSender";
import { SubAccount } from "@redux/models/AccountModels";
import SenderAllowanceContact from "./SenderAllowanceContact";

interface SenderItemProps {
  sender: SenderInitialState;
  setSenderSubAccount: (subAccount: SubAccount) => void;
  setSenderAllowanceContact: (allowanceContact: AllowanceContactSubAccount) => void;
}

export default function SenderItem(props: SenderItemProps) {
  const { sender, setSenderSubAccount, setSenderAllowanceContact } = props;
  return (
    <div className="w-full rounded-md bg-ToBoxColor">
      <div className="w-full py-2 border-b border-BorderColor">
        <SenderTypeSelect />
      </div>
      <div className="p-2">
        <SenderSubAccount sender={sender} setSenderSubAccount={setSenderSubAccount} />
      </div>
      <div className="p-2">
        <SenderAllowanceContact setSenderAllowanceContact={setSenderAllowanceContact} sender={sender} />
      </div>
    </div>
  );
}
