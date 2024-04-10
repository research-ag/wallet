import { defaultTokens } from "@/defaultTokens";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { updateAllBalances } from "@redux/assets/AssetActions";
import { setAccordionAssetIdx, setSelectedAccount, setSelectedAsset } from "@redux/assets/AssetReducer";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { useEffect, useState } from "react";
import { allowanceCacheRefresh } from "../helpers/allowanceCache";
import contactCacheRefresh from "@pages/contacts/helpers/contactCacheRefresh";
import { setAppDataRefreshing } from "@redux/common/CommonReducer";

export const AssetHook = () => {
  const dispatch = useAppDispatch();
  const { assets, selectedAsset, selectedAccount, accordionIndex, tokensMarket } = useAppSelector(
    (state) => state.asset,
  );
  const { isAppDataFreshing } = useAppSelector((state) => state.common);

  const { userAgent } = useAppSelector((state) => state.auth);

  const [searchKey, setSearchKey] = useState("");
  const setAcordeonIdx = (assetIdx: string[]) => dispatch(setAccordionAssetIdx(assetIdx));
  const [assetInfo, setAssetInfo] = useState<Asset | undefined>();

  const [editNameId, setEditNameId] = useState("");
  const [name, setName] = useState("");
  const [newSub, setNewSub] = useState<SubAccount | undefined>();
  const [hexChecked, setHexChecked] = useState<boolean>(false);

  const reloadBallance = async (updatedAssets?: Asset[]) => {
    dispatch(setAppDataRefreshing(true));

    await updateAllBalances({
      loading: true,
      myAgent: userAgent,
      assets: updatedAssets ? updatedAssets : defaultTokens,
      fromLogin: true,
    });

    await allowanceCacheRefresh();
    await contactCacheRefresh();
    dispatch(setAppDataRefreshing(false));
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
        if (accordionIndex.includes(ast.tokenSymbol)) auxAccordion.push(ast.tokenSymbol);
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
    assets,
    isAppDataFreshing,
    selectedAsset,
    selectedAccount,
    searchKey,
    setSearchKey,
    accordionIndex,
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
