/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AnonymousIdentity, HttpAgent, Identity } from "@dfinity/agent";
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
import { clearDataAsset, setICRC1SystemAssets, setInitLoad } from "./assets/AssetReducer";
import { AuthNetwork } from "./models/TokenModels";
import { AuthNetworkTypeEnum } from "@/const";
import { Ed25519KeyIdentity, DelegationIdentity } from "@dfinity/identity";
import { clearDataContacts } from "./contacts/ContactsReducer";
import { Principal } from "@dfinity/principal";
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { DB_Type, db } from "@/database/db";
import { setTransactions } from "./transaction/TransactionReducer";
import { getSNSTokens, updateAllBalances } from "./assets/AssetActions";
import contactCacheRefresh from "@pages/contacts/helpers/contactCacheRefresh";
import { allowanceCacheRefresh } from "@pages/home/helpers/allowanceCache";
import { setAppDataRefreshing } from "./common/CommonReducer";
import { addWatchOnlySessionToLocal } from "@pages/helpers/watchOnlyStorage";

const AUTH_PATH = `/authenticate/?applicationName=${import.meta.env.VITE_APP_NAME}&applicationLogo=${
  import.meta.env.VITE_APP_LOGO
}#authorize`;

const NETWORK_AUTHORIZE_PATH = "https://identity.ic0.app/#authorize";
const HTTP_AGENT_HOST = "https://identity.ic0.app";

export const handleAuthenticated = async (opt: AuthNetwork) => {
  const authClient = await AuthClient.create();
  await new Promise<void>((resolve, reject) => {
    authClient.login({
      maxTimeToLive: BigInt(24 * 60 * 60 * 1000 * 1000 * 1000),
      identityProvider:
        !!opt?.type && opt?.type === AuthNetworkTypeEnum.Values.NFID
          ? opt?.network + AUTH_PATH
          : NETWORK_AUTHORIZE_PATH,
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

export const handleSeedAuthenticated = async (seed: string) => {
  if (seed.length > 32) return;

  if (seed.length === 0) {
    const identity = new AnonymousIdentity();
    handleLoginApp(identity);
    return;
  }

  const seedToIdentity: (seed: string) => Identity | null = (seed) => {
    const seedBuf = new Uint8Array(new ArrayBuffer(32));
    seedBuf.set(new TextEncoder().encode(seed));
    return Ed25519KeyIdentity.generate(seedBuf);
  };

  const newIdentity = seedToIdentity(seed);

  if (newIdentity) {
    store.dispatch(setDebugMode(true));
    handleLoginApp(newIdentity, true);
  }
};

export const handlePrincipalAuthenticated = async (principalAddress: string) => {
  try {
    db().setDbLocation(DB_Type.LOCAL);
    const authClient = await AuthClient.create();
    const principal = Principal.fromText(principalAddress);
    addWatchOnlySessionToLocal({ alias: "", principal: principalAddress });
    handleLoginApp(authClient.getIdentity(), false, principal);
  } catch {
    return;
  }
};

export const handleMnemonicAuthenticated = (phrase: string[]) => {
  const phraseToIdentity: (phrase: string[]) => Identity | null = (phrase) => {
    return Secp256k1KeyIdentity.fromSeedPhrase(phrase) as any;
  };
  const secpIdentity = phraseToIdentity(phrase) as Identity;
  handleLoginApp(secpIdentity, true);
};

export const handleSiweAuthenticated = async (identity: DelegationIdentity) => {
  handleLoginApp(identity);
};

/**
 * Initialize the essential data after successful login
 * - Set the user agent, principal, and authenticated status
 * - Initialize the data for new user or set the last cached data
 * - Refresh the cached data in a background process after success login
 */
export const handleLoginApp = async (authIdentity: Identity, fromSeed?: boolean, fixedPrincipal?: Principal) => {
  const opt: AuthNetwork | null = db().getNetworkType();

  if (opt === null && !fromSeed && !fixedPrincipal) {
    logout();
    return;
  }

  store.dispatch(setAuthLoading(true));

  const myAgent = new HttpAgent({
    identity: authIdentity,
    host: HTTP_AGENT_HOST,
  });

  const myPrincipal = fixedPrincipal || (await myAgent.getPrincipal());
  const principalString = myPrincipal.toString();

  store.dispatch(setUserAgent(myAgent));
  store.dispatch(setUserPrincipal(myPrincipal));

  await db().setIdentity(authIdentity, myPrincipal);

  store.dispatch(setAuthenticated(true, false, !!fixedPrincipal, principalString));
  store.dispatch(setInitLoad(false));
  await refreshCachedData();
};

/**
 * Refresh the cached data only after success sign in
 * If you added a new module that needs to be refreshed after sign in, add it here
 */
const refreshCachedData = async () => {
  store.dispatch(setAppDataRefreshing(true));
  const assets = await db().getAssets();

  // INFO: sns Tokens should load before the assets to show correctly the asset logo see: utils/icons.getAssetIcon
  const snsTokens = await getSNSTokens(store.getState().auth.userAgent);
  store.dispatch(setICRC1SystemAssets(snsTokens));

  await updateAllBalances({
    loading: true,
    myAgent: store.getState().auth.userAgent,
    assets,
    fromLogin: true,
    basicSearch: true,
  });

  await allowanceCacheRefresh();
  await contactCacheRefresh();
  store.dispatch(setAppDataRefreshing(false));
};

export const logout = async () => {
  const authClient = await AuthClient.create();
  await authClient.logout();
  store.dispatch({ type: "USER_LOGGED_OUT" });
  await db().setIdentity(null);
  store.dispatch(clearDataContacts());
  store.dispatch(clearDataAsset());
  store.dispatch(clearDataAuth());
  store.dispatch(setUnauthenticated());
  store.dispatch(setUserAgent(undefined));
  store.dispatch(setUserPrincipal(undefined));
  store.dispatch(setTransactions([]));
};
