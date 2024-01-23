import { getAccountIdentifier, hexToNumber } from "@/utils";
import { AssetContact, Contact } from "@redux/models/ContactsModels";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import bigInt from "big-integer";
import { db } from "@/database/db";
import store from "@redux/Store";

interface ContactsState {
  contacts: Contact[];
}
const initialState: ContactsState = {
  contacts: [],
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setReduxContacts(state, action: PayloadAction<Contact[]>) {
      state.contacts = action.payload;
    },
    addContact(_, action: PayloadAction<Contact>) {
      db()
        .addContact({ ...action.payload, accountIdentier: getAccountIdentifier(action.payload.principal, 0) })
        .then();
    },
    deleteContatc(_, action: PayloadAction<string>) {
      db().deleteContact(action.payload).then();
    },
    editContact: {
      reducer(
        _,
        action: PayloadAction<{
          editedContact: Contact;
          pastPrincipal: string;
        }>,
      ) {
        db().updateContact(action.payload.pastPrincipal, action.payload.editedContact).then();
      },
      prepare(editedContact: Contact, pastPrincipal: string) {
        return {
          payload: { editedContact, pastPrincipal },
        };
      },
    },
    addAssetToContact: {
      reducer(
        _,
        action: PayloadAction<{
          asset: AssetContact[];
          pastPrincipal: string;
        }>,
      ) {
        db()
          .getContact(action.payload.pastPrincipal)
          .then(async (cnt) => {
            if (cnt) {
              await db().updateContact(action.payload.pastPrincipal, {
                ...cnt,
                assets: [...cnt.assets, ...action.payload.asset],
              });
            }
          });
      },
      prepare(asset: AssetContact[], pastPrincipal: string) {
        return {
          payload: { asset, pastPrincipal },
        };
      },
    },
    editAssetName: {
      reducer(
        _,
        action: PayloadAction<{
          tokenSymbol: string;
          symbol: string;
        }>,
      ) {
        setTimeout(async () => {
          const affectedContacts: Contact[] = [];
          for (const cnt of await db().getContacts()) {
            let affected = false;
            const newDoc = {
              ...cnt,
              assets: cnt.assets.map((asst) => {
                if (asst.tokenSymbol === action.payload.tokenSymbol) {
                  affected = true;
                  return { ...asst, symbol: action.payload.symbol };
                } else return asst;
              }),
            };
            if (affected) {
              affectedContacts.push(newDoc);
            }
          }
          await Promise.all(affectedContacts.map((c) => db().updateContact(c.principal, c)));
        }, 0);
      },
      prepare(tokenSymbol: string, symbol: string) {
        return {
          payload: { tokenSymbol, symbol },
        };
      },
    },
    addContactSubacc: {
      reducer(
        _,
        action: PayloadAction<{
          principal: string;
          tokenSymbol: string;
          newName: string;
          newIndex: string;
        }>,
      ) {
        db()
          .getContact(action.payload.principal)
          .then(async (cnt) => {
            if (cnt) {
              await db().updateContact(action.payload.principal, {
                ...cnt,
                assets: cnt.assets.map((asst) => {
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
              });
            }
          });
      },
      prepare(principal: string, tokenSymbol: string, newName: string, newIndex: string) {
        return {
          payload: { principal, tokenSymbol, newName, newIndex },
        };
      },
    },
    editContactSubacc: {
      reducer(
        _,
        action: PayloadAction<{
          principal: string;
          tokenSymbol: string;
          subIndex: string;
          newName: string;
          newIndex: string;
        }>,
      ) {
        db()
          .getContact(action.payload.principal)
          .then(async (cnts) => {
            if (cnts) {
              await db().updateContact(action.payload.principal, {
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
              });
            }
          });
      },
      prepare(principal: string, tokenSymbol: string, subIndex: string, newName: string, newIndex: string) {
        return {
          payload: { principal, tokenSymbol, subIndex, newName, newIndex },
        };
      },
    },
    removeContact: {
      reducer(
        _,
        action: PayloadAction<{
          principal: string;
        }>,
      ) {
        db().deleteContact(action.payload.principal).then();
      },
      prepare(principal: string) {
        return {
          payload: { principal },
        };
      },
    },
    removeContactAsset: {
      reducer(
        _,
        action: PayloadAction<{
          principal: string;
          tokenSymbol: string;
        }>,
      ) {
        db()
          .getContact(action.payload.principal)
          .then(async (cnt) => {
            if (cnt) {
              await db().updateContact(action.payload.principal, {
                ...cnt,
                assets: cnt.assets.filter((asst) => asst.tokenSymbol !== action.payload.tokenSymbol),
              });
            }
          });
      },
      prepare(principal: string, tokenSymbol: string) {
        return {
          payload: { principal, tokenSymbol },
        };
      },
    },
    removeContactSubacc: {
      reducer(
        _,
        action: PayloadAction<{
          principal: string;
          tokenSymbol: string;
          subIndex: string;
        }>,
      ) {
        db()
          .getContact(action.payload.principal)
          .then(async (cnt) => {
            if (cnt) {
              await db().updateContact(action.payload.principal, {
                ...cnt,
                assets: cnt.assets.map((asst) => {
                  if (asst.tokenSymbol !== action.payload.tokenSymbol) {
                    return asst;
                  } else {
                    return {
                      ...asst,
                      subaccounts: asst.subaccounts.filter((sa) => sa.subaccount_index !== action.payload.subIndex),
                    };
                  }
                }),
              });
            }
          });
      },
      prepare(principal: string, tokenSymbol: string, subIndex: string) {
        return {
          payload: { principal, tokenSymbol, subIndex },
        };
      },
    },
    clearDataContacts(state) {
      state.contacts = [];
    },
  },
});

db()
  .subscribeToAllContacts()
  .subscribe((x) => store.dispatch(contactsSlice.actions.setReduxContacts(x)));

export const {
  clearDataContacts,
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
