import { setReduxContacts } from "@redux/contacts/ContactsReducer";
import store, { useAppDispatch } from "@redux/Store";
import { useEffect } from "react";
import { localDb, rxDb } from "./db";
import { updateAllBalances } from "@redux/assets/AssetActions";
import { setReduxAllowances } from "@redux/allowance/AllowanceReducer";
import { TAllowance } from "@/@types/allowance";
import { getAllowanceDetails, retrieveAssetsWithAllowance } from "@pages/home/helpers/icrc";
import { Contact } from "@redux/models/ContactsModels";
import { Asset } from "@redux/models/AccountModels";
// import { setAssets } from "@redux/assets/AssetReducer";

/**
 * Props for the DatabaseProvider component.
 *
 * @interface DatabaseProviderProps
 * @property children The child components to be wrapped by the provider.
 */
interface DatabaseProviderProps {
  children: JSX.Element;
}

/**
 * A component that synchronizes data between rxdb/local storage and Redux state.
 *
 * It listens for changes in the database or local storage and updates the global Redux state with the latest data, ensuring consistency.
 *
 * @export
 * @function DatabaseProvider
 * @param {DatabaseProviderProps} props The component props.
 * @returns {JSX.Element} The rendered component.
 */
export default function DatabaseProvider({ children }: DatabaseProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const assetsSubscriptionHandler = async (assets: Asset[]) => {
      if (assets.length > 0) {
        // INFO: Pre-load all assets while the balance is being updated
        // PROBLEM 1: the assets has not updated information
        // dispatch(setAssets([...assets]));

        // UPDATE 1: on login, update all balances after update refresh storage
        // UPDATE 2: on add asset automatic or manual, the new must be updated before save into db or must be refreshed after save
        // UPDATE 3: on add sub account to asset, the new must be updated before save into db or must be refreshed after save
        // UPDATE 4: on edit sub account to asset, the new must be updated before save into db or must be refreshed after save

        // PROBLEM: if the assetsSubscriptionHandler update the assets,  will it trigger infinite loop?
        // PROBLEM: if instead of update the db in the assetsSubscriptionHandler, we (add sub, add asset, edit asset, edit sub) is stored up to date. The problems is that in the first load, the assets are not in db, sow it only will be update if an actions for the user is made. Also the refresh balance does not update the database (storage)

        const {
          asset: { initLoad },
          auth: { userAgent },
        } = store.getState();

        await updateAllBalances({
          loading: true,
          myAgent: userAgent,
          assets,
          fromLogin: initLoad,
          basicSearch: true,
        });
      }
    };

    localDb().subscribeToAllAssets().subscribe(assetsSubscriptionHandler);
    rxDb().subscribeToAllAssets().subscribe(assetsSubscriptionHandler);
  }, []);

  useEffect(() => {
    const contactsSubscriptionHandler = async (contacts: Contact[]) => {
      const updatedContacts = [];
      if (contacts) {
        for (const contact of contacts) {
          const updatedAsset = await retrieveAssetsWithAllowance({
            accountPrincipal: contact.principal,
            assets: contact.assets,
          });

          updatedContacts.push({ ...contact, assets: updatedAsset });
        }
      }

      dispatch(setReduxContacts(updatedContacts));
    };

    localDb().subscribeToAllContacts().subscribe(contactsSubscriptionHandler);
    rxDb().subscribeToAllContacts().subscribe(contactsSubscriptionHandler);
  }, []);

  useEffect(() => {
    const allowancesSubscriptionHandler = async (allowances: TAllowance[]) => {
      const updatedAllowances: TAllowance[] = [];

      for (const allowance of allowances) {
        try {
          const spenderPrincipal = allowance?.spender;
          const spenderSubaccount = allowance?.subAccountId;
          const assetAddress = allowance?.asset.address;
          const assetDecimal = allowance?.asset.decimal;

          if (
            typeof spenderPrincipal === "string" &&
            typeof spenderSubaccount === "string" &&
            typeof assetAddress === "string" &&
            typeof assetDecimal === "string"
          ) {
            const response = await getAllowanceDetails({
              spenderPrincipal,
              spenderSubaccount,
              assetAddress,
              assetDecimal,
            });

            updatedAllowances.push({
              ...allowance,
              amount: response?.allowance ? response?.allowance : "0",
              expiration: response?.expires_at ? response?.expires_at : "",
            });
          }
        } catch (error) {
          console.log(error);
        }
      }

      dispatch(setReduxAllowances(updatedAllowances));
    };

    localDb().subscribeToAllAllowances().subscribe(allowancesSubscriptionHandler);
    rxDb().subscribeToAllAllowances().subscribe(allowancesSubscriptionHandler);
  }, []);

  return <>{children}</>;
}
