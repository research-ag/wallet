import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { setAppDataRefreshing } from "@redux/common/CommonReducer";
// import { AssetSymbolEnum } from "@/common/const";
// import contactCacheRefresh from "@pages/contacts/helpers/contactCacheRefresh";
// import { allowanceCacheRefresh } from "@pages/allowances/helpers/cache";
// import { updateAllBalances } from "@redux/assets/AssetActions";
// import { setAppDataRefreshing, setLastDataRefresh } from "@redux/common/CommonReducer";
// import { Asset } from "@redux/models/AccountModels";
// import { setTxWorker } from "@redux/transaction/TransactionReducer";
// import dayjs from "dayjs";
// import { db } from "@/database/db";
// import { hexToUint8Array } from "@common/utils/hexadecimal";
// import { getAllTransactionsICP, getAllTransactionsICRC1 } from "@pages/home/helpers/requests";

const WORKER_INTERVAL = 10 * 60 * 1000; // 10 minutes

export default function WorkersWrapper({ children }: { children: React.ReactNode }) {
  const { isAppDataFreshing } = useAppSelector((state) => state.common);
  const dispatch = useAppDispatch();
  // const { assets } = useAppSelector((state) => state.asset.list);
  // const { transactions } = useAppSelector((state) => state.transaction.list);
  // const { contacts } = useAppSelector((state) => state.contacts);
  // const { allowances } = useAppSelector((state) => state.allowance.list);
  const initialFetch = useRef<boolean>(true);

  // const dispatch = useAppDispatch();

  // async function fetchICPTransactions(asset: Asset) {
  //   for (const subAccount of asset.subAccounts) {
  //     const transactions = await getAllTransactionsICP({
  //       subaccount_index: subAccount.sub_account_id,
  //       isOGY: asset.tokenSymbol === AssetSymbolEnum.Enum.OGY,
  //     });

  //     // TODO: running worker
  //     dispatch(
  //       setTxWorker({
  //         tx: transactions,
  //         symbol: asset.symbol,
  //         tokenSymbol: asset.tokenSymbol,
  //         subaccount: subAccount.sub_account_id,
  //       }),
  //     );
  //   }
  // }

  // async function fetchICRC1Transactions(asset: Asset, selectedToken: Asset) {
  //   const workerTransactions = [];

  //   for (const subAccount of asset.subAccounts) {

  //     const transactions = await getAllTransactionsICRC1({
  //       canisterId: selectedToken.index || "",
  //       subaccount_index: hexToUint8Array(subAccount.sub_account_id || "0x0"),
  //       assetSymbol: asset.tokenSymbol,
  //       canister: selectedToken.address,
  //       subNumber: subAccount.sub_account_id,
  //     });

  //     workerTransactions.push({
  //       tx: transactions,
  //       symbol: asset.symbol,
  //       tokenSymbol: asset.tokenSymbol,
  //       subaccount: subAccount.sub_account_id,
  //     })

  //   }
  //   console.log("END", workerTransactions);

  // }

  // async function transactionCacheRefresh() {
  //   try {
  //     const assetsDB = await db().getAssets();

  // for (const asset of assetsDB) {

  //   console.log(asset.name);

  // if (asset.tokenSymbol === AssetSymbolEnum.Enum.ICP || asset.tokenSymbol === AssetSymbolEnum.Enum.OGY) {
  //   await fetchICPTransactions(asset);
  // } else {
  //   const selectedAsset = assets.find((currentAsset) => currentAsset.symbol === asset.symbol);
  //   if (selectedAsset) {
  //     await fetchICRC1Transactions(asset, selectedAsset);
  //   }
  // }

  // }
  //   } catch (error) {
  //     console.error("Error in transactionCacheRefresh worker", error);
  //   }
  // }

  // async function dataRefresh() {
  //   try {
  //     console.log("information");

  // const assetsDB = await db().getAssets();
  // await updateAllBalances({
  //   loading: true,
  //   myAgent: userAgent,
  //   assets: assetsDB.length !== 0 ? assetsDB : [],
  //   basicSearch: false,
  // });
  // await transactionCacheRefresh();
  // await allowanceCacheRefresh();
  // await contactCacheRefresh();
  //   } catch (error) {
  //     console.error("Error in dataRefresh worker", error);
  //   }
  // }

  // useEffect(() => {
  //   const timer = setInterval(() => {

  //     if (!isAppDataFreshing) {
  //       dispatch(setAppDataRefreshing(true));

  //       dataRefresh().then(() => {
  //         dispatch(setLastDataRefresh(dayjs().toISOString()));
  //         dispatch(setAppDataRefreshing(false));
  //       });
  //     }
  //   }, WORKER_INTERVAL);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, [lastDataRefresh, isAppDataFreshing]);

  async function assetsRefreshManager() {
    setTimeout(() => {
      console.log("fetch and dispatch assets");
    }, 2000);
  }

  async function transactionsRefreshManager() {
    setTimeout(() => {
      console.log("fetch and dispatch transactions");
    }, 2000);
  }

  async function allowancesRefreshManager() {
    setTimeout(() => {
      console.log("fetch and dispatch allowances");
    }, 2000);
  }

  async function contactsRefreshManager() {
    setTimeout(() => {
      console.log("fetch and dispatch contacts");
    }, 2000);
  }

  useEffect(() => {
    if (!initialFetch.current) return;
    initialFetch.current = false;

    dispatch(setAppDataRefreshing(true));

    (async () => {
      console.log("RUNNING INITIAL");

      await assetsRefreshManager();
      await transactionsRefreshManager();
      await allowancesRefreshManager();
      await contactsRefreshManager();
    })();

    dispatch(setAppDataRefreshing(false));
  }, [isAppDataFreshing]);

  useEffect(() => {
    // TODO: will overwrite any forced refresh by the user
    const timer = setInterval(() => {
      if (!isAppDataFreshing) {
        console.log("RUNNING WORKER");

        dispatch(setAppDataRefreshing(true));

        (async () => {
          await assetsRefreshManager();
          await transactionsRefreshManager();
          await allowancesRefreshManager();
          await contactsRefreshManager();
        })();

        dispatch(setAppDataRefreshing(false));
      }
    }, WORKER_INTERVAL);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <>{children}</>;
}
