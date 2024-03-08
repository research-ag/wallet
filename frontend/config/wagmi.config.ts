import { arbitrum, base, mainnet, optimism, polygon, zora } from "wagmi/chains";
import { configureChains, createConfig } from "wagmi";

import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";

export const supportedChains = [mainnet, polygon, optimism, arbitrum, base, zora];

export const { chains, publicClient } = configureChains(supportedChains, [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "icrc-1-wallet",
  projectId: "e8e4bbcc79064b8170622441993742c1",
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export function isChainIdSupported(id?: number) {
  return supportedChains.find((c) => c.id === id) !== undefined;
}
