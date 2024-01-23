import BitcoinIcon from "@assets/svg/files/bitcoin-icon.svg";
import { useAppSelector } from "@redux/Store";

export default function NewSender() {
  const { sender } = useAppSelector((state) => state.transaction);
  //   TODO: get the amount of the allowance

  return (
    <div className="px-4 py-2 border rounded-md border-gray-color-2 bg-secondary-color-2 text-start">
      <p>
        {sender?.asset?.address} {`[0x3]`}
      </p>
      <div className="flex items-center justify-start">
        <img src={BitcoinIcon} className="mr-2" alt="" />
        <p className="opacity-50 text-md">
          {`0,900`} {sender?.asset?.tokenSymbol}
        </p>
      </div>
    </div>
  );
}
