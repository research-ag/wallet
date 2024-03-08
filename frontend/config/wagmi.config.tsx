import "@rainbow-me/rainbowkit/styles.css";
import { arbitrum, base, mainnet, optimism, polygon, zora } from "wagmi/chains";
import { WagmiConfig, configureChains, createConfig } from "wagmi";

import { RainbowKitProvider, darkTheme, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";
import { canisterId, idlFactory } from "@/candid/ic_siwe_provider";
import { SiweIdentityProvider } from "@/siwe";

export const supportedChains = [mainnet, polygon, optimism, arbitrum, base, zora];

export const { chains, publicClient } = configureChains(supportedChains, [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: import.meta.env.VITE_APP_NAME,
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export function isChainIdSupported(id?: number) {
  return supportedChains.find((chain) => chain.id === id) !== undefined;
}

export function EthereumSignInProvider({ children }: { children: React.ReactNode }) {
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
          {children}
        </SiweIdentityProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
