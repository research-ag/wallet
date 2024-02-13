import { CustomButton } from "../../../components/Button";
// import Button from "../ui/Button";
// import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
// import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export default function ConnectButton() {
  const { isConnecting } = useAccount();

  const { openConnectModal } = useConnectModal();

  const handleClick = () => {
    console.log("openConnectModal", openConnectModal);
    openConnectModal?.();
  };

  // const buttonIcon = isConnecting ? faCircleNotch : faEthereum;

  const buttonText = isConnecting ? "Connecting" : "Connect wallet";

  return (
    <>
      <CustomButton
        className="disabled:opacity-50 w-36"
        disabled={isConnecting}
        // icon={buttonIcon}
        onClick={handleClick}
        // spin={isConnecting}
      >
        {buttonText}
      </CustomButton>
    </>
  );
}
