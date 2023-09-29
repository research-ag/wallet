import { DeleteContactTypeEnum } from "@/const";
import { hexToNumber } from "@/utils";
import { decodeIcrcAccount } from "@dfinity/ledger";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import {
  addAssetToContact,
  addContactSubacc,
  editContact,
  editContactSubacc,
  removeContact,
  removeContactAsset,
  removeContactSubacc,
} from "@redux/contacts/ContactsReducer";
import {
  AssetContact,
  Contact,
  ContactErr,
  NewContactSubAccount,
  SubAccountContact,
  SubAccountContactErr,
} from "@redux/models/ContactsModels";
import bigInt from "big-integer";
import { useState } from "react";

export const useContacts = () => {
  const dispatch = useAppDispatch();

  // reducer
  const { contacts } = useAppSelector((state) => state.contacts);
  const updateContact = (editedContact: Contact, pastPrincipal: string) =>
    dispatch(editContact(editedContact, pastPrincipal));
  const addAsset = (asset: AssetContact[], pastPrincipal: string) => dispatch(addAssetToContact(asset, pastPrincipal));
  const removeCntct = (principal: string) => dispatch(removeContact(principal));
  const removeAsset = (principal: string, tokenSymbol: string) => dispatch(removeContactAsset(principal, tokenSymbol));
  const removeSubacc = (principal: string, tokenSymbol: string, subIndex: string) =>
    dispatch(removeContactSubacc(principal, tokenSymbol, subIndex));
  const editCntctSubacc = (
    principal: string,
    tokenSymbol: string,
    subIndex: string,
    newName: string,
    newIndex: string,
  ) => dispatch(editContactSubacc(principal, tokenSymbol, subIndex, newName, newIndex));
  const addCntctSubacc = (principal: string, tokenSymbol: string, newName: string, newIndex: string) =>
    dispatch(addContactSubacc(principal, tokenSymbol, newName, newIndex));
  // filter
  const [assetOpen, setAssetOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [assetFilter, setAssetFilter] = useState<string[]>([]);

  // new contact
  const [newContact, setNewContact] = useState<Contact>({
    name: "",
    principal: "",
    assets: [],
  });
  const [selAstContact, setSelAstContact] = useState("");
  const [newSubAccounts, setNewSubaccounts] = useState<SubAccountContact[]>([]);
  const [newContactErr, setNewContactErr] = useState("");
  const [newContactNameErr, setNewContactNameErr] = useState(false);
  const [newContactPrinErr, setNewContactPrinErr] = useState(false);
  const [newContactSubNameErr, setNewContactSubNameErr] = useState<number[]>([]);
  const [newContactSubIdErr, setNewContactSubIdErr] = useState<number[]>([]);
  const [newContactShowErr, setNewContactShowErr] = useState(false);

  // contact list
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<DeleteContactTypeEnum>(DeleteContactTypeEnum.Enum.ASSET);
  const [selCntcPrinAddAsst, setSelCntcPrinAddAsst] = useState("");
  const [selContactPrin, setSelContactPrin] = useState("");
  const [openAssetsPrin, setOpenAssetsPrin] = useState("");
  const [openSubaccToken, setOpenSubaccToken] = useState("");
  const [selSubaccIdx, setSelSubaccIdx] = useState("");
  const [contactEdited, setContactEdited] = useState<Contact>({
    name: "",
    principal: "",
    assets: [],
  });
  const [addSub, setAddSub] = useState(false);
  const [contactEditedErr, setContactEditedErr] = useState<ContactErr>({
    name: false,
    principal: false,
  });
  const [subaccEdited, setSubaccEdited] = useState<SubAccountContact>({
    name: "",
    subaccount_index: "",
  });
  const [subaccEditedErr, setSubaccEditedErr] = useState<SubAccountContactErr>({
    name: false,
    subaccount_index: false,
  });

  const [deleteObject, setDeleteObject] = useState<NewContactSubAccount>({
    principal: "",
    name: "",
    tokenSymbol: "",
    symbol: "",
    subaccIdx: "",
    subaccName: "",
    totalAssets: 0,
    TotalSub: 0,
  });

  const checkPrincipalValid = (principal: string) => {
    if (principal.trim() === "") return false;
    try {
      decodeIcrcAccount(principal);
    } catch {
      return false;
    }
    return contacts.find((ctc) => ctc.principal === principal) ? false : true;
  };
  const checkSubIndxValid = (idx: string, subs: SubAccountContact[]) => {
    if (idx.trim() === "") return false;
    return subs.find((sa) => hexToNumber(`0x${sa.subaccount_index}`)?.eq(hexToNumber(`0x${idx}`) || bigInt()))
      ? false
      : true;
  };

  return {
    contacts,
    assetOpen,
    setAssetOpen,
    searchKey,
    setSearchKey,
    assetFilter,
    setAssetFilter,
    addOpen,
    setAddOpen,
    newContact,
    setNewContact,
    selAstContact,
    setSelAstContact,
    newSubAccounts,
    setNewSubaccounts,
    newContactErr,
    setNewContactErr,
    newContactNameErr,
    setNewContactNameErr,
    newContactPrinErr,
    setNewContactPrinErr,
    newContactSubNameErr,
    setNewContactSubNameErr,
    newContactSubIdErr,
    setNewContactSubIdErr,
    selCntcPrinAddAsst,
    setSelCntcPrinAddAsst,
    selContactPrin,
    setSelContactPrin,
    contactEdited,
    setContactEdited,
    openAssetsPrin,
    setOpenAssetsPrin,
    openSubaccToken,
    setOpenSubaccToken,
    updateContact,
    selSubaccIdx,
    setSelSubaccIdx,
    subaccEdited,
    setSubaccEdited,
    addAsset,
    deleteModal,
    setDeleteModal,
    deleteType,
    setDeleteType,
    deleteObject,
    setDeleteObject,
    editCntctSubacc,
    addCntctSubacc,
    removeCntct,
    removeAsset,
    removeSubacc,
    contactEditedErr,
    setContactEditedErr,
    subaccEditedErr,
    setSubaccEditedErr,
    checkPrincipalValid,
    checkSubIndxValid,
    addSub,
    setAddSub,
    newContactShowErr,
    setNewContactShowErr,
  };
};
