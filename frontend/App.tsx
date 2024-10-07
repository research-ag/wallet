import React from "react";
import SwitchRoute from "./pages";
import { Provider } from "react-redux";
import store from "./redux/Store";
import "./App.scss";
import EthereumSignInProviderWrapper from "./wrappers/EthereumSignInWrapper";
import LanguageWrapper from "./wrappers/LanguageWrapper";
import ThemeWrapper from "./wrappers/ThemeWrapper";
import DatabaseWrapper from "./wrappers/DatabaseWrapper";
import IdentityWrapper from "./wrappers/IdentityWrapper";

const App: React.FC = () => {
  return (
    <div className="App">
      <SwitchRoute />
    </div>
  );
};

export default function AppWrapper() {
  return (
    <EthereumSignInProviderWrapper>
      <Provider store={store}>
        <IdentityWrapper>
          <LanguageWrapper>
            <ThemeWrapper>
              <DatabaseWrapper>
                <App />
              </DatabaseWrapper>
            </ThemeWrapper>
          </LanguageWrapper>
        </IdentityWrapper>
      </Provider>
    </EthereumSignInProviderWrapper>
  );
}
