import React from "react";
import { createRoot } from "react-dom/client";
import "@/i18n";

import "./index.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
