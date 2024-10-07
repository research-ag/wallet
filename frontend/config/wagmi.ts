import "@rainbow-me/rainbowkit/styles.css";
import { http, createConfig } from "wagmi";
import { mainnet, polygon, sepolia } from "wagmi/chains";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { QueryClient } from "@tanstack/react-query";

const info = {
  appName: process.env.REACT_APP_APP_NAME || "HPL",
  projectId: process.env.REACT_APP_PROJECT_ID || "e8e4bbcc79064b8170622441993742c1",
};

const { connectors } = getDefaultWallets(info);

export const chains = [mainnet, polygon, sepolia];
export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, sepolia],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [sepolia.id]: http(),
  },
  connectors,
});

export const queryClient = new QueryClient();
