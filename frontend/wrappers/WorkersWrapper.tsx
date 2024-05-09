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
  // const { transactions } = useAppSelector((state) => state.transaction.list);
  // const { contacts } = useAppSelector((state) => state.contacts);
  // const { allowances } = useAppSelector((state) => state.allowance.list);
  const initialFetch = useRef<boolean>(true);

  // const dispatch = useAppDispatch();

  async function fetchICPTransactions(asset: Asset) {
    // TODO: TODO: set all transactions inside the redux to reduce the renders
    for (const subAccount of asset.subAccounts) {
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
    // TODO: TODO: set all transactions inside the redux to reduce the renders
    for (const subAccount of asset.subAccounts) {
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
        console.log(asset.name);

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

  async function assetsRefreshManager() {
    console.log("fetch and dispatch assets STARTED");

    const assetsDB = await db().getAssets();
    await updateAllBalances({
      loading: true,
      myAgent: userAgent,
      assets: assetsDB.length !== 0 ? assetsDB : [],
      basicSearch: false,
    });
    console.log("fetch and dispatch assets FINISHED");
  }

  async function transactionsRefreshManager() {
    console.log("fetch and dispatch transactions STARTED");
    await transactionCacheRefresh();
    console.log("fetch and dispatch transactions END");
  }

  async function allowancesRefreshManager() {
    console.log("fetch and dispatch allowances STARTED");
    await allowanceCacheRefresh();
    console.log("fetch and dispatch allowances END");
  }

  async function contactsRefreshManager() {
    console.log("fetch and dispatch contacts STARTED");
    await contactCacheRefresh();
    console.log("fetch and dispatch contacts END");
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
