import { useAppSelector } from "@redux/Store";
import { useEffect, useMemo, useState } from "react";
import useSend from "@pages/home/hooks/useSend";
import OwnSubAccountCard from "@/pages/home/components/ICRC/transaction/SendForm/OwnSubAccountCard";

export default function SubAccountContactBook() {
  const [balance, setBalance] = useState("");
  const { sender } = useAppSelector((state) => state.transaction);
  const { assets } = useAppSelector((state) => state.asset.list);
  const { getSenderMaxAmount } = useSend();

  const subAccountName =
    sender?.subAccount?.name ||
    `${sender?.allowanceContactSubAccount?.contactName} [${sender?.allowanceContactSubAccount?.subAccountName}]`;

  useEffect(() => {
    getAmount();
  }, []);

  const assetSymbol = useMemo(() => {
    return assets.find((asset) => asset.tokenSymbol === sender?.asset?.tokenSymbol)?.symbol;
  }, [assets]);

  return (
    <OwnSubAccountCard
      subAccountName={subAccountName}
      balance={balance}
      assetLogo={sender?.asset?.logo || ""}
      assetSymbol={sender?.asset?.tokenSymbol || ""}
      symbol={assetSymbol || ""}
    />
  );

  async function getAmount() {
    const balance = await getSenderMaxAmount();
    setBalance(balance || "0");
  }
}
