/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AnonymousIdentity, HttpAgent, Identity } from "@dfinity/agent";
import logger from "@/common/utils/logger";
import store from "@/redux/Store";
import {
  setAuthLoading,
  setAuthenticated,
  setDbLocation,
  setDebugMode,
  setRoutingPath,
  setUnauthenticated,
  setUserAgent,
  setUserPrincipal,
} from "@/redux/auth/AuthReducer";
import { AuthClient } from "@dfinity/auth-client";
import { setInitLoad } from "@/redux/assets/AssetReducer";
import { AuthNetwork } from "@/redux/models/TokenModels";
import { AuthNetworkTypeEnum, RoutingPathEnum } from "@/common/const";
import { Ed25519KeyIdentity, DelegationIdentity } from "@dfinity/identity";
import { Principal } from "@dfinity/principal";
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { db, DB_Type } from "@/database/db";
import { addWatchOnlySessionToLocal } from "@pages/helpers/watchOnlyStorage";
import watchOnlyRefresh from "@pages/helpers/watchOnlyRefresh";
import { clearServiceData } from "./services/ServiceReducer";

const AUTH_PATH = `/authenticate/?applicationName=${import.meta.env.VITE_APP_NAME}&applicationLogo=${
  import.meta.env.VITE_APP_LOGO
}#authorize`;

const NETWORK_AUTHORIZE_PATH = "https://identity.ic0.app/#authorize";
const HTTP_AGENT_HOST = "https://identity.ic0.app";

export const handleAuthenticated = async (opt: AuthNetwork) => {
  try {
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
          logger.debug("onError", e);
          store.dispatch(setUnauthenticated());
          store.dispatch(setDebugMode(false));
          reject();
        },
      });
    });
  } catch (error) {
    logger.debug(error);
  }
};

export const handleSiweAuthenticated = async (identity: DelegationIdentity) => {
  handleLoginApp(identity);
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
    store.dispatch(setDbLocation(DB_Type.LOCAL));
    const authClient = await AuthClient.create();
    const principal = Principal.fromText(principalAddress);
    addWatchOnlySessionToLocal({ alias: "", principal: principalAddress });
    watchOnlyRefresh();
    await handleLoginApp(authClient.getIdentity(), false, principal);
  } catch (error) {
    logger.debug("Error parsing principal", error);
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
  store.dispatch(setUserAgent(myAgent));

  const myPrincipal = fixedPrincipal || (await myAgent.getPrincipal());
  const principalString = myPrincipal.toString();

  await db().setIdentity(authIdentity, myPrincipal);

  store.dispatch(setInitLoad(false));
  store.dispatch(setUserPrincipal(myPrincipal));
  store.dispatch(setAuthenticated(true, false, !!fixedPrincipal, principalString));
  store.dispatch(setRoutingPath(RoutingPathEnum.Enum.HOME));
};

export const logout = async () => {
  store.dispatch({ type: "USER_LOGGED_OUT" });
  await db().setIdentity(null);
  cleanEthLogin();
  store.dispatch(clearServiceData());
  window.location.reload();
};

export const cleanEthLogin = () => {
  localStorage.removeItem("wagmi.store");
  localStorage.removeItem("network_type");
  localStorage.removeItem("rk-latest-id");
  localStorage.removeItem("rk-recent");
  localStorage.removeItem("wagmi.wallet");
  localStorage.removeItem("rk-version");
  localStorage.removeItem("wagmi.metaMask.shimDisconnect");
  localStorage.removeItem("wagmi.connected");
  localStorage.removeItem("-walletlink:https://www.walletlink.org:version");
  localStorage.removeItem("-walletlink:https://www.walletlink.org:session:id");
  localStorage.removeItem("-walletlink:https://www.walletlink.org:session:secret");
  localStorage.removeItem("-walletlink:https://www.walletlink.org:session:linked");
  localStorage.removeItem("wagmi.cache");
  localStorage.removeItem("WCM_VERSION");
  indexedDB.deleteDatabase("WALLET_CONNECT_V2_INDEXED_DB");
  indexedDB.deleteDatabase("auth-client-db");
};
