import { Contact } from "@redux/models/ContactsModels";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { localDb, rxDb } from "@/database/db";
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
    clearDataContacts(state) {
      state.contacts = [];
    },
  },
});

const dbSubscriptionHandler = (x: any[]) => {
  if (x.length > 0) {
    store.dispatch(contactsSlice.actions.setReduxContacts(x));
  }
};

localDb().subscribeToAllContacts().subscribe(dbSubscriptionHandler);
rxDb().subscribeToAllContacts().subscribe(dbSubscriptionHandler);

export const { setReduxContacts, clearDataContacts } = contactsSlice.actions;

export default contactsSlice.reducer;
