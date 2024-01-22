import SenderAsset from "./SenderAsset";
import SenderItem from "./SenderItem";
import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
import ReceiverItem from "./ReceiverItem";
import { ScannerOption } from "@/@types/transactions";
import { useAppSelector } from "@redux/Store";
import SenderQRScanner from "./SenderQRScanner";
import ReceiverQRScanner from "./ReceiverQRScanner";

export default function SendForm() {
  const { sender, receiver, scannerActiveOption } = useAppSelector((state) => state.transaction);
  if (scannerActiveOption === ScannerOption.sender) return <SenderQRScanner />;
  if (scannerActiveOption === ScannerOption.receiver) return <ReceiverQRScanner />;

  console.log({
    sender,
    receiver,
  });

  return (
    <div className="w-full">
      <SenderAsset />
      <SenderItem />
      <DownAmountIcon className="w-full mt-4" />
      <ReceiverItem />
    </div>
  );
}

// TODO: wrapper that render three component (sender qr scanner, receiver qr scanner and the form)
