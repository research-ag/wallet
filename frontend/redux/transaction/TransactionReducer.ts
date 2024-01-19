import { ContactSubAccount, NewContact, ReceiverState, ScannerOption, SenderState } from "@/@types/transactions";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface TransactionState {
  scannerActiveOption: ScannerOption;
  sender: SenderState;
  receiver: ReceiverState;
}

export const initialTransactionState = {
  scannerActiveOption: ScannerOption.none,
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
    setScannerActiveOption(state: TransactionState, action: PayloadAction<ScannerOption>) {
      state.scannerActiveOption = action.payload;
    },
    setSenderSubAccount(state: TransactionState, action: PayloadAction<SubAccount>) {
      state.sender.subAccount = action.payload;
      state.sender.newAllowanceContact = {} as NewContact;
      state.sender.allowanceContactSubAccount = {} as ContactSubAccount;
      state.sender.scannerContact = "";
    },
    setSenderContact(state: TransactionState, action: PayloadAction<ContactSubAccount>) {
      state.sender.allowanceContactSubAccount = action.payload;
      state.sender.newAllowanceContact = {} as NewContact;
      state.sender.subAccount = {} as SubAccount;
      state.sender.scannerContact = "";
    },
    setSenderContactNew(state: TransactionState, action: PayloadAction<NewContact>) {
      state.sender.newAllowanceContact = action.payload;
      state.sender.allowanceContactSubAccount = {} as ContactSubAccount;
      state.sender.subAccount = {} as SubAccount;
      state.sender.scannerContact = "";
    },
    setSenderICRCScannerContact(state: TransactionState, action: PayloadAction<string>) {
      state.sender.scannerContact = action.payload;
      state.sender.allowanceContactSubAccount = {} as ContactSubAccount;
      state.sender.newAllowanceContact = {} as NewContact;
      state.sender.subAccount = {} as SubAccount;
    },
    setReceiverOwnSubAccount(state: TransactionState, action: PayloadAction<SubAccount>) {
      state.receiver.ownSubAccount = action.payload;
      state.receiver.thirdContactSubAccount = {} as ContactSubAccount;
      state.receiver.scannerContact = "";
      state.receiver.thirdNewContact = {} as NewContact;
    },
    setReceiverNewContact(state: TransactionState, action: PayloadAction<NewContact>) {
      state.receiver.thirdNewContact = action.payload;
      state.receiver.thirdContactSubAccount = {} as ContactSubAccount;
      state.receiver.scannerContact = "";
      state.receiver.ownSubAccount = {} as SubAccount;
    },
    setReceiverContact(state: TransactionState, action: PayloadAction<ContactSubAccount>) {
      state.receiver.thirdContactSubAccount = action.payload;
      state.receiver.scannerContact = "";
      state.receiver.thirdNewContact = {} as NewContact;
      state.receiver.ownSubAccount = {} as SubAccount;
    },
    setReceiverICRCScannerContact(state: TransactionState, action: PayloadAction<string>) {
      state.receiver.scannerContact = action.payload;
      state.receiver.thirdContactSubAccount = {} as ContactSubAccount;
      state.receiver.thirdNewContact = {} as NewContact;
      state.receiver.ownSubAccount = {} as SubAccount;
    },
  },
});

export const {
  setSenderAsset,
  setScannerActiveOption,
  setSenderSubAccount,
  setSenderContact,
  setSenderContactNew,
  setReceiverOwnSubAccount,
  setReceiverNewContact,
  setReceiverContact,
  setReceiverICRCScannerContact,
  setSenderICRCScannerContact,
} = transactionSlice.actions;

export default transactionSlice.reducer;
