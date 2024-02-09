import {
  ContactSubAccount,
  NewContact,
  ReceiverState,
  SenderState,
  TransactionReceiverOption,
  TransactionReceiverOptionEnum,
  TransactionScannerOption,
  TransactionScannerOptionEnum,
  TransactionSenderOption,
  TransactionSenderOptionEnum,
  TransactionValidationErrorsType,
} from "@/@types/transactions";
import { SendingStatusEnum, SendingStatus } from "@/const";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface TransactionState {
  scannerActiveOption: TransactionScannerOption;
  isLoading: boolean;
  isInspectTransference: boolean;
  sendingStatus: SendingStatus;
  sender: SenderState;
  receiver: ReceiverState;
  errors?: TransactionValidationErrorsType[];
  amount?: string;
  initTime: Date;
  endTime: Date;
}

export const initialTransactionState = {
  scannerActiveOption: TransactionScannerOptionEnum.Values.none,
  isInspectTransference: false,
  sendingStatus: SendingStatusEnum.Values.none,
  isLoading: false,
  sender: {
    senderOption: TransactionSenderOptionEnum.Values.own,
    isNewSender: false,
  },
  receiver: {
    receiverOption: TransactionReceiverOptionEnum.Values.third,
    isManual: false,
  },
  initTime: new Date(),
  endTime: new Date(),
} as TransactionState;

const name = "transaction";

const transactionSlice = createSlice({
  name,
  initialState: initialTransactionState,
  reducers: {
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
  clearReceiver,
  resetSendState,
  setInitTime,
  setEndTime,
} = transactionSlice.actions;

export default transactionSlice.reducer;
