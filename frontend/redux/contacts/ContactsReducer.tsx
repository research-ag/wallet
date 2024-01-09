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
        }>,
      ) {
        const auxContacts = state.contacts.map((cnts) => {
          if (cnts.principal !== action.payload.principal) return cnts;
          else {
            return {
              ...cnts,
              assets: cnts.assets.map((asst) => {
                if (asst.tokenSymbol !== action.payload.tokenSymbol) {
                  return asst;
                } else {
                  return {
                    ...asst,
                    subaccounts: [
                      ...asst.subaccounts,
                      { name: action.payload.newName, subaccount_index: action.payload.newIndex },
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
      prepare(principal: string, tokenSymbol: string, newName: string, newIndex: string) {
        return {
          payload: { principal, tokenSymbol, newName, newIndex },
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
        }>,
      ) {
        const auxContacts = state.contacts.map((cnts) => {
          if (cnts.principal !== action.payload.principal) return cnts;
          else {
            return {
              ...cnts,
              assets: cnts.assets.map((asst) => {
                if (asst.tokenSymbol !== action.payload.tokenSymbol) {
                  return asst;
                } else {
                  return {
                    ...asst,
                    subaccounts: asst.subaccounts
                      .map((sa) => {
                        if (sa.subaccount_index !== action.payload.subIndex) return sa;
                        else {
                          return {
                            name: action.payload.newName,
                            subaccount_index: action.payload.newIndex,
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
      prepare(principal: string, tokenSymbol: string, subIndex: string, newName: string, newIndex: string) {
        return {
          payload: { principal, tokenSymbol, subIndex, newName, newIndex },
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
        const auxContacts = state.contacts.map((cnts) => {
          if (cnts.principal !== action.payload.principal) return cnts;
          else {
            return {
              ...cnts,
              assets: cnts.assets.map((asst) => {
                if (asst.tokenSymbol !== action.payload.tokenSymbol) {
                  return asst;
                } else {
                  return {
                    ...asst,
                    subaccounts: asst.subaccounts.filter((sa) => sa.subaccount_index !== action.payload.subIndex),
                  };
                }
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
