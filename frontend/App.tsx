import React, { useEffect } from "react";
import SwitchRoute from "./pages";
import { Provider } from "react-redux";
import store from "./redux/Store";
import { useTranslation } from "react-i18next";
import "./App.scss";
import { AuthClient } from "@dfinity/auth-client";
import { handleLoginApp } from "@redux/CheckAuth";
import { setAuth } from "@redux/auth/AuthReducer";
import { GlobalDebug } from "./RemoveLogs";
import { queryClient } from "./config/query";
import { db, localDb, rxDb } from "@/database/db";
import { QueryClientProvider } from "@tanstack/react-query";
import { EthereumSignInProvider } from "./config/wagmi.config";
import { useSiweIdentity } from "ic-use-siwe-identity";
import { setReduxAllowances } from "@/redux/allowance/AllowanceReducer";
import { setReduxTokens } from "@/redux/assets/AssetReducer";
import { setReduxContacts } from "@/redux/contacts/ContactsReducer";
import { setAssetFromLocalData, updateAllBalances } from "@/redux/assets/AssetActions";

const App: React.FC = () => {
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
        store.dispatch(setAuth());
      }
    };
    getIdentity().catch(console.error);
  }, []);

  // Subscribe all DB documents observables after Redux store has been initialized
  // TODO: remove this useEffect and use a better way to subscribe to DB documents
  useEffect(() => {
    (function () {
      const allowancesSubscriptionHandler = (x: any[]) => store.dispatch(setReduxAllowances(x));
      const contactsSubscriptionHandler = (x: any[]) => store.dispatch(setReduxContacts(x));
      const tokensSubscriptionHandler = async (x: any[]) => {
        if (x.length > 0) {
          const {
            asset,
            auth: { authClient, userAgent },
          } = store.getState();

          store.dispatch(setReduxTokens(x));

          if (asset.initLoad) setAssetFromLocalData(x, authClient);

          await updateAllBalances({
            loading: true,
            myAgent: userAgent,
            tokens: x,
            basicSearch: false,
            fromLogin: true,
          });
        }
      };

      localDb().subscribeToAllTokens().subscribe(allowancesSubscriptionHandler);
      rxDb().subscribeToAllTokens().subscribe(allowancesSubscriptionHandler);

      localDb().subscribeToAllContacts().subscribe(contactsSubscriptionHandler);
      rxDb().subscribeToAllContacts().subscribe(contactsSubscriptionHandler);

      localDb().subscribeToAllAllowances().subscribe(tokensSubscriptionHandler);
      rxDb().subscribeToAllAllowances().subscribe(tokensSubscriptionHandler);
    })();
  }, [store]);

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <SwitchRoute></SwitchRoute>
        </Provider>
      </QueryClientProvider>
    </div>
  );
};

export default function AppWrapper() {
  return (
    <EthereumSignInProvider>
      <App />
    </EthereumSignInProvider>
  );
}
