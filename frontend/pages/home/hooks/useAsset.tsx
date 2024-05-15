import { useAppDispatch, useAppSelector } from "@redux/Store";
import { useEffect } from "react";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { setSelectedAccount, setSelectedAsset } from "@redux/assets/AssetReducer";

export const UseAsset = () => {
  const dispatch = useAppDispatch();
  const { assets } = useAppSelector((state) => state.asset.list);
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset.helper);
  const changeSelectedAsset = (value: Asset) => dispatch(setSelectedAsset(value));
  const changeSelectedAccount = (value: SubAccount | undefined) => dispatch(setSelectedAccount(value));

  useEffect(() => {
    if (assets && assets.length > 0) {
      const isNewAsset = assets
        .map((currentAsset: Asset) => currentAsset?.tokenSymbol)
        .includes(selectedAsset?.tokenSymbol as string);
      if (!isNewAsset) {
        changeSelectedAsset(assets[0]);
      }
    }
  }, [assets]);

  useEffect(() => {
    if (selectedAsset) {
      if (selectedAsset.tokenSymbol !== selectedAccount?.symbol) changeSelectedAccount(selectedAsset.subAccounts[0]);
    }
  }, [selectedAsset]);

  return {};
};
