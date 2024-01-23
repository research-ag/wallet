import SenderType from "./SenderType";
import SenderSubAccount from "./SenderSubAccount";
import SenderAllowanceContact from "./SenderAllowanceContact";
import { useAppSelector } from "@redux/Store";
import { TransactionSenderOptionEnum } from "@/@types/transactions";

export default function SenderItem() {
  const { sender } = useAppSelector((state) => state.transaction);

  return (
    <div className="w-full mt-4 rounded-md bg-ToBoxColor">
      <div className="w-full py-2 border-b border-BorderColor">
        <SenderType senderOption={sender.senderOption} />
      </div>
      <div className="p-4">
        {sender.senderOption === TransactionSenderOptionEnum.Values.own && <SenderSubAccount />}
        {sender.senderOption === TransactionSenderOptionEnum.Values.allowance && <SenderAllowanceContact />}
      </div>
    </div>
  );
}
