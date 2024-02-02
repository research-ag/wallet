import "./index.css";

import * as ReactDOM from "react-dom/client";

import App from "./App";
import React from "react";
import reportWebVitals from "./reportWebVitals";

// import { Suspense } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App";

// const container = document.getElementById("root");
// const root = createRoot(container!); // createRoot(container!) if you use TypeScript
// root.render(
//   <Suspense fallback={null}>
//         <WagmiConfig config={wagmiConfig}>
//       <RainbowKitProvider>
//     <App />
//   </WagmiConfig>
//   </RainbowKitProvider>

//   </Suspense>,
// );

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
