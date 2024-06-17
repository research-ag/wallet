import SenderType from "@/pages/home/components/ICRC/transaction/SendForm/SenderType";
import SenderSubAccount from "@/pages/home/components/ICRC/transaction/SendForm/SenderSubAccount";
import SenderAllowanceContact from "@/pages/home/components/ICRC/transaction/SendForm/SenderAllowanceContact";
import { useAppSelector } from "@redux/Store";
import { TransactionSenderOptionEnum } from "@/@types/transactions";
import SenderService from "@/pages/home/components/ICRC/transaction/SendForm/SenderService";

export default function SenderItem() {
  const { sender } = useAppSelector((state) => state.transaction);

  return (
    <div className="w-full mt-4 rounded-md bg-secondary-color-1-light dark:bg-level-1-color">
      <div className="w-full py-2 border-b border-opacity-25 border-gray-color-2">
        <SenderType senderOption={sender.senderOption} />
      </div>
      <div className="py-4">
        {sender.senderOption === TransactionSenderOptionEnum.Values.own && <SenderSubAccount />}
        {sender.senderOption === TransactionSenderOptionEnum.Values.allowance && <SenderAllowanceContact />}
        {sender.senderOption === TransactionSenderOptionEnum.Values.service && <SenderService />}
      </div>
    </div>
  );
}
