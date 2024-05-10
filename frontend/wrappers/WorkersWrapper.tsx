import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { setAppDataRefreshing } from "@redux/common/CommonReducer";
import { db } from "@/database/db";
import { updateAllBalances } from "@redux/assets/AssetActions";
import { AssetSymbolEnum } from "@common/const";
import { Asset } from "@redux/models/AccountModels";
import { getAllTransactionsICP, getAllTransactionsICRC1 } from "@pages/home/helpers/requests";
import { setTxWorker } from "@redux/transaction/TransactionReducer";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import { allowanceCacheRefresh } from "@pages/allowances/helpers/cache";
import contactCacheRefresh from "@pages/contacts/helpers/contactCacheRefresh";

const WORKER_INTERVAL = 10 * 60 * 1000; // 10 minutes

export default function WorkersWrapper({ children }: { children: React.ReactNode }) {
  const { isAppDataFreshing } = useAppSelector((state) => state.common);
  const { userAgent } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { assets } = useAppSelector((state) => state.asset.list);
  const initialFetch = useRef<boolean>(true);

  async function fetchICPTransactions(asset: Asset) {
    const txTransactions = [];

    for (const subAccount of asset.subAccounts) {
      const transactions = await getAllTransactionsICP({
        subaccount_index: subAccount.sub_account_id,
        isOGY: asset.tokenSymbol === AssetSymbolEnum.Enum.OGY,
      });

      txTransactions.push({
        tx: transactions,
        symbol: asset.symbol,
        tokenSymbol: asset.tokenSymbol,
        subaccount: subAccount.sub_account_id,
      });
    }

    return txTransactions;
  }

  async function fetchICRC1Transactions(asset: Asset, selectedToken: Asset) {
    const txTransactions = [];

    for (const subAccount of asset.subAccounts) {
      const transactions = await getAllTransactionsICRC1({
        canisterId: selectedToken.index || "",
        subaccount_index: hexToUint8Array(subAccount.sub_account_id || "0x0"),
        assetSymbol: asset.tokenSymbol,
        canister: selectedToken.address,
        subNumber: subAccount.sub_account_id,
      });

      txTransactions.push({
        tx: transactions,
        symbol: asset.symbol,
        tokenSymbol: asset.tokenSymbol,
        subaccount: subAccount.sub_account_id,
      });
    }

    return txTransactions;
  }

  async function transactionCacheRefresh() {
    try {
      const txWorker = [];

      for (const asset of assets) {
        if (asset.tokenSymbol === AssetSymbolEnum.Enum.ICP || asset.tokenSymbol === AssetSymbolEnum.Enum.OGY) {
          const transactionsBySubAccounts = await fetchICPTransactions(asset);
          txWorker.push(...transactionsBySubAccounts);
        } else {
          const selectedAsset = assets.find((currentAsset) => currentAsset.symbol === asset.symbol);
          if (selectedAsset) {
            const transactoinsBySubaccount = await fetchICRC1Transactions(asset, selectedAsset);
            txWorker.push(...transactoinsBySubaccount);
          }
        }
      }

      dispatch(setTxWorker(txWorker));
    } catch (error) {
      console.error("Error in transactionCacheRefresh worker", error);
    }
  }

  async function loadInitialData() {
    if (!initialFetch.current) return;
    initialFetch.current = false;

    dispatch(setAppDataRefreshing(true));

    const assets = await db().getAssets();
    await updateAllBalances({
      loading: true,
      fromLogin: true,
      myAgent: userAgent,
      assets,
      basicSearch: false,
    });

    await transactionCacheRefresh();
    await allowanceCacheRefresh();
    await contactCacheRefresh();

    dispatch(setAppDataRefreshing(false));
  }

  async function workerDataRefresh() {
    if (!isAppDataFreshing) {
      console.log("RUNNING WORKER");

      dispatch(setAppDataRefreshing(true));

      const assets = await db().getAssets();
      await updateAllBalances({
        loading: true,
        myAgent: userAgent,
        assets,
        basicSearch: false,
      });

      await transactionCacheRefresh();
      await allowanceCacheRefresh();
      await contactCacheRefresh();

      dispatch(setAppDataRefreshing(false));
    }
  }

  useEffect(() => {
    loadInitialData();
  }, [isAppDataFreshing]);

  useEffect(() => {
    const timer = setInterval(() => workerDataRefresh(), WORKER_INTERVAL);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <>{children}</>;
}
