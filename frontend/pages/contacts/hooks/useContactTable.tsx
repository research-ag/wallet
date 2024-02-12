import { DeleteContactTypeEnum } from "@/const";
import { useAppDispatch } from "@redux/Store";

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

import { useState } from "react";

export default function useContactTable() {
  const dispatch = useAppDispatch();
  const [isPending, setIsPending] = useState(false);

  // edit contact up contact list
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
    allowance: { allowance: string; expires_at: string } | undefined,
  ) => {
    dispatch(editContactSubacc(principal, tokenSymbol, subIndex, newName, newIndex, allowance));
  };

  const addCntctSubacc = (
    principal: string,
    tokenSymbol: string,
    newName: string,
    newIndex: string,
    subAccountId: string,
    allowance?: { allowance: string; expires_at: string },
  ) => {
    dispatch(addContactSubacc(principal, tokenSymbol, newName, newIndex, subAccountId, allowance));
  };

  // contact list
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<DeleteContactTypeEnum>(DeleteContactTypeEnum.Enum.ASSET);
  const [selCntcPrinAddAsst, setSelCntcPrinAddAsst] = useState("");
  const [selContactPrin, setSelContactPrin] = useState("");
  const [openAssetsPrin, setOpenAssetsPrin] = useState("");
  const [openSubaccToken, setOpenSubaccToken] = useState("");

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
  // INFO: controls that sub account that is bing edited
  const [selSubaccIdx, setSelSubaccIdx] = useState("");
  // INFO: controls the data that is bing edited
  const [subaccEdited, setSubaccEdited] = useState<SubAccountContact>({
    name: "",
    subaccount_index: "",
    sub_account_id: "",
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

  return {
    isPending,
    setIsPending,
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
    addSub,
    setAddSub,
  };
}
