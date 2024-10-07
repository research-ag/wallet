import GoBackIcon from "@/assets/svg/files/go-back-icon.svg";
import { useAccount } from "wagmi";
import ConnectButton from "@/pages/login/components/ConnectButton";
import AddressPill from "@/pages/login/components/AddressPill";
import LoginButton from "@/pages/login/components/LoginButton";
import { useSiweIdentity } from "ic-use-siwe-identity";
import { useEffect } from "react";
import { handleSiweAuthenticated } from "@redux/CheckAuth";
import { useAccountModal } from "@rainbow-me/rainbowkit";

export default function EthereumSignIn() {
  const { isConnected, address } = useAccount();
  const { prepareLogin, isPrepareLoginIdle, identity } = useSiweIdentity();
  const { openAccountModal } = useAccountModal();

  useEffect(() => {
    if (!isPrepareLoginIdle || !isConnected || !address) return;
    prepareLogin();
  }, [isConnected, address, prepareLogin, isPrepareLoginIdle]);

  useEffect(() => {
    if (!identity) return;
    handleSiweAuthenticated(identity);
  }, [identity]);

  return (
    <div className="flex flex-col items-start gap-5 p-5">
      <div className="flex items-center justify-start w-full gap-5">
        <div className="flex items-center justify-center w-8 h-8 text-lg font-bold rounded-full bg-SecondaryColorLight text-SecondaryColor">
          1
        </div>
        <div className="flex flex-row items-center justify-start gap-3">
          {!isConnected && <ConnectButton />}
          {isConnected && <AddressPill address={address} className="justify-center w-36" />}
          {isConnected && (
            <button
              onClick={() => {
                openAccountModal?.();
              }}
            >
              <img src={GoBackIcon} alt="" className="w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-start w-full gap-5">
        <div className="flex items-center justify-center w-8 h-8 text-lg font-bold rounded-full bg-SecondaryColorLight text-SecondaryColor">
          2
        </div>
        <div>
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
