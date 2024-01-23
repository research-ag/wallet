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
  setErrors,
} from "./TransactionReducer";

import { Asset, SubAccount } from "@redux/models/AccountModels";
import {
  ContactSubAccount,
  KeyValidationErrors,
  NewContact,
  ReceiverOption,
  ScannerOption,
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
export function setReceiverOptionAction(option: ReceiverOption) {
  store.dispatch(setReceiverOption(option));
}
export function setErrorsAction(errors: KeyValidationErrors[]) {
  store.dispatch(setErrors(errors));
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
export function setScannerActiveOptionAction(scannerActiveOption: ScannerOption) {
  store.dispatch(setScannerActiveOption(scannerActiveOption));
}
export function clearSenderAction() {
  store.dispatch(clearSender());
}
export function clearReceiverAction() {
  store.dispatch(clearReceiver());
}
