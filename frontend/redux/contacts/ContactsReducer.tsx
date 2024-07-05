import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import logger from "@/common/utils/logger";
import { Contact } from "@redux/models/ContactsModels";

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
      if (index === -1) logger.debug("Contact not found");
    },
    deleteReduxContact(state, action: PayloadAction<string>) {
      state.contacts = state.contacts.filter((contact) => contact.principal !== action.payload);
    },
    clearDataContacts(state) {
      state.contacts = [];
    },
  },
});

export const { setReduxContacts, addReduxContact, clearDataContacts, updateReduxContact, deleteReduxContact } =
  contactsSlice.actions;

export default contactsSlice.reducer;
