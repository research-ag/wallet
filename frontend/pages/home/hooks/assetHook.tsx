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
  const setAcordeonIdx = (assetIdx: string[]) => dispatch(setAcordeonAssetIdx(assetIdx));
  const [assetInfo, setAssetInfo] = useState<Asset | undefined>();

>>>>>>> df1b1296 (delete assets with 0 balance)
  const [editNameId, setEditNameId] = useState("");
  const [name, setName] = useState("");
  const [newSub, setNewSub] = useState<SubAccount | undefined>();
  const [hexChecked, setHexChecked] = useState<boolean>(false);

<<<<<<< HEAD
=======
  const reloadBallance = (tkns?: Token[]) => {
    dispatch(setLoading(true));
    updateAllBalances(true, userAgent, tkns ? tkns : tokens.length > 0 ? tokens : defaultTokens);
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
      asset.subAccounts.map((sa) => {
        if (sa.name.toLowerCase().includes(searchKey.toLowerCase())) includeInSub = true;
      });

      return asset.name.toLowerCase().includes(searchKey.toLowerCase()) || includeInSub || searchKey === "";
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

>>>>>>> 0a5fdf8e (auto selection subaccount from selected asset)
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
