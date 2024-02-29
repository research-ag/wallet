import { useAccount, useNetwork } from "wagmi";
import ConnectButton from "./ConnectButton";

export default function EthereumSignIn() {
  const { isConnected, address } = useAccount();
  console.log({ isConnected, address });

  return (
    <div className="flex flex-col items-start gap-5 p-5">
      <div className="flex items-center justify-start w-full gap-5">
        <div className="flex items-center justify-center w-8 h-8 text-lg font-bold rounded-full bg-SecondaryColorLight text-SecondaryColor">
          1
        </div>
        <div>
          {!isConnected && <ConnectButton />}
          {/* {isConnected && isChainIdSupported(chain?.id) && (
            <AddressPill address={address} className="justify-center w-36" />
          )} */}
          {/* {isConnected && !isChainIdSupported(chain?.id) && (
            <CustomButton disabled className="text-sm opacity-50 bg-GrayColor w-36">
              Unsupported Network
            </CustomButton>
          )} */}
        </div>
      </div>
      <div className="flex items-center justify-start w-full gap-5">
        <div className="flex items-center justify-center w-8 h-8 text-lg font-bold rounded-full bg-SecondaryColorLight text-SecondaryColor">
          2
        </div>
        <div>{/* <LoginButton /> */}</div>
      </div>
    </div>
  );
}
