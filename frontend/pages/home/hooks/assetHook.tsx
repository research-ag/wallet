<<<<<<< HEAD
import { useState } from "react";
import { SubAccount } from "@redux/models/AccountModels";

export const AssetHook = () => {
=======
import { defaultTokens } from "@/const";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { updateAllBalances } from "@redux/assets/AssetActions";
import {
  removeToken,
  setAcordeonAssetIdx,
  setLoading,
  setSelectedAccount,
  setSelectedAsset,
} from "@redux/assets/AssetReducer";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { Token } from "@redux/models/TokenModels";
import { useEffect, useState } from "react";

export const AssetHook = () => {
  const dispatch = useAppDispatch();
  const { tokens, assets, assetLoading, selectedAsset, selectedAccount, acordeonIdx, tokensMarket } = useAppSelector(
    (state) => state.asset,
  );
  const { userAgent } = useAppSelector((state) => state.auth);
  const deleteAsset = (symb: string) => {
    dispatch(removeToken(symb));
  };
  const [searchKey, setSearchKey] = useState("");
  const setAcordeonIdx = (assetIdx: string) => dispatch(setAcordeonAssetIdx(assetIdx));
  const [assetInfo, setAssetInfo] = useState<Asset | undefined>();

>>>>>>> df1b1296 (delete assets with 0 balance)
  const [editNameId, setEditNameId] = useState("");
  const [name, setName] = useState("");
  const [newSub, setNewSub] = useState<SubAccount | undefined>();
  const [hexChecked, setHexChecked] = useState<boolean>(false);

  return {
<<<<<<< HEAD
=======
    tokens,
    assets,
    assetLoading,
    selectedAsset,
    selectedAccount,
    deleteAsset,
    searchKey,
    setSearchKey,
    acordeonIdx,
    setAcordeonIdx,
    assetInfo,
    setAssetInfo,
    tokensMarket,
>>>>>>> df1b1296 (delete assets with 0 balance)
    editNameId,
    setEditNameId,
    name,
    setName,
    newSub,
    setNewSub,
    hexChecked,
    setHexChecked,
  };
};
