import { getIconSrc } from "@/utils/icons";
import useSend from "@pages/home/hooks/useSend";
import { useAppSelector } from "@redux/Store";
import { useEffect, useState } from "react";

export default function NewSender() {
  const { sender } = useAppSelector((state) => state.transaction);
  const { getSenderBalance, senderSubAccount } = useSend();
  const [balance, setBalance] = useState("");

  useEffect(() => {
    getAmount();
  }, []);

  return (
    <div className="px-4 py-2 border rounded-md border-gray-color-2 bg-secondary-color-2 text-start">
      <p>
        {sender?.asset?.address} {senderSubAccount}
      </p>
      <div className="flex items-center justify-start">
        <img src={getIconSrc(sender?.asset?.logo, sender?.asset?.tokenSymbol)} className="w-4 h-4 mr-2" alt="" />
        <p className="opacity-50 text-md">
          {balance} {sender?.asset?.tokenSymbol}
        </p>
      </div>
    </div>
  );

  async function getAmount() {
    try {
      const balance = await getSenderBalance();
      setBalance(balance || "");
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
