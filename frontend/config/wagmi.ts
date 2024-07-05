import "@rainbow-me/rainbowkit/styles.css";
import { arbitrum, base, mainnet, optimism, polygon, zora } from "wagmi/chains";
import { configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

export const supportedChains = [mainnet, polygon, optimism, arbitrum, base, zora];

export const { chains, publicClient } = configureChains(supportedChains, [publicProvider()]);

const info = {
  appName: import.meta.env.VITE_APP_NAME,
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains,
};

const { connectors } = getDefaultWallets(info);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export function isChainIdSupported(id?: number) {
  return supportedChains.find((chain) => chain.id === id) !== undefined;
}
