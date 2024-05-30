import { useAppDispatch, useAppSelector } from "@redux/Store";
import { ServiceAsset } from "@redux/models/ServiceModels";
import { addServiceAsset, removeServiceAsset } from "@redux/services/ServiceReducer";
import { useState } from "react";

export default function useServiceAsset() {
  const dispatch = useAppDispatch();
  const { assets } = useAppSelector((state) => state.asset.list);

  const [assetsToAdd, setAssetsToAdd] = useState<ServiceAsset[]>([]);

  const getAssetFromUserAssets = (tokenSymbol: string) => {
    return assets.find((ast) => ast.tokenSymbol === tokenSymbol);
  };

  const addAssetsToService = (servicePrin: string, assets: ServiceAsset[]) => {
    dispatch(addServiceAsset(servicePrin, assets));
  };
  const deleteAssetsToService = (servicePrin: string, asset: ServiceAsset) => {
    dispatch(removeServiceAsset(servicePrin, asset));
  };

  return { assetsToAdd, setAssetsToAdd, getAssetFromUserAssets, addAssetsToService, deleteAssetsToService };
}
