import React, { useEffect } from "react";
import SwitchRoute from "./pages";
import { Provider } from "react-redux";
import store from "./redux/Store";
import { useTranslation } from "react-i18next";
import "./App.scss";
import { AuthClient } from "@dfinity/auth-client";
import { handleLoginApp } from "@redux/CheckAuth";
import { setAuth } from "@redux/auth/AuthReducer";
import { db } from "@/database/db";

const App: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const language = db().getLanguage();
    if (language !== undefined && language !== null && language !== "" && language !== "null") {
      i18n.changeLanguage(language);
    }
  }, [i18n]);

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
      <Provider store={store}>
        <SwitchRoute></SwitchRoute>
      </Provider>
    </div>
  );
};

export default App;
