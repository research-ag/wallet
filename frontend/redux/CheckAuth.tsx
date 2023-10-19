/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpAgent, Identity } from "@dfinity/agent";
import store from "./Store";
import {
  clearDataAuth,
  setAuthenticated,
  setAuthLoading,
  setUnauthenticated,
  setUserAgent,
  setUserPrincipal,
} from "./auth/AuthReducer";
import { AuthClient } from "@dfinity/auth-client";
import { updateAllBalances } from "./assets/AssetActions";
import { clearDataAsset, setTokens } from "./assets/AssetReducer";
import { AuthNetwork } from "./models/TokenModels";
import { AuthNetworkTypeEnum, defaultTokens } from "@/const";
import { clearDataContacts, setContacts } from "./contacts/ContactsReducer";
import { db } from "@/database/db";

const AUTH_PATH = `/authenticate/?applicationName=${import.meta.env.VITE_APP_NAME}&applicationLogo=${
  import.meta.env.VITE_APP_LOGO
}#authorize`;

export const handleAuthenticated = async (opt: AuthNetwork) => {
  const authClient = await AuthClient.create();
  await new Promise<void>((resolve, reject) => {
    authClient.login({
      maxTimeToLive: BigInt(24 * 60 * 60 * 1000 * 1000 * 1000),
      identityProvider:
        opt?.type === AuthNetworkTypeEnum.Values.NFID && opt?.type !== undefined && opt?.type !== null
          ? opt?.network + AUTH_PATH
          : undefined,
      onSuccess: () => {
        handleLoginApp(authClient.getIdentity());
        resolve();
      },
      onError: (e) => {
        console.error("onError", e);
        store.dispatch(setUnauthenticated());
        reject();
      },
    });
  });
};

export const handleLoginApp = async (authIdentity: Identity) => {
  const opt: AuthNetwork | null = db().getNetworkType();
  if (opt === null) logout();

  db().setIdentity(authIdentity);

  store.dispatch(setAuthLoading(true));
  const myAgent = new HttpAgent({
    identity: authIdentity,
    host:
      opt?.type === AuthNetworkTypeEnum.Values.NFID && opt?.type !== undefined && opt?.type !== null
        ? opt?.network + AUTH_PATH
        : import.meta.env.VITE_AGGENT_HOST,
  });

  const myPrincipal = await myAgent.getPrincipal();

  // TOKENS
  const dbTokens = await db().getTokens();
  if (dbTokens) {
    store.dispatch(setTokens(dbTokens));
    await updateAllBalances(true, myAgent, dbTokens);
  } else {
    const { tokens } = await updateAllBalances(true, myAgent, defaultTokens, true);
    store.dispatch(setTokens(tokens));
  }

  // CONTACTS
  const contacts = await db().getContacts();
  if (contacts) {
    store.dispatch(setContacts(contacts));
  }

  store.dispatch(setAuthenticated(true, false, authIdentity.getPrincipal().toText().toLowerCase()));
  store.dispatch(setUserAgent(myAgent));
  store.dispatch(setUserPrincipal(myPrincipal));
};

export const logout = async () => {
  const authClient = await AuthClient.create();
  await authClient.logout();
  store.dispatch({
    type: "USER_LOGGED_OUT",
  });
  db().setIdentity(null);
  store.dispatch(clearDataContacts());
  store.dispatch(clearDataAsset());
  store.dispatch(clearDataAuth());
  store.dispatch(setUnauthenticated());
  store.dispatch(setUserAgent(undefined));
  store.dispatch(setUserPrincipal(undefined));
};
