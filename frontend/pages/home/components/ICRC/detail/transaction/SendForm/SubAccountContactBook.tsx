import { useAppSelector } from "@redux/Store";
import { useEffect, useState } from "react";
import useSend from "@pages/home/hooks/useSend";
import OwnSubAccountCard from "./OwnSubAccountCard";

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
    <OwnSubAccountCard
      subAccountName={subAccountName}
      balance={balance}
      assetLogo={sender?.asset?.logo || ""}
      assetSymbol={sender?.asset?.tokenSymbol || ""}
    />
  );

  async function getAmount() {
    const balance = await getSenderBalance();
    setBalance(balance || "0");
  }
}
