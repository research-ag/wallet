import { useAccount, useNetwork } from "wagmi";
import ConnectButton from "./ConnectButton";
import AddressPill from "./AddressPill";
import { isChainIdSupported } from "@/wagmi.config";
import { CustomButton } from "@components/Button";
import { useTranslation } from "react-i18next";
import LoginButton from "./LoginButton";
import { useSiweIdentity } from "@/siwe";
import { useEffect } from "react";
import { handleLoginApp } from "@redux/CheckAuth";

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
    handleLoginApp(identity);
  }, [identity]);

  return (
    <div className="flex flex-col items-start gap-5 p-5">
      <div className="flex items-center justify-start w-full gap-5">
        <div className="flex items-center justify-center w-8 h-8 text-lg font-bold rounded-full bg-SecondaryColorLight text-SecondaryColor">
          1
        </div>
        <div>
          {!isConnected && <ConnectButton />}
          {isConnected && isChainIdSupported(chain?.id) && (
            <AddressPill address={address} className="justify-center w-36" />
          )}
          {isConnected && !isChainIdSupported(chain?.id) && (
            <CustomButton disabled className="text-sm opacity-50 bg-GrayColor w-36">
              {t("unsupported.network")}
            </CustomButton>
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
