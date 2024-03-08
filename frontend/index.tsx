import React from "react";
import ReactDOM from "react-dom/client";
import "@/i18n";

import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

import App from "./App";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

import { chains, wagmiConfig } from "./wagmi.config";
import { WagmiConfig } from "wagmi";

import { canisterId, idlFactory } from "@/candid/ic_siwe_provider";

import reportWebVitals from "./reportWebVitals";
import { SiweIdentityProvider } from "@/siwe";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
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
          <App />
        </SiweIdentityProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
