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
    addReduxContact(state, action: PayloadAction<Contact>) {
      state.contacts.push(action.payload);
    },
    updateReduxContact(state, action: PayloadAction<Contact>) {
      const index = state.contacts.findIndex((contact) => contact.principal === action.payload.principal);
      if (index !== -1) state.contacts[index] = action.payload;
      if (index === -1) console.warn("Contact not found");
    },
    clearDataContacts(state) {
      state.contacts = [];
    },
  },
});

export const { setReduxContacts, addReduxContact, clearDataContacts, updateReduxContact } = contactsSlice.actions;

export default contactsSlice.reducer;
