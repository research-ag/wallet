import store from "@redux/Store";
import {
  setSenderAsset,
  setSenderSubAccount,
  setSenderContact,
  setSenderContactNew,
  setReceiverOwnSubAccount,
  setReceiverNewContact,
  setReceiverContact,
  setScannerActiveOption,
  clearSender,
  clearReceiver,
  setSenderOption,
  setIsNewSender,
  setReceiverOption,
  setReceiverIsManual,
  setIsInspectDetail,
} from "./TransactionReducer";

import { Asset, SubAccount } from "@redux/models/AccountModels";
import {
  ContactSubAccount,
  NewContact,
  TransactionReceiverOption,
  TransactionScannerOption,
  TransactionSenderOption,
} from "@/@types/transactions";

export function setSenderAssetAction(asset: Asset) {
  store.dispatch(setSenderAsset(asset));
}
export function setSenderOptionAction(option: TransactionSenderOption) {
  store.dispatch(setSenderOption(option));
}
export function setIsNewSenderAction(isNewSender: boolean) {
  store.dispatch(setIsNewSender(isNewSender));
}
export function setIsInspectDetailAction(isInspectDetail: boolean) {
  store.dispatch(setIsInspectDetail(isInspectDetail));
}
export function setSenderSubAccountAction(subAccount: SubAccount) {
  store.dispatch(setSenderSubAccount(subAccount));
}
export function setSenderContactAction(contact: ContactSubAccount) {
  store.dispatch(setSenderContact(contact));
}
export function setSenderContactNewAction(newContact: NewContact) {
  store.dispatch(setSenderContactNew(newContact));
}
export function setReceiverOptionAction(option: TransactionReceiverOption) {
  store.dispatch(setReceiverOption(option));
}
export function setReceiverIsManualAction(isManual: boolean) {
  store.dispatch(setReceiverIsManual(isManual));
}
export function setReceiverOwnSubAccountAction(subAccount: SubAccount) {
  store.dispatch(setReceiverOwnSubAccount(subAccount));
}
export function setReceiverNewContactAction(newContact: NewContact) {
  store.dispatch(setReceiverNewContact(newContact));
}
export function setReceiverContactAction(contact: ContactSubAccount) {
  store.dispatch(setReceiverContact(contact));
}
export function setScannerActiveOptionAction(scannerActiveOption: TransactionScannerOption) {
  store.dispatch(setScannerActiveOption(scannerActiveOption));
}
export function clearSenderAction() {
  store.dispatch(clearSender());
}
export function clearReceiverAction() {
  store.dispatch(clearReceiver());
}
