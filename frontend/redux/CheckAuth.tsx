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
import { clearDataAsset, setICRC1SystemAssets, setInitLoad, setLoading } from "./assets/AssetReducer";
import { AuthNetwork } from "./models/TokenModels";
import { AuthNetworkTypeEnum } from "@/const";
import { Ed25519KeyIdentity, DelegationIdentity } from "@dfinity/identity";
import { clearDataContacts } from "./contacts/ContactsReducer";
import { Principal } from "@dfinity/principal";
import { allowanceCacheRefresh } from "@pages/home/helpers/allowanceCache";
import contactCacheRefresh from "@pages/contacts/helpers/contacts";
import { setAllowances } from "./allowance/AllowanceReducer";
import { db } from "@/database/db";
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { getSNSTokens } from "./assets/AssetActions";

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

export const handleLoginApp = async (authIdentity: Identity, fromSeed?: boolean, fixedPrincipal?: Principal) => {
  store.dispatch(setLoading(true));
  const opt: AuthNetwork | null = db().getNetworkType();
  if (opt === null && !fromSeed && !fixedPrincipal) {
    logout();
    return;
  }

  // INFO: setAuthenticated will stop the authLoading
  store.dispatch(setAuthLoading(true));
  const myAgent = new HttpAgent({
    identity: authIdentity,
    host: "https://identity.ic0.app",
  });

  const myPrincipal = fixedPrincipal || (await myAgent.getPrincipal());
  const identityPrincipalStr = fixedPrincipal?.toString() || authIdentity.getPrincipal().toString();

  dispatchAuths(myAgent, myPrincipal);

  await db().setIdentity(authIdentity, fixedPrincipal);

  const snsTokens = await getSNSTokens();
  store.dispatch(setICRC1SystemAssets(snsTokens));

  store.dispatch(setAuthenticated(true, false, !!fixedPrincipal, identityPrincipalStr.toLocaleLowerCase()));

  // ALLOWANCES
  await contactCacheRefresh();
  await allowanceCacheRefresh(myPrincipal.toText());
  store.dispatch(setLoading(false));
  store.dispatch(setInitLoad(false));
};

export const dispatchAuths = (myAgent: HttpAgent, myPrincipal: Principal) => {
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
  store.dispatch(setAllowances([]));
  store.dispatch(setUnauthenticated());
  store.dispatch(setUserAgent(undefined));
  store.dispatch(setUserPrincipal(undefined));
};
