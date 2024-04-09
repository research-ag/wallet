import React from "react";
import SwitchRoute from "./pages";
import { Provider } from "react-redux";
import store from "./redux/Store";
import "./App.scss";
import { queryClient } from "./config/query";
import { QueryClientProvider } from "@tanstack/react-query";
import EthereumSignInProviderWrapper from "./wrappers/EthereumSignInWrapper";
import LanguageWrapper from "./wrappers/LanguageWrapper";
import DebugWrapper from "./wrappers/DebugWrapper";

const App: React.FC = () => {
  return (
    <div className="App">
      <SwitchRoute></SwitchRoute>
    </div>
  );
};

export default function AppWrapper() {
  return (
    <EthereumSignInProviderWrapper>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <LanguageWrapper>
            <DebugWrapper>
              <App />
            </DebugWrapper>
          </LanguageWrapper>
        </QueryClientProvider>
      </Provider>
    </EthereumSignInProviderWrapper>
  );
}
