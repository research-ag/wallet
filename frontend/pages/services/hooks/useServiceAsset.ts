import { ServiceSubAccount, TransactionDrawer } from "@/@types/transactions";
import { NotifyResult } from "@candid/icrcx/service.did";
import { getAssetDetails } from "@common/libs/icrc";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { Asset } from "@redux/models/AccountModels";
import { ServiceAsset } from "@redux/models/ServiceModels";
import { getCreditBalance, notifyServiceAsset } from "@redux/services/ServiceActions";
import { addServiceAsset, removeServiceAsset, updateServiceAssetAmounts } from "@redux/services/ServiceReducer";
import {
  // setReceiverOptionAction,
  // setReceiverServiceAction,
  // setSenderAssetAction,
  // setSenderOptionAction,
  // setSenderServiceAction,
  setTransactionDrawerAction,
} from "@redux/transaction/TransactionActions";
import { useState } from "react";
import { db } from "@/database/db";
import { TransferFromTypeEnum, TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";

export default function useServiceAsset() {
  const dispatch = useAppDispatch();
  const { setTransferState } = useTransfer();
  const { assets } = useAppSelector((state) => state.asset.list);
  const { userAgent, authClient } = useAppSelector((state) => state.auth);

  const [assetsToAdd, setAssetsToAdd] = useState<ServiceAsset[]>([]);
  const [notifyRes, setNotifyRes] = useState<NotifyResult>();

  const getAssetFromUserAssets = (assetPrincipal: string) => {
    return assets.find((ast) => ast.address === assetPrincipal);
  };

  const addAssetsToService = (servicePrin: string, assets: ServiceAsset[]) => {
    dispatch(addServiceAsset(servicePrin, assets));
  };
  const deleteAssetsToService = (servicePrin: string, asset: ServiceAsset) => {
    dispatch(removeServiceAsset(servicePrin, asset));
  };

  const addAssetsToWallet = async (serviceAssets: ServiceAsset[]) => {
    const updatedAssets = await Promise.all(
      serviceAssets.map(async (newAsset, k) => {
        const idxSorting = assets.length > 0 ? [...assets].sort((a, b) => b.sortIndex - a.sortIndex) : [];
        const sortIndex = (idxSorting.length > 0 ? idxSorting[0]?.sortIndex : 0) + 1 + k;
        return await getAssetDetails({
          canisterId: newAsset.principal,
          includeDefault: true,
          customName: newAsset.tokenName,
          customSymbol: newAsset.tokenSymbol,
          supportedStandard: undefined,
          sortIndex,
          ledgerIndex: undefined,
        });
      }),
    );
    await Promise.all(
      updatedAssets.map(async (ast) => {
        if (ast) {
          await db().addAsset(ast, { sync: true });
        }
      }),
    );
  };

  const notifyAsset = async (servicePrincipal: string, assetPrincipal: string, update: boolean) => {
    const res = await notifyServiceAsset(userAgent, servicePrincipal, assetPrincipal);
    const isOk = (res as any).Ok ? true : false;
    if (update && isOk) {
      const data = await getCreditBalance(userAgent, servicePrincipal, assetPrincipal);
      dispatch(updateServiceAssetAmounts(servicePrincipal, assetPrincipal, data.credit, data.balance));
    }
    return res;
  };

  const onDeposit = (selectedAsset: Asset, service: ServiceSubAccount) => {
    let fromPrincipal = "";
    let fromSubAccount = "";
    if (selectedAsset.subAccounts.length === 1) {
      fromPrincipal = authClient;
      fromSubAccount = selectedAsset.subAccounts[0].sub_account_id;
    }

    setTransferState({
      tokenSymbol: selectedAsset.tokenSymbol,
      fromType: TransferFromTypeEnum.own,
      fromPrincipal,
      fromSubAccount,
      toType: TransferToTypeEnum.thirdPartyService,
      toPrincipal: service.servicePrincipal,
      toSubAccount: service.subAccountId,
      amount: "",
      usdAmount: "",
      duration: "",
    });
    setTransactionDrawerAction(TransactionDrawer.SEND);
  };

  const onWithdraw = (selectedAsset: Asset, service: ServiceSubAccount) => {
    setTransferState({
      tokenSymbol: selectedAsset.tokenSymbol,
      fromType: TransferFromTypeEnum.service,
      fromPrincipal: service.servicePrincipal,
      fromSubAccount: service.subAccountId,
      toType: TransferToTypeEnum.own,
      toPrincipal: "",
      toSubAccount: "",
      amount: "",
      usdAmount: "",
      duration: "",
    });
    setTransactionDrawerAction(TransactionDrawer.SEND);
  };

  return {
    assetsToAdd,
    setAssetsToAdd,
    notifyRes,
    setNotifyRes,
    getAssetFromUserAssets,
    addAssetsToService,
    addAssetsToWallet,
    deleteAssetsToService,
    notifyAsset,
    onDeposit,
    onWithdraw,
  };
}
