import { useAccount, useNetwork } from "wagmi";
import ConnectButton from "./ConnectButton";
import AddressPill from "./AddressPill";
import { isChainIdSupported } from "@/wagmi.config";
import { CustomButton } from "@components/Button";
import { useTranslation } from "react-i18next";
import LoginButton from "./LoginButton";

export default function EthereumSignIn() {
  const { t } = useTranslation();
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();

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
