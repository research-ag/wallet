import { chains, wagmiConfig } from "@/config/wagmi";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { SiweIdentityProvider, useSiweIdentity } from "ic-use-siwe-identity";
import { useEffect } from "react";
import { WagmiConfig } from "wagmi";
import { canisterId, idlFactory } from "@/candid/ic_siwe_provider";

function EthereumSignInProvider({ children }: { children: React.ReactNode }) {
  const { clear, identity } = useSiweIdentity();

  useEffect(() => {
    if (identity) {
      clear();
    }
  }, []);

  return <>{children}</>;
}

export default function EthereumSignInProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={darkTheme({
          accentColor: "#7b3fe4",
          accentColorForeground: "white",
          borderRadius: "large",
          overlayBlur: "none",
        })}
      >
        <SiweIdentityProvider canisterId={canisterId} idlFactory={idlFactory}>
          <EthereumSignInProvider>{children}</EthereumSignInProvider>
        </SiweIdentityProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
