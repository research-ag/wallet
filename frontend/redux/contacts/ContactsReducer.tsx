import { getAccountIdentifier, hexToNumber } from "@/utils";
import { AssetContact, Contact } from "@redux/models/ContactsModels";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import bigInt from "big-integer";

interface ContactsState {
  storageCode: string;
  contacts: Contact[];
}
const initialState: ContactsState = {
  storageCode: "",
  contacts: [],
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setStorageCode(state, action: PayloadAction<string>) {
      state.storageCode = action.payload;
    },
    setContacts(state, action: PayloadAction<Contact[]>) {
      state.contacts = action.payload;

      setLocalContacts(action.payload, state.storageCode);
    },
    addContact(state, action: PayloadAction<Contact>) {
      const auxContact = { ...action.payload, accountIdentier: getAccountIdentifier(action.payload.principal, 0) };
      const auxContacts = [...state.contacts, auxContact];
      state.contacts = auxContacts;
      setLocalContacts(auxContacts, state.storageCode);
    },
    deleteContatc(state, action: PayloadAction<string>) {
      const auxContacts = state.contacts.filter((cnts) => cnts.principal !== action.payload);
      state.contacts = auxContacts;
      setLocalContacts(auxContacts, state.storageCode);
    },
    editContact: {
      reducer(
        state,
        action: PayloadAction<{
          editedContact: Contact;
          pastPrincipal: string;
        }>,
      ) {
        const auxContacts = state.contacts.map((cnts) => {
          if (cnts.principal === action.payload.pastPrincipal) {
            return action.payload.editedContact;
          } else return cnts;
        });
        state.contacts = auxContacts;
        setLocalContacts(auxContacts, state.storageCode);
      },
      prepare(editedContact: Contact, pastPrincipal: string) {
        return {
          payload: { editedContact, pastPrincipal },
        };
      },
    },
    addAssetToContact: {
      reducer(
        state,
        action: PayloadAction<{
          asset: AssetContact[];
          pastPrincipal: string;
        }>,
      ) {
        const auxContacts = state.contacts.map((cnts) => {
          if (cnts.principal === action.payload.pastPrincipal) {
            return { ...cnts, assets: [...cnts.assets, ...action.payload.asset] };
          } else return cnts;
        });

        state.contacts = auxContacts;
        setLocalContacts(auxContacts, state.storageCode);
      },
      prepare(asset: AssetContact[], pastPrincipal: string) {
        return {
          payload: { asset, pastPrincipal },
        };
      },
    },
    editAssetName: {
      reducer(
        state,
        action: PayloadAction<{
          tokenSymbol: string;
          symbol: string;
        }>,
      ) {
        const auxContacts = state.contacts.map((cnts) => {
          return {
            ...cnts,
            assets: cnts.assets.map((asst) => {
              if (asst.tokenSymbol === action.payload.tokenSymbol) {
                return { ...asst, symbol: action.payload.symbol };
              } else return asst;
            }),
          };
        });

        state.contacts = auxContacts;
        setLocalContacts(auxContacts, state.storageCode);
      },
      prepare(tokenSymbol: string, symbol: string) {
        return {
          payload: { tokenSymbol, symbol },
        };
      },
    },
    addContactSubacc: {
      reducer(
        state,
        action: PayloadAction<{
          principal: string;
          tokenSymbol: string;
          newName: string;
          newIndex: string;
          subAccountId: string;
          allowance?: { allowance: string; expires_at: string } | undefined;
        }>,
      ) {
        const auxContacts = state.contacts.map((contact: Contact) => {
          if (contact.principal !== action.payload.principal) return contact;
          else {
            const hasAllowance = contact.assets.some((asset) =>
              asset.subaccounts.some((subAccount) => subAccount.allowance?.allowance),
            );

            return {
              ...contact,
              assets: contact.assets.map((asset) => {
                if (asset.tokenSymbol !== action.payload.tokenSymbol) {
                  return asset;
                } else {
                  return {
                    ...asset,
                    hasAllowance: Boolean(action.payload.allowance?.allowance || hasAllowance),
                    subaccounts: [
                      ...asset.subaccounts,
                      {
                        name: action.payload.newName,
                        subaccount_index: action.payload.newIndex,
                        sub_account_id: action.payload.subAccountId,
                        allowance: action.payload.allowance,
                      },
                    ].sort(
                      (a, b) =>
                        hexToNumber(`0x${a.subaccount_index}`)?.compare(
                          hexToNumber(`0x${b.subaccount_index}`) || bigInt(0),
                        ) || 0,
                    ),
                  };
                }
              }),
            };
          }
        });
        state.contacts = auxContacts;
        setLocalContacts(auxContacts, state.storageCode);
      },
      prepare(
        principal: string,
        tokenSymbol: string,
        newName: string,
        newIndex: string,
        subAccountId: string,
        allowance?: { allowance: string; expires_at: string } | undefined,
      ) {
        return {
          payload: { principal, tokenSymbol, newName, newIndex, subAccountId, allowance },
        };
      },
    },
    editContactSubacc: {
      reducer(
        state,
        action: PayloadAction<{
          principal: string;
          tokenSymbol: string;
          subIndex: string;
          newName: string;
          newIndex: string;
          allowance: { allowance: string; expires_at: string } | undefined;
        }>,
      ) {
        const auxContacts = state.contacts.map((contact) => {
          if (contact.principal !== action.payload.principal) return contact;
          else {
            return {
              ...contact,
              assets: contact.assets.map((asset) => {
                if (asset.tokenSymbol !== action.payload.tokenSymbol) {
                  return asset;
                } else {
                  return {
                    ...asset,
                    hasAllowance: Boolean(action.payload.allowance?.allowance),
                    subaccounts: asset.subaccounts
                      .map((subAccount) => {
                        if (subAccount.subaccount_index !== action.payload.subIndex) return subAccount;
                        else {
                          return {
                            name: action.payload.newName,
                            subaccount_index: action.payload.newIndex,
                            sub_account_id: `0x${action.payload.newIndex}`,
                            allowance: action.payload.allowance,
                          };
                        }
                      })
                      .sort(
                        (a, b) =>
                          hexToNumber(`0x${a.subaccount_index}`)?.compare(
                            hexToNumber(`0x${b.subaccount_index}`) || bigInt(0),
                          ) || 0,
                      ),
                  };
                }
              }),
            };
          }
        });
        state.contacts = auxContacts;
        setLocalContacts(auxContacts, state.storageCode);
      },
      prepare(
        principal: string,
        tokenSymbol: string,
        subIndex: string,
        newName: string,
        newIndex: string,
        allowance: { allowance: string; expires_at: string } | undefined,
      ) {
        return {
          payload: { principal, tokenSymbol, subIndex, newName, newIndex, allowance },
        };
      },
    },
    removeContact: {
      reducer(
        state,
        action: PayloadAction<{
          principal: string;
        }>,
      ) {
        const auxContacts = state.contacts.filter((cnts) => cnts.principal !== action.payload.principal);

        state.contacts = auxContacts;
        setLocalContacts(auxContacts, state.storageCode);
      },
      prepare(principal: string) {
        return {
          payload: { principal },
        };
      },
    },
    removeContactAsset: {
      reducer(
        state,
        action: PayloadAction<{
          principal: string;
          tokenSymbol: string;
        }>,
      ) {
        const auxContacts = state.contacts.map((cnts) => {
          if (cnts.principal !== action.payload.principal) return cnts;
          else {
            return { ...cnts, assets: cnts.assets.filter((asst) => asst.tokenSymbol !== action.payload.tokenSymbol) };
          }
        });

        state.contacts = auxContacts;
        setLocalContacts(auxContacts, state.storageCode);
      },
      prepare(principal: string, tokenSymbol: string) {
        return {
          payload: { principal, tokenSymbol },
        };
      },
    },
    removeContactSubacc: {
      reducer(
        state,
        action: PayloadAction<{
          principal: string;
          tokenSymbol: string;
          subIndex: string;
        }>,
      ) {
        const auxContacts = state.contacts.map((contact) => {
          if (contact.principal !== action.payload.principal) return contact;
          else {
            return {
              ...contact,
              assets: contact.assets.map((asset) => {
                const subaccounts = asset.subaccounts.filter(
                  (subAccount) => subAccount.subaccount_index !== action.payload.subIndex,
                );

                const hasAllowance = subaccounts.some((subAccount) => subAccount.allowance?.allowance);

                if (asset.tokenSymbol !== action.payload.tokenSymbol) {
                  return asset;
                }

                return {
                  ...asset,
                  hasAllowance,
                  subaccounts,
                };
              }),
            };
          }
        });
        state.contacts = auxContacts;
        setLocalContacts(auxContacts, state.storageCode);
      },
      prepare(principal: string, tokenSymbol: string, subIndex: string) {
        return {
          payload: { principal, tokenSymbol, subIndex },
        };
      },
    },
    clearDataContacts(state) {
      state.contacts = [];
      state.storageCode = "";
    },
  },
});

const setLocalContacts = (contacts: Contact[], code: string) => {
  localStorage.setItem(
    code,
    JSON.stringify({
      contacts: contacts,
    }),
  );
};

export const {
  clearDataContacts,
  setStorageCode,
  setContacts,
  addContact,
  deleteContatc,
  editContact,
  addAssetToContact,
  editAssetName,
  addContactSubacc,
  editContactSubacc,
  removeContact,
  removeContactAsset,
  removeContactSubacc,
} = contactsSlice.actions;

export default contactsSlice.reducer;
