import TransferProvider, { useTransfer } from "@pages/home/contexts/TransferProvider";
import { useAppSelector } from "@redux/Store";
import { useEffect } from "react";
import logger from "@/common/utils/logger";
import TransferViewProvider from "../contexts/TransferViewProvider";

function TransferIntializer({ children }: { children: JSX.Element }) {
  const { userPrincipal } = useAppSelector((state) => state.auth);
  const { selectedAccount, selectedAsset } = useAppSelector((state) => state.asset.helper);
  const { setTransferState } = useTransfer();

  useEffect(() => {
    if (!selectedAccount || !selectedAsset) {
      logger.debug("TransferIntializer: selectedAccount or selectedAsset is null");
      return;
    }

    setTransferState((prev) => ({
      ...prev,
      tokenSymbol: selectedAsset.tokenSymbol,
      fromSubAccount: selectedAccount.sub_account_id,
      fromPrincipal: userPrincipal.toString(),
    }));
  }, []);

  return children;
}

export default function TransferWrapper({ children }: { children: JSX.Element }) {
  return (
    <TransferProvider>
      <TransferIntializer>
        <TransferViewProvider>{children}</TransferViewProvider>
      </TransferIntializer>
    </TransferProvider>
  );
}
