import { setReduxContacts } from "@redux/contacts/ContactsReducer";
import store from "@redux/Store";
import { useEffect } from "react";
import { localDb, rxDb } from "./db";
import { setReduxTokens } from "@redux/assets/AssetReducer";
import { setAssetFromLocalData, updateAllBalances } from "@redux/assets/AssetActions";
import { setReduxAllowances } from "@redux/allowance/AllowanceReducer";

interface DatabaseProviderProps {
  children: JSX.Element;
}

export default function DatabaseProvider({ children }: DatabaseProviderProps) {
  useEffect(() => {
    const assetsSubscriptionHandler = async (x: any[]) => {
      console.log("asset sub", x);
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

    localDb().subscribeToAllTokens().subscribe(assetsSubscriptionHandler);
    rxDb().subscribeToAllTokens().subscribe(assetsSubscriptionHandler);
  }, []);

  useEffect(() => {
    const contactsSubscriptionHandler = (x: any[]) => {
      console.log("contacts sub", x);
      return store.dispatch(setReduxContacts(x));
    };

    localDb().subscribeToAllContacts().subscribe(contactsSubscriptionHandler);
    rxDb().subscribeToAllContacts().subscribe(contactsSubscriptionHandler);

    // TODO: update contacts allowance here

  }, []);


  useEffect(() => {
    const allowancesSubscriptionHandler = (x: any[]) => {
      console.log("allowances sub", x);

      store.dispatch(setReduxAllowances(x));
    };
    localDb().subscribeToAllAllowances().subscribe(allowancesSubscriptionHandler);
    rxDb().subscribeToAllAllowances().subscribe(allowancesSubscriptionHandler);

    // TODO: update the allowance here

  }, []);


  return (<>{children}</>);
};