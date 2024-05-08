import { AssetSymbolEnum } from "@/common/const";
import contactCacheRefresh from "@pages/contacts/helpers/contactCacheRefresh";
import { allowanceCacheRefresh } from "@pages/allowances/helpers/cache";
import { updateAllBalances } from "@redux/assets/AssetActions";
import { setAppDataRefreshing, setLastDataRefresh } from "@redux/common/CommonReducer";
import { Asset } from "@redux/models/AccountModels";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { setTxWorker } from "@redux/transaction/TransactionReducer";
import dayjs from "dayjs";
import { useEffect } from "react";
import { db } from "@/database/db";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import { getAllTransactionsICP, getAllTransactionsICRC1 } from "@pages/home/helpers/requests";

const WORKER_INTERVAL = 10 * 60 * 1000; // 10 minutes
const DATA_STALE_THRESHOLD = 9; // 9 minutes

export default function WorkersWrapper({ children }: { children: React.ReactNode }) {
  const { assets } = useAppSelector((state) => state.asset);
  const { userAgent } = useAppSelector((state) => state.auth);
  const { isAppDataFreshing, lastDataRefresh } = useAppSelector((state) => state.common);
  const dispatch = useAppDispatch();

  async function fetchICPTransactions(asset: Asset) {
    for (const subAccount of asset.subAccounts) {
      // TODO: do not setTransactions
      const transactions = await getAllTransactionsICP({
        subaccount_index: subAccount.sub_account_id,
        isOGY: asset.tokenSymbol === AssetSymbolEnum.Enum.OGY,
      });

      dispatch(
        setTxWorker({
          tx: transactions,
          symbol: asset.symbol,
          tokenSymbol: asset.tokenSymbol,
          subaccount: subAccount.sub_account_id,
        }),
      );
    }
  }

  async function fetchICRC1Transactions(asset: Asset, selectedToken: Asset) {
    for (const subAccount of asset.subAccounts) {
      // TODO: do do run setTransactions
      const transactions = await getAllTransactionsICRC1({
        canisterId: selectedToken.index || "",
        subaccount_index: hexToUint8Array(subAccount.sub_account_id || "0x0"),
        assetSymbol: asset.tokenSymbol,
        canister: selectedToken.address,
        subNumber: subAccount.sub_account_id,
      });

      dispatch(
        setTxWorker({
          tx: transactions,
          symbol: asset.symbol,
          tokenSymbol: asset.tokenSymbol,
          subaccount: subAccount.sub_account_id,
        }),
      );
    }
  }

  async function transactionCacheRefresh() {
    try {
      for (const asset of assets) {
        if (asset.tokenSymbol === AssetSymbolEnum.Enum.ICP || asset.tokenSymbol === AssetSymbolEnum.Enum.OGY) {
          await fetchICPTransactions(asset);
        } else {
          const selectedAsset = assets.find((currentAsset) => currentAsset.symbol === asset.symbol);
          if (selectedAsset) {
            await fetchICRC1Transactions(asset, selectedAsset);
          }
        }
      }
    } catch (error) {
      console.error("Error in transactionCacheRefresh worker", error);
    }
  }

  async function dataRefresh() {
    const auxAsset = await db().getAssets();
    try {
      await updateAllBalances({
        loading: true,
        myAgent: userAgent,
        assets: auxAsset.length !== 0 ? auxAsset : [],
        basicSearch: false,
      });
      await transactionCacheRefresh();
      await allowanceCacheRefresh();
      await contactCacheRefresh();
    } catch (error) {
      console.error("Error in dataRefresh worker", error);
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const isDataStale = dayjs().diff(dayjs(lastDataRefresh), "minutes") >= DATA_STALE_THRESHOLD;

      if (isDataStale && !isAppDataFreshing) {
        dispatch(setAppDataRefreshing(true));

        dataRefresh().then(() => {
          dispatch(setLastDataRefresh(dayjs().toISOString()));
          dispatch(setAppDataRefreshing(false));
        });
      }
    }, WORKER_INTERVAL);

    return () => {
      clearInterval(timer);
    };
  }, [lastDataRefresh, isAppDataFreshing]);

  return <>{children}</>;
}
