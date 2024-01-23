import SenderType from "./SenderType";
import SenderSubAccount from "./SenderSubAccount";
import { SenderOption } from "@/@types/transactions";
import SenderAllowanceContact from "./SenderAllowanceContact";
import { useAppSelector } from "@redux/Store";

export default function SenderItem() {
  const {sender} = useAppSelector((state) => state.transaction);

  return (
    <div className="w-full mt-4 rounded-md bg-ToBoxColor">
      <div className="w-full py-2 border-b border-BorderColor">
        <SenderType senderOption={sender.senderOption} />
      </div>
      <div className="p-4">
        {sender.senderOption === SenderOption.own && <SenderSubAccount />}
        {sender.senderOption === SenderOption.allowance && <SenderAllowanceContact />}
      </div>
    </div>
  );
}
