import {
  ContactSubAccount,
  NewContact,
  TransactionDrawer,
  TransactionReceiverOption,
  TransactionReceiverOptionEnum,
  TransactionScannerOption,
  TransactionScannerOptionEnum,
  TransactionSenderOption,
  TransactionSenderOptionEnum,
  TransactionState,
  TransactionValidationErrorsType,
} from "@/@types/transactions";
import { SendingStatusEnum, SendingStatus } from "@/common/const";
import { Asset, SubAccount, TransactionList } from "@redux/models/AccountModels";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const initialTransactionState: TransactionState = {
  scannerActiveOption: TransactionScannerOptionEnum.Values.none,
  isInspectTransference: false,
  sendingStatus: SendingStatusEnum.Values.none,
  isLoading: false,
  sender: {
    senderOption: TransactionSenderOptionEnum.Values.own,
    isNewSender: false,
    allowanceContactSubAccount: {} as ContactSubAccount,
    subAccount: {} as SubAccount,
    newAllowanceContact: {} as NewContact,
    asset: {} as Asset,
  },
  receiver: {
    receiverOption: TransactionReceiverOptionEnum.Values.third,
    isManual: false,
    ownSubAccount: {} as SubAccount,
    thirdContactSubAccount: {} as ContactSubAccount,
    thirdNewContact: {} as NewContact,
  },
  initTime: new Date(),
  endTime: new Date(),
  transactionDrawer: TransactionDrawer.NONE,
  selectedTransaction: undefined,
  txLoad: false,
  amount: "",
  errors: [],
  transactions: [],
  txWorker: [],
};

const name = "transaction";

const transactionSlice = createSlice({
  name,
  initialState: initialTransactionState,
  reducers: {
    setTransactionDrawer(state: TransactionState, action: PayloadAction<TransactionDrawer>) {
      state.transactionDrawer = action.payload;
    },
    setSenderAsset(state: TransactionState, action: PayloadAction<Asset>) {
      state.sender.asset = action.payload;
      state.sender.subAccount = {} as SubAccount;
      state.sender.allowanceContactSubAccount = {} as ContactSubAccount;
      state.receiver.ownSubAccount = {} as SubAccount;
      state.receiver.thirdContactSubAccount = {} as ContactSubAccount;
    },
    setScannerActiveOption(state: TransactionState, action: PayloadAction<TransactionScannerOption>) {
      state.scannerActiveOption = action.payload;
    },
    setIsInspectDetail(state: TransactionState, action: PayloadAction<boolean>) {
      state.isInspectTransference = action.payload;
    },
    setSenderOption(state: TransactionState, action: PayloadAction<TransactionSenderOption>) {
      state.sender.senderOption = action.payload;
    },
    setIsNewSender(state: TransactionState, action: PayloadAction<boolean>) {
      state.sender.isNewSender = action.payload;
    },
    setAmount(state: TransactionState, action: PayloadAction<string>) {
      state.amount = action.payload;
    },
    setError(state: TransactionState, action: PayloadAction<TransactionValidationErrorsType>) {
      if (!state.errors?.includes(action.payload)) {
        state.errors = [...(state.errors ?? []), action.payload];
      }
    },
    setIsLoading(state: TransactionState, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSendingStatus(state: TransactionState, action: PayloadAction<SendingStatus>) {
      state.sendingStatus = action.payload;
    },
    removeError(state: TransactionState, action: PayloadAction<TransactionValidationErrorsType>) {
      state.errors = state.errors?.filter((error) => error !== action.payload);
    },
    setFullErrors(state: TransactionState, action: PayloadAction<TransactionValidationErrorsType[]>) {
      state.errors = action.payload;
    },
    setSenderSubAccount(state: TransactionState, action: PayloadAction<SubAccount>) {
      state.sender.subAccount = action.payload;
      state.sender.newAllowanceContact = {} as NewContact;
      state.sender.allowanceContactSubAccount = {} as ContactSubAccount;
    },
    setSenderContact(state: TransactionState, action: PayloadAction<ContactSubAccount>) {
      state.sender.allowanceContactSubAccount = action.payload;
      state.sender.newAllowanceContact = {} as NewContact;
      state.sender.subAccount = {} as SubAccount;
    },
    setSenderContactNew(state: TransactionState, action: PayloadAction<NewContact>) {
      state.sender.newAllowanceContact = action.payload;
      state.sender.allowanceContactSubAccount = {} as ContactSubAccount;
      state.sender.subAccount = {} as SubAccount;
    },
    setReceiverOption(state: TransactionState, action: PayloadAction<TransactionReceiverOption>) {
      state.receiver.receiverOption = action.payload;
    },
    setReceiverIsManual(state: TransactionState, action: PayloadAction<boolean>) {
      state.receiver.isManual = action.payload;
    },
    setReceiverOwnSubAccount(state: TransactionState, action: PayloadAction<SubAccount>) {
      state.receiver.ownSubAccount = action.payload;
      state.receiver.thirdContactSubAccount = {} as ContactSubAccount;
      state.receiver.thirdNewContact = {} as NewContact;
    },
    setReceiverNewContact(state: TransactionState, action: PayloadAction<NewContact>) {
      state.receiver.thirdNewContact = action.payload;
      state.receiver.thirdContactSubAccount = {} as ContactSubAccount;
      state.receiver.ownSubAccount = {} as SubAccount;
    },
    setReceiverContact(state: TransactionState, action: PayloadAction<ContactSubAccount>) {
      state.receiver.thirdContactSubAccount = action.payload;
      state.receiver.thirdNewContact = {} as NewContact;
      state.receiver.ownSubAccount = {} as SubAccount;
    },
    clearSender(state: TransactionState) {
      state.sender.newAllowanceContact = {} as NewContact;
      state.errors = [];
      state.sender.allowanceContactSubAccount = {} as ContactSubAccount;
      state.sender.subAccount = {} as SubAccount;
    },
    clearReceiver(state: TransactionState) {
      state.receiver.thirdContactSubAccount = {} as ContactSubAccount;
      state.errors = [];
      state.receiver.thirdNewContact = {} as NewContact;
      state.receiver.ownSubAccount = {} as SubAccount;
    },
    setInitTime(state: TransactionState, action: PayloadAction<Date>) {
      state.initTime = action.payload;
    },
    setEndTime(state: TransactionState, action: PayloadAction<Date>) {
      state.endTime = action.payload;
    },
    resetSendState(state: TransactionState) {
      state.amount = initialTransactionState?.amount;
      state.errors = initialTransactionState?.errors;
      state.sender = initialTransactionState?.sender;
      state.receiver = initialTransactionState?.receiver;
      state.sendingStatus = initialTransactionState?.sendingStatus;
      state.scannerActiveOption = initialTransactionState?.scannerActiveOption;
      state.isInspectTransference = initialTransactionState?.isInspectTransference;
    },
    setTransactions(state, action) {
      state.transactions = action.payload;
    },
    // transactions
    setSelectedTransaction(state, action) {
      state.selectedTransaction = action.payload;
    },
    setTxWorker(state, action) {
      const txList = [...state.txWorker];

      const idx = txList.findIndex((tx: TransactionList) => {
        return tx.symbol === action.payload.symbol && tx.subaccount === action.payload.subaccount;
      });
      const auxTx = txList.find((tx: TransactionList) => {
        return tx.symbol === action.payload.symbol && tx.subaccount === action.payload.subaccount;
      });

      if (!auxTx) {
        txList.push(action.payload);
      } else {
        txList[idx] = action.payload;
      }

      state.txWorker = txList;
    },
    addTxWorker(state, action: PayloadAction<TransactionList>) {
      state.txWorker = [...state.txWorker, action.payload];
    },
  },
});

export const {
  setSenderAsset,
  setSenderOption,
  setIsNewSender,
  setIsInspectDetail,
  setScannerActiveOption,
  setAmount,
  setIsLoading,
  setError,
  setFullErrors,
  setSendingStatus,
  removeError,
  setSenderSubAccount,
  setSenderContact,
  setSenderContactNew,
  setReceiverIsManual,
  setReceiverOption,
  setReceiverOwnSubAccount,
  setReceiverNewContact,
  setReceiverContact,
  clearSender,
  setTransactions,
  clearReceiver,
  resetSendState,
  setInitTime,
  setEndTime,
  setTransactionDrawer,
  setSelectedTransaction,
  setTxWorker,
  addTxWorker,
} = transactionSlice.actions;

export default transactionSlice.reducer;
