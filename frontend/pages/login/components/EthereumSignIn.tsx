import GoBackIcon from "@/assets/svg/files/go-back-icon.svg";
import { useAccount, useNetwork } from "wagmi";
import ConnectButton from "@/pages/login/components/ConnectButton";
import AddressPill from "@/pages/login/components/AddressPill";
import { isChainIdSupported } from "@/config/wagmi";
import { CustomButton } from "@components/button";
import { useTranslation } from "react-i18next";
import LoginButton from "@/pages/login/components/LoginButton";
import { useSiweIdentity } from "ic-use-siwe-identity";
import { useEffect } from "react";
import { cleanEthLogin, handleSiweAuthenticated } from "@redux/CheckAuth";

export default function EthereumSignIn() {
  const { t } = useTranslation();
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { prepareLogin, isPrepareLoginIdle, identity } = useSiweIdentity();

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
          {isConnected && isChainIdSupported(chain?.id) && (
            <AddressPill address={address} className="justify-center w-36" />
          )}
          {isConnected && !isChainIdSupported(chain?.id) && (
            <CustomButton disabled className="text-sm opacity-50 bg-GrayColor w-36">
              {t("unsupported.network")}
            </CustomButton>
          )}
          {isConnected && (
            <button
              onClick={() => {
                cleanEthLogin();
                location.reload();
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
