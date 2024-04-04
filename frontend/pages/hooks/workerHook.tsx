import { AssetSymbolEnum, WorkerTaskEnum } from "@/const";
import { hexToUint8Array } from "@/utils";
import contactCacheRefresh from "@pages/contacts/helpers/contacts";
import { allowanceCacheRefresh } from "@pages/home/helpers/allowanceCache";
import store, { useAppDispatch, useAppSelector } from "@redux/Store";
import { getAllTransactionsICP, getAllTransactionsICRC1, updateAllBalances } from "@redux/assets/AssetActions";
import { setLoading, setTxWorker } from "@redux/assets/AssetReducer";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { timerWorkerScript } from "@workers/index";
import { useEffect } from "react";
import { db } from "@/database/db";

export const WorkerHook = () => {
  const dispatch = useAppDispatch();
  const { assets, txWorker } = useAppSelector((state) => state.asset);
  const { userAgent } = useAppSelector((state) => state.auth);

  const getTransactionsWorker = async () => {
    assets.map((elementA: Asset) => {
      if (elementA.tokenSymbol === AssetSymbolEnum.Enum.ICP || elementA.tokenSymbol === AssetSymbolEnum.Enum.OGY) {
        elementA.subAccounts.map(async (elementS: SubAccount) => {
          const transactionsICP = await getAllTransactionsICP({
            subaccount_index: elementS.sub_account_id,
            loading: false,
            isOGY: elementA.tokenSymbol === AssetSymbolEnum.Enum.OGY,
          });

          store.dispatch(
            setTxWorker({
              tx: transactionsICP,
              symbol: elementA.symbol,
              tokenSymbol: elementA.tokenSymbol,
              subaccount: elementS.sub_account_id,
            }),
          );
        });
      } else {
        // REMOVE: const selectedToken = tokens.find((tk: Token) => tk.symbol === elementA?.symbol);
        // TODO: replaced for assets, verify it's working properly
        const selectedToken = assets.find((tk: Asset) => tk.symbol === elementA?.symbol);

        if (selectedToken) {
          elementA.subAccounts.map(async (elementS: SubAccount) => {
            const transactionsICRC1 = await getAllTransactionsICRC1(
              selectedToken?.index || "",
              hexToUint8Array(elementS?.sub_account_id || "0x0"),
              false,
              elementA.tokenSymbol,
              selectedToken.address,
              elementS?.sub_account_id,
            );

            store.dispatch(
              setTxWorker({
                tx: transactionsICRC1,
                symbol: elementA.symbol,
                tokenSymbol: elementA.tokenSymbol,
                subaccount: elementS.sub_account_id,
              }),
            );
          });
        }
      }
    });
  };

  const getAssetsWorker = async () => {
    dispatch(setLoading(true));
    const dbAssets = await db().getTokens();
    if (dbAssets) {
      await updateAllBalances({
        loading: true,
        myAgent: userAgent,
        assets: dbAssets,
      });
    } else {
      await updateAllBalances({
        loading: true,
        myAgent: userAgent,
        assets,
        basicSearch: true,
      });
    }
    await contactCacheRefresh();
    await allowanceCacheRefresh();
    dispatch(setLoading(false));
  };

  // TRANSACTION WEB WORKER
  const timerWorker = new Worker(timerWorkerScript, { type: "module", credentials: "include" });
  timerWorker.onmessage = ({ data }) => {
    if (data && data.debug) console.log("message from worker: %o", data);
    else {
      if (data === WorkerTaskEnum.Values.TRANSACTIONS) getTransactionsWorker();
      if (data === WorkerTaskEnum.Values.ASSETS) getAssetsWorker();
    }
  };
  timerWorker.onerror = (event) => console.log(event);

  useEffect(() => {
    const postRequest = { message: true };
    timerWorker.postMessage(postRequest);

    return () => {
      timerWorker.terminate();
    };
  }, []);

  return { txWorker };
};
