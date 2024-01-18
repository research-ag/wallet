import SenderAsset from "./SenderAsset";
import SenderItem from "./SenderItem";
import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
import ReceiverItem from "./ReceiverItem";
import { ScannerOption } from "@/@types/transactions";
import { useAppSelector } from "@redux/Store";

export default function SendForm() {
  const { scannerActiveOption } = useAppSelector((state) => state.transaction);
  if (scannerActiveOption === ScannerOption.sender) return <p>QR Scanner Sender</p>;
  if (scannerActiveOption === ScannerOption.receiver) return <p>QR Scanner Receiver</p>;

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
