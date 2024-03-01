import { DeleteContactTypeEnum } from "@/const";
import { hexToNumber } from "@/utils";
import bigInt from "big-integer";
import {
  AssetContact,
  Contact,
  ContactErr,
  NewContactSubAccount,
  SubAccountContact,
  SubAccountContactErr,
} from "@redux/models/ContactsModels";
import { db } from "@/database/db";

import { useState } from "react";

export default function useContactTable() {
  const [isPending, setIsPending] = useState(false);

  const updateContact = async (editedContact: Contact, pastPrincipal: string) =>
    await db().updateContact(pastPrincipal, editedContact);

  const addAsset = async (asset: AssetContact[], pastPrincipal: string) => {
    const contact = await db().getContact(pastPrincipal);
    contact &&
      (await db().updateContact(pastPrincipal, {
        ...contact,
        assets: [...contact.assets, ...asset],
      }));
  };

  const removeCntct = async (principal: string) => await db().deleteContact(principal);
  const removeAsset = async (principal: string, tokenSymbol: string) => {
    const contact = await db().getContact(principal);
    contact &&
      (await db().updateContact(principal, {
        ...contact,
        assets: contact.assets.filter((asst) => asst.tokenSymbol !== tokenSymbol),
      }));
  };
  const removeSubacc = async (principal: string, tokenSymbol: string, subIndex: string) => {
    const contact = await db().getContact(principal);
    contact &&
      (await db().updateContact(principal, {
        ...contact,
        assets: contact.assets.map((asset) => {
          if (asset.tokenSymbol !== tokenSymbol) {
            return asset;
          } else {
            return {
              ...asset,
              subaccounts: asset.subaccounts.filter((subAccount) => subAccount.subaccount_index !== subIndex),
            };
          }
        }),
      }));
  };

  const editCntctSubacc = async (
    principal: string,
    tokenSymbol: string,
    subIndex: string,
    newName: string,
    newIndex: string,
    allowance: { allowance: string; expires_at: string } | undefined,
  ) => {
    const contact = await db().getContact(principal);
    contact &&
      (await db().updateContact(principal, {
        ...contact,
        assets: contact.assets.map((asset) => {
          if (asset.tokenSymbol !== tokenSymbol) {
            return asset;
          } else {
            return {
              ...asset,
              subaccounts: asset.subaccounts
                .map((subAccount) => {
                  if (subAccount.subaccount_index !== subIndex) return subAccount;
                  else {
                    return {
                      name: newName,
                      subaccount_index: newIndex,
                      sub_account_id: `0x${newIndex}`,
                      allowance: allowance,
                    };
                  }
                })
                .sort(
                  (a, b) =>
                    hexToNumber(`0x${a.subaccount_index}`)?.compare(
                      hexToNumber(`0x${b.subaccount_index}`) || bigInt(0),
                    ) || 0,
                ),
            };
          }
        }),
      }));
  };

  const addCntctSubacc = async (
    principal: string,
    tokenSymbol: string,
    newName: string,
    newIndex: string,
    subAccountId: string,
    allowance?: { allowance: string; expires_at: string },
  ) => {
    const contact = await db().getContact(principal);
    contact &&
      (await db().updateContact(principal, {
        ...contact,
        assets: contact.assets.map((asset) => {
          if (asset.tokenSymbol !== tokenSymbol) {
            return asset;
          } else {
            return {
              ...asset,
              subaccounts: [
                ...asset.subaccounts,
                {
                  name: newName,
                  subaccount_index: newIndex,
                  sub_account_id: subAccountId,
                  allowance: allowance,
                },
              ].sort(
                (a, b) =>
                  hexToNumber(`0x${a.subaccount_index}`)?.compare(
                    hexToNumber(`0x${b.subaccount_index}`) || bigInt(0),
                  ) || 0,
              ),
            };
          }
        }),
      }));
  };

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

  const [selSubaccIdx, setSelSubaccIdx] = useState("");
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
