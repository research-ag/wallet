import { ContactSubAccount, NewContact, ReceiverState, SenderState } from "@/@types/transactions";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface TransactionState {
  sender: SenderState;
  receiver: ReceiverState;
}

export const initialTransactionState = {
  sender: {},
  receiver: {},
} as TransactionState;
const name = "transaction";

const transactionSlice = createSlice({
  name,
  initialState: initialTransactionState,
  reducers: {
    setSenderAsset(state: TransactionState, action: PayloadAction<Asset>) {
      state.sender.asset = action.payload;
    },
    setSenderSubAccount(state: TransactionState, action: PayloadAction<SubAccount>) {
      // INFO: Set a own account as sender
      state.sender.subAccount = action.payload;
      state.sender.newAllowanceContact = {} as NewContact;
      state.sender.allowanceContactSubAccount = {} as ContactSubAccount;
    },
    setSenderContact(state: TransactionState, action: PayloadAction<ContactSubAccount>) {
      // INFO: set contact book sub account with allowance as sender
      state.sender.allowanceContactSubAccount = action.payload;
      state.sender.newAllowanceContact = {} as NewContact;
      state.sender.subAccount = {} as SubAccount;
    },
    setSenderContactNew(state: TransactionState, action: PayloadAction<NewContact>) {
      // INFO: set new contact principal and sub account id as sender (Allowance no registered in contact book)
      state.sender.newAllowanceContact = action.payload;
      state.sender.allowanceContactSubAccount = {} as ContactSubAccount;
      state.sender.subAccount = {} as SubAccount;
    },
    setReceiverOwnSubAccount(state: TransactionState, action: PayloadAction<SubAccount>) {
      // INFO: set own sub account as receiver
      state.receiver.ownSubAccount = action.payload;
      // TODO: clean third new contact
      // TODO: clean thirdContactSubAccount
    },
    setReceiverNewContact(state: TransactionState, action: PayloadAction<NewContact>) {
      // INFO: set new contact principal and sub account id as receiver (Allowance no registered in contact book)
      state.receiver.thirdNewContact = action.payload;
      // TODO: clean ownSubAccount
      // TODO: clean thirdContactSubAccount
    },
    setReceiverContact(state: TransactionState, action: PayloadAction<ContactSubAccount>) {
      // INFO: set contact book sub account receiver
      state.receiver.thirdContactSubAccount = action.payload;
      // TODO: clean ownSubAccount
      // TODO: clean thirdNewContact
    },
  },
});

export const {
  setSenderAsset,
  setSenderSubAccount,
  setSenderContact,
  setSenderContactNew,
  setReceiverOwnSubAccount,
  setReceiverNewContact,
  setReceiverContact,
} = transactionSlice.actions;
export default transactionSlice.reducer;
