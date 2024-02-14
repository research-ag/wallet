/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpAgent, Identity } from "@dfinity/agent";
import store from "./Store";
import {
  clearDataAuth,
  setAuthLoading,
  setAuthenticated,
  setDebugMode,
  setUnauthenticated,
  setUserAgent,
  setUserPrincipal,
} from "./auth/AuthReducer";
import { AuthClient } from "@dfinity/auth-client";
import { setAssetFromLocalData, updateAllBalances } from "./assets/AssetActions";
import { clearDataAsset, setLoading, setTokens } from "./assets/AssetReducer";
import { AuthNetwork } from "./models/TokenModels";
import { AuthNetworkTypeEnum } from "@/const";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { clearDataContacts, setStorageCode } from "./contacts/ContactsReducer";
import { Principal } from "@dfinity/principal";
import { defaultTokens } from "@/defaultTokens";
import { allowanceCacheRefresh } from "@pages/home/helpers/allowanceCache";
import contactCacheRefresh from "@pages/contacts/helpers/contacts";
import { setAllowances } from "./allowance/AllowanceReducer";

const AUTH_PATH = `/authenticate/?applicationName=${import.meta.env.VITE_APP_NAME}&applicationLogo=${
  import.meta.env.VITE_APP_LOGO
}#authorize`;

export const handleAuthenticated = async (opt: AuthNetwork) => {
  const authClient = await AuthClient.create();
  await new Promise<void>((resolve, reject) => {
    authClient.login({
      maxTimeToLive: BigInt(24 * 60 * 60 * 1000 * 1000 * 1000),
      identityProvider:
        !!opt?.type && opt?.type === AuthNetworkTypeEnum.Values.NFID
          ? opt?.network + AUTH_PATH
          : "https://identity.ic0.app/#authorize",
      onSuccess: () => {
        handleLoginApp(authClient.getIdentity());
        store.dispatch(setDebugMode(false));
        resolve();
      },
      onError: (e) => {
        console.error("onError", e);
        store.dispatch(setUnauthenticated());
        store.dispatch(setDebugMode(false));
        reject();
      },
    });
  });
};

export const handleSeedAuthenticated = (seed: string) => {
  const seedToIdentity: (seed: string) => Identity | null = (seed) => {
    const seedBuf = new Uint8Array(new ArrayBuffer(32));
    if (seed.length && seed.length > 0 && seed.length <= 32) {
      seedBuf.set(new TextEncoder().encode(seed));
      return Ed25519KeyIdentity.generate(seedBuf);
    }
    return null;
  };
  const newIdentity = seedToIdentity(seed);
  if (newIdentity) {
    store.dispatch(setDebugMode(true));
    handleLoginApp(newIdentity, true);
  }
};

export const handlePrincipalAuthenticated = async (principalAddress: string) => {
  try {
    const authClient = await AuthClient.create();
    const principal = Principal.fromText(principalAddress);
    handleLoginApp(authClient.getIdentity(), false, principal);
  } catch {
    return;
  }
};

export const handleLoginApp = async (authIdentity: Identity, fromSeed?: boolean, fixedPrincipal?: Principal) => {
  store.dispatch(setLoading(true));
  if (localStorage.getItem("network_type") === null && !fromSeed && !fixedPrincipal) {
    logout();
    return;
  }
  store.dispatch(setAuthLoading(true));
  const myAgent = new HttpAgent({
    identity: authIdentity,
    host: "https://identity.ic0.app",
  });

  const myPrincipal = fixedPrincipal || (await myAgent.getPrincipal());
  const identityPrincipalStr = fixedPrincipal?.toString() || authIdentity.getPrincipal().toString();

  // TOKENS
  const userData = localStorage.getItem(identityPrincipalStr);
  if (userData) {
    const userDataJson = JSON.parse(userData);
    store.dispatch(setTokens(userDataJson.tokens));
    setAssetFromLocalData(userDataJson.tokens, myPrincipal.toText());
    dispatchAuths(identityPrincipalStr.toLocaleLowerCase(), myAgent, myPrincipal, !!fixedPrincipal);
    await updateAllBalances(true, myAgent, userDataJson.tokens, false, true);
  } else {
    dispatchAuths(identityPrincipalStr.toLocaleLowerCase(), myAgent, myPrincipal, !!fixedPrincipal);
    const { tokens } = await updateAllBalances(true, myAgent, defaultTokens, true, true);
    store.dispatch(setTokens(tokens));
  }

  await contactCacheRefresh(myPrincipal.toText());
  await allowanceCacheRefresh(myPrincipal.toText());
  store.dispatch(setLoading(false));
};

export const dispatchAuths = (
  identityPrincipal: string,
  myAgent: HttpAgent,
  myPrincipal: Principal,
  watchOnlyMode: boolean,
) => {
  store.dispatch(setAuthenticated(true, false, watchOnlyMode, identityPrincipal));
  store.dispatch(setStorageCode("contacts-" + identityPrincipal));
  store.dispatch(setUserAgent(myAgent));
  store.dispatch(setUserPrincipal(myPrincipal));
};

export const logout = async () => {
  const authClient = await AuthClient.create();
  await authClient.logout();
  store.dispatch({
    type: "USER_LOGGED_OUT",
  });
  store.dispatch(clearDataContacts());
  store.dispatch(clearDataAsset());
  store.dispatch(clearDataAuth());
  store.dispatch(setAllowances([]));
  store.dispatch(setUnauthenticated());
  store.dispatch(setUserAgent(undefined));
  store.dispatch(setUserPrincipal(undefined));
};
