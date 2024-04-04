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
        const {
          asset: { initLoad },
          auth: { userAgent },
        } = store.getState();

        await updateAllBalances({
          loading: true,
          myAgent: userAgent,
          assets,
          fromLogin: initLoad,
        });
      }
    };

    localDb().subscribeToAllTokens().subscribe(assetsSubscriptionHandler);
    rxDb().subscribeToAllTokens().subscribe(assetsSubscriptionHandler);
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
