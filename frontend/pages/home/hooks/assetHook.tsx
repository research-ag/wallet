import { defaultTokens } from "@/defaultTokens";
import contactCacheRefresh from "@pages/contacts/helpers/contacts";
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
import { useEffect, useState } from "react";
import { allowanceCacheRefresh } from "../helpers/allowanceCache";
import { db } from "@/database/db";

export const AssetHook = () => {
  const dispatch = useAppDispatch();
  const {
    // REMOVE: tokens,
    assets,
    assetLoading,
    selectedAsset,
    selectedAccount,
    acordeonIdx,
    tokensMarket,
  } = useAppSelector((state) => state.asset);

  const { userAgent } = useAppSelector((state) => state.auth);

  const deleteAsset = (symb: string, address: string) => {
    dispatch(removeToken(symb));
    db().deleteToken(address).then();
  };

  const [searchKey, setSearchKey] = useState("");
  const setAcordeonIdx = (assetIdx: string[]) => dispatch(setAcordeonAssetIdx(assetIdx));
  const [assetInfo, setAssetInfo] = useState<Asset | undefined>();

  const [editNameId, setEditNameId] = useState("");
  const [name, setName] = useState("");
  const [newSub, setNewSub] = useState<SubAccount | undefined>();
  const [hexChecked, setHexChecked] = useState<boolean>(false);

  const reloadBallance = async (updatedTokens?: Asset[]) => {
    dispatch(setLoading(true));

    await updateAllBalances({
      loading: true,
      myAgent: userAgent,
      // REMOVE: tokens: updatedTokens ? updatedTokens : tokens.length > 0 ? tokens : defaultTokens,
      // TODO: check what does this function do, and what it should receive.
      assets: updatedTokens ? updatedTokens : defaultTokens,
      basicSearch: false,
      fromLogin: true,
    });
    await allowanceCacheRefresh();
    await contactCacheRefresh();

    // REMOVE: if (updatedAssets?.tokens) dispatch(setReduxTokens(updatedAssets.tokens));
    dispatch(setLoading(false));
  };

  const getTotalAmountInCurrency = () => {
    let amount = 0;
    assets.map((tk) => {
      const market = tokensMarket.find((tm) => tm.symbol === tk.tokenSymbol);
      let assetTotal = BigInt(0);
      tk.subAccounts.map((sa) => {
        assetTotal = assetTotal + BigInt(sa.amount);
      });
      amount =
        amount + (market ? (Number(assetTotal.toString()) * market.price) / Math.pow(10, Number(tk.decimal)) : 0);
    });
    return Math.round(amount * 100) / 100;
  };

  useEffect(() => {
    const auxAssets = assets.filter((asset) => {
      let includeInSub = false;
      asset.subAccounts?.map((sa) => {
        if (sa.name.toLowerCase().includes(searchKey.toLowerCase())) includeInSub = true;
      });

      return asset.name?.toLowerCase().includes(searchKey.toLowerCase()) || includeInSub || searchKey === "";
    });

    if (auxAssets.length > 0) {
      const auxAccordion: string[] = [];
      auxAssets.map((ast) => {
        if (acordeonIdx.includes(ast.tokenSymbol)) auxAccordion.push(ast.tokenSymbol);
      });
      setAcordeonIdx(auxAccordion);

      const isSelected = auxAssets.find((ast) => ast.tokenSymbol === selectedAsset?.tokenSymbol);
      if (selectedAsset && !isSelected) {
        dispatch(setSelectedAsset(auxAssets[0]));
        auxAssets[0].subAccounts.length > 0 && dispatch(setSelectedAccount(auxAssets[0].subAccounts[0]));
      }
    } else {
      setAcordeonIdx([]);
    }
  }, [searchKey]);

  return {
    // REMOVE: tokens,
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
    editNameId,
    setEditNameId,
    name,
    setName,
    newSub,
    setNewSub,
    hexChecked,
    setHexChecked,

    reloadBallance,
    getTotalAmountInCurrency,
  };
};
