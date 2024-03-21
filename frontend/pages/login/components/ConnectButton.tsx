import { useConnectModal } from "@rainbow-me/rainbowkit";
import { CustomButton } from "@components/button";
import { useAccount } from "wagmi";

export default function ConnectButton() {
  const { isConnecting } = useAccount();
  const { openConnectModal } = useConnectModal();

  const buttonText = isConnecting ? "Connecting" : "Connect wallet";

  return (
    <CustomButton className="disabled:opacity-50 w-36" disabled={isConnecting} onClick={handleClick}>
      {buttonText}
    </CustomButton>
  );

  function handleClick() {
    openConnectModal?.();
  }
}
