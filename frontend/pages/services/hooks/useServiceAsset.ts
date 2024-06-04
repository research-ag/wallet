import {
  ServiceSubAccount,
  TransactionDrawer,
  TransactionReceiverOptionEnum,
  TransactionSenderOptionEnum,
} from "@/@types/transactions";
import { NotifyResponse } from "@candid/icrcx/service.did";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { Asset } from "@redux/models/AccountModels";
import { ServiceAsset } from "@redux/models/ServiceModels";
import { notifyServiceAsset } from "@redux/services/ServiceActions";
import { addServiceAsset, removeServiceAsset } from "@redux/services/ServiceReducer";
import {
  setReceiverOptionAction,
  setReceiverServiceAction,
  setSenderAssetAction,
  setSenderOptionAction,
  setSenderServiceAction,
  setTransactionDrawerAction,
} from "@redux/transaction/TransactionActions";
import { useState } from "react";

export default function useServiceAsset() {
  const dispatch = useAppDispatch();
  const { assets } = useAppSelector((state) => state.asset.list);
  const { userAgent } = useAppSelector((state) => state.auth);

  const [assetsToAdd, setAssetsToAdd] = useState<ServiceAsset[]>([]);
  const [notifyRes, setNotifyRes] = useState<NotifyResponse>();

  const getAssetFromUserAssets = (assetPrincipal: string) => {
    return assets.find((ast) => ast.address === assetPrincipal);
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

  const onDeposit = (selectedAsset: Asset, service: ServiceSubAccount) => {
    setSenderAssetAction(selectedAsset);
    setReceiverServiceAction(service);
    setTransactionDrawerAction(TransactionDrawer.SEND);
  };
  const onWithdraw = (selectedAsset: Asset, service: ServiceSubAccount) => {
    setSenderAssetAction(selectedAsset);
    setSenderOptionAction(TransactionSenderOptionEnum.Enum.service);
    setSenderServiceAction(service);
    setReceiverOptionAction(TransactionReceiverOptionEnum.Enum.own);
    setTransactionDrawerAction(TransactionDrawer.SEND);
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
    onDeposit,
    onWithdraw,
  };
}
