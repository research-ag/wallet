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
  setReceiverICRCScannerContact,
  setSenderICRCScannerContact,
} from "./TransactionReducer";

import { Asset, SubAccount } from "@redux/models/AccountModels";
import { ContactSubAccount, NewContact, ScannerOption } from "@/@types/transactions";

export function setSenderAssetAction(asset: Asset) {
  store.dispatch(setSenderAsset(asset));
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
export function setReceiverICRCScannerContactAction(icrcAccount: string) {
  store.dispatch(setReceiverICRCScannerContact(icrcAccount));
}
export function setSenderICRCScannerContactAction(icrcAccount: string) {
  store.dispatch(setSenderICRCScannerContact(icrcAccount));
}
