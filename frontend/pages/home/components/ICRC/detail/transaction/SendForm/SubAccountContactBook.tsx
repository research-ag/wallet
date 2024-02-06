import { AvatarEmpty } from "@components/avatar";
import { getIconSrc } from "@/utils/icons";
import { useAppSelector } from "@redux/Store";
import { useEffect, useState } from "react";
import useSend from "@pages/home/hooks/useSend";

export default function SubAccountContactBook() {
  const [balance, setBalance] = useState("");
  const { sender } = useAppSelector((state) => state.transaction);
  const { getSenderBalance } = useSend();

  const subAccountName =
    sender?.subAccount?.name ||
    `${sender?.allowanceContactSubAccount?.contactName} [${sender?.allowanceContactSubAccount?.subAccountName}]`;

  useEffect(() => {
    getAmount();
  }, []);

  return (
    <div className="flex justify-start w-full p-2 border rounded-md border-gray-color-2 dark:bg-secondary-color-2 bg-secondary-color-1-light ">
      <div className="flex items-center justify-center">
        <AvatarEmpty title={subAccountName} className="mr-2" size="large" />
      </div>
      <div className="text-start text-black-color dark:text-secondary-color-1-light">
        <p>{subAccountName}</p>
        <div className="flex">
          <img src={getIconSrc(sender?.asset?.logo, sender?.asset?.tokenSymbol)} className="w-4 h-4 mr-2" alt="" />
          <p className="opacity-50 text-md">
            {balance} {sender?.asset?.tokenSymbol}
          </p>
        </div>
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
