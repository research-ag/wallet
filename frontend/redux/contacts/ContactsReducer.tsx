import { Contact } from "@redux/models/ContactsModels";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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

export const { setReduxContacts, clearDataContacts } = contactsSlice.actions;

export default contactsSlice.reducer;
