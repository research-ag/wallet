import { NotifyResponse } from "@candid/icrcx/service.did";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { ServiceAsset } from "@redux/models/ServiceModels";
import { notifyServiceAsset } from "@redux/services/ServiceActions";
import { addServiceAsset, removeServiceAsset } from "@redux/services/ServiceReducer";
import { useState } from "react";

export default function useServiceAsset() {
  const dispatch = useAppDispatch();
  const { assets } = useAppSelector((state) => state.asset.list);
  const { userAgent } = useAppSelector((state) => state.auth);

  const [assetsToAdd, setAssetsToAdd] = useState<ServiceAsset[]>([]);
  const [notifyRes, setNotifyRes] = useState<NotifyResponse>();

  const getAssetFromUserAssets = (tokenSymbol: string) => {
    return assets.find((ast) => ast.tokenSymbol === tokenSymbol);
  };

  const addAssetsToService = (servicePrin: string, assets: ServiceAsset[]) => {
    dispatch(addServiceAsset(servicePrin, assets));
  };
  const deleteAssetsToService = (servicePrin: string, asset: ServiceAsset) => {
    dispatch(removeServiceAsset(servicePrin, asset));
  };

  const notifyAsset = async (servicePrincipal: string, assetPrincipal: string) => {
    return await notifyServiceAsset(userAgent, servicePrincipal, assetPrincipal);
  };

  return {
    assetsToAdd,
    setAssetsToAdd,
    notifyRes,
    setNotifyRes,
    getAssetFromUserAssets,
    addAssetsToService,
    deleteAssetsToService,
    notifyAsset,
  };
}
