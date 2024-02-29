import { useConnectModal } from "@rainbow-me/rainbowkit";
import { CustomButton } from "@components/Button";
import { useAccount } from "wagmi";

export default function ConnectButton() {
  const { isConnecting } = useAccount();
  const { openConnectModal } = useConnectModal();

  const buttonText = isConnecting ? "Connecting" : "Connect wallet";

  return (
    <CustomButton
      className="disabled:opacity-50 w-36"
      disabled={isConnecting}
      // icon={buttonIcon}
      onClick={handleClick}
      // spin={isConnecting}
    >
      {buttonText}
    </CustomButton>
  );

  function handleClick() {
    openConnectModal?.();
  }
}
