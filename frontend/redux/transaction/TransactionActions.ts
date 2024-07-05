import store from "@redux/Store";
import { setIsInspectDetail, setTransactionDrawer } from "@/redux/transaction/TransactionReducer";

import { TransactionDrawer } from "@/@types/transactions";

export function setIsInspectDetailAction(isInspectDetail: boolean) {
  store.dispatch(setIsInspectDetail(isInspectDetail));
}
export function setTransactionDrawerAction(option: TransactionDrawer) {
  store.dispatch(setTransactionDrawer(option));
}
