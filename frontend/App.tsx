import React, { useEffect } from "react";
import SwitchRoute from "./pages";
import { Provider } from "react-redux";
import store, { useAppDispatch } from "./redux/Store";
import { useTranslation } from "react-i18next";
import "./App.scss";
import { AuthClient } from "@dfinity/auth-client";
import { handleLoginApp } from "@redux/CheckAuth";
import { setAuth } from "@redux/auth/AuthReducer";
import { GlobalDebug } from "./RemoveLogs";
import { queryClient } from "./config/query";
import { db } from "@/database/db";
import { QueryClientProvider } from "@tanstack/react-query";
import { EthereumSignInProvider } from "./config/wagmi.config";
import { useSiweIdentity } from "ic-use-siwe-identity";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const { clear, identity } = useSiweIdentity();

  useEffect(() => {
    if (identity) {
      clear();
    }
  }, []);

  useEffect(() => {
    const language = db().getLanguage();
    if (language !== undefined && language !== null && language !== "" && language !== "null") {
      i18n.changeLanguage(language);
    }
  }, [i18n]);

  useEffect(() => {
    import.meta.env.NODE_ENV === "PRODUCTION" && GlobalDebug(false, true);
  }, []);

  useEffect(() => {
    const getIdentity = async () => {
      const authClient = await AuthClient.create();
      const valid = await authClient.isAuthenticated();
      if (valid) {
        handleLoginApp(authClient.getIdentity());
      } else {
        dispatch(setAuth());
      }
    };
    getIdentity().catch(console.error);
  }, []);

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <SwitchRoute></SwitchRoute>
      </QueryClientProvider>
    </div>
  );
};

export default function AppWrapper() {
  return (
    <EthereumSignInProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </EthereumSignInProvider>
  );
}
