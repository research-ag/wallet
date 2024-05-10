import { getIconSrc } from "@/common/utils/icons";
import { middleTruncation } from "@/common/utils/strings";
import useSend from "@pages/home/hooks/useSend";
import { useAppSelector } from "@redux/Store";
import { useEffect, useState } from "react";

export default function NewSender() {
  const { sender } = useAppSelector((state) => state.transaction);
  const { getSenderMaxAmount, senderSubAccount, senderPrincipal } = useSend();
  const [balance, setBalance] = useState("");

  useEffect(() => {
    getAmount();
  }, []);

  return (
    <div className="px-4 py-2 border rounded-md border-gray-color-2 dark:bg-secondary-color-2 bg-secondary-color-1-light text-start">
      <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {middleTruncation(senderPrincipal, 15, 15)} {senderSubAccount}
      </p>
      <div className="flex items-center justify-start">
        <img src={getIconSrc(sender?.asset?.logo, sender?.asset?.tokenSymbol)} className="w-4 h-4 mr-2" alt="" />
        <p className="opacity-50 text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
          {balance} {sender?.asset?.tokenSymbol}
        </p>
      </div>
    </div>
  );

  async function getAmount() {
    try {
      const balance = await getSenderMaxAmount();
      setBalance(balance || "");
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
