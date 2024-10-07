import { queryClient, wagmiConfig } from "@/config/wagmi";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { SiweIdentityProvider, useSiweIdentity } from "ic-use-siwe-identity";
import { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { canisterId, idlFactory } from "@/candid/ic_siwe_provider";
import { QueryClientProvider } from "@tanstack/react-query";

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
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={darkTheme({
            accentColor: "#7b3fe4",
            accentColorForeground: "white",
            borderRadius: "large",
            overlayBlur: "none",
          })}
        >
          <SiweIdentityProvider
            canisterId={canisterId || import.meta.env.VITE_CANISTER_ID_IC_SIWE_PROVIDER || ""}
            idlFactory={idlFactory}
          >
            <EthereumSignInProvider>{children}</EthereumSignInProvider>
          </SiweIdentityProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
