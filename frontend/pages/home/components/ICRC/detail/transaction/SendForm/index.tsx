import SenderAsset from "./SenderAsset";
import SenderItem from "./SenderItem";
import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
import ReceiverItem from "./ReceiverItem";
import { useAppSelector } from "@redux/Store";
import SenderQRScanner from "./SenderQRScanner";
import ReceiverQRScanner from "./ReceiverQRScanner";
import { useEffect } from "react";
import { setSenderAssetAction, setSenderSubAccountAction } from "@redux/transaction/TransactionActions";
import { isObjectValid } from "@/utils/checkers";
import { ScannerOption } from "@/@types/transactions";

export default function SendForm() {
  const { sender, receiver, scannerActiveOption } = useAppSelector((state) => state.transaction);
  if (scannerActiveOption === ScannerOption.sender) return <SenderQRScanner />;
  if (scannerActiveOption === ScannerOption.receiver) return <ReceiverQRScanner />;

  console.log({
    sender,
    receiver,
  });

  return (
    <SenderInitializer>
      <div className="w-full">
        <SenderAsset />
        <SenderItem />
        <DownAmountIcon className="w-full mt-4" />
        <ReceiverItem />
      </div>
    </SenderInitializer>
  );
}

// TODO: wrapper that render three component (sender qr scanner, receiver qr scanner and the form)

function SenderInitializer({ children }: { children: JSX.Element }) {
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset);
  const { sender } = useAppSelector((state) => state.transaction);

  useEffect(() => {
    const allowInitializeAsset =
      selectedAsset && selectedAsset?.tokenName !== sender?.asset?.tokenName && !sender?.asset?.tokenName;

    if (allowInitializeAsset) {
      setSenderAssetAction(selectedAsset);
    }
  }, [selectedAsset]);

  useEffect(() => {
    const allowInitializeSubAccount =
      !isObjectValid(sender.newAllowanceContact) &&
      !isObjectValid(sender.allowanceContactSubAccount) &&
      !sender?.subAccount;

    if (selectedAccount) {
      if (allowInitializeSubAccount) {
        setSenderSubAccountAction(selectedAccount);
      }
    }
  }, [selectedAccount]);

  return children;
}
