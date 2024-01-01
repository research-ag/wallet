import "./App.scss";
import { AuthClient } from "@dfinity/auth-client";
import { GlobalDebug } from "./RemoveLogs";
import { handleLoginApp } from "@redux/CheckAuth";
import { Provider } from "react-redux";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { setAuth } from "@redux/auth/AuthReducer";
import { useTranslation } from "react-i18next";
import { persister, queryClient } from "@/config/query";
import React, { useEffect } from "react";
import store from "./redux/Store";
import SwitchRoute from "./pages";

const App: React.FC = () => {
  const { i18n } = useTranslation();

  if (typeof window !== "undefined") {
    window.React = React;
  }

  useEffect(() => {
    const language = localStorage.getItem("language");
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

  return (
    <div className="App">
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
        <Provider store={store}>
          <SwitchRoute />
        </Provider>
      </PersistQueryClientProvider>
    </div>
  );
};

export default App;
