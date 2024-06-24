import { TransactionDrawer, TransactionState } from "@/@types/transactions";
import { Transaction, TransactionList } from "@redux/models/AccountModels";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const initialTransactionState: TransactionState = {
  transactionDrawer: TransactionDrawer.NONE,
  selectedTransaction: undefined,
  isInspectTransference: false,
  list: {
    transactions: [],
    txWorker: [],
    txLoad: false,
  },
};

const name = "transaction";

const transactionSlice = createSlice({
  name,
  initialState: initialTransactionState,
  reducers: {
    setTransactionDrawer(state: TransactionState, action: PayloadAction<TransactionDrawer>) {
      state.transactionDrawer = action.payload;
    },
    setIsInspectDetail(state: TransactionState, action: PayloadAction<boolean>) {
      state.isInspectTransference = action.payload;
    },
    setTransactions(state: TransactionState, action: PayloadAction<Array<Transaction[]>>) {
      state.list.transactions = action.payload;
    },
    // transactions
    setSelectedTransaction(state, action) {
      state.selectedTransaction = action.payload;
    },
    setTxWorker(state: TransactionState, action: PayloadAction<TransactionList[]>) {
      state.list.txWorker = action.payload;
    },
    updateTxWorkerSubAccount(state: TransactionState, action: PayloadAction<TransactionList>) {
      const { txWorker } = state.list;
      const { tx, symbol, tokenSymbol, subaccount } = action.payload;

      const txWorkerIndex = txWorker.findIndex(
        (worker) => worker.tokenSymbol === tokenSymbol && worker.subaccount === subaccount,
      );

      if (txWorkerIndex !== -1) {
        txWorker[txWorkerIndex].tx = tx;
      } else {
        txWorker.push({
          tx,
          symbol,
          tokenSymbol,
          subaccount,
        });
      }

      state.list.txWorker = txWorker;
    },
  },
});

export const {
  setIsInspectDetail,
  setTransactions,
  setTransactionDrawer,
  setSelectedTransaction,
  setTxWorker,
  updateTxWorkerSubAccount,
} = transactionSlice.actions;

export default transactionSlice.reducer;
