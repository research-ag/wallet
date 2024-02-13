import { AssetSymbolEnum, WorkerTaskEnum } from "@/const";
import { defaultTokens } from "@/defaultTokens";
import { hexToUint8Array } from "@/utils";
import contactCacheRefresh from "@pages/contacts/helpers/contacts";
import { allowanceCacheRefresh } from "@pages/home/helpers/allowanceCache";
// import { AssetList, Metadata } from "@candid/metadata/service.did";
import store, { useAppDispatch, useAppSelector } from "@redux/Store";
import { getAllTransactionsICP, getAllTransactionsICRC1, updateAllBalances } from "@redux/assets/AssetActions";
import { setLoading, setTokens, setTxWorker } from "@redux/assets/AssetReducer";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { Token } from "@redux/models/TokenModels";
import timer_script from "@workers/timerWorker";
import { useEffect } from "react";

export const WorkerHook = () => {
  const dispatch = useAppDispatch();
  const { tokens, assets, txWorker } = useAppSelector((state) => state.asset);
  const { authClient, userAgent } = useAppSelector((state) => state.auth);

  const getTransactionsWorker = async () => {
    assets.map((elementA: Asset) => {
      if (elementA.tokenSymbol === AssetSymbolEnum.Enum.ICP || elementA.tokenSymbol === AssetSymbolEnum.Enum.OGY) {
        elementA.subAccounts.map(async (elementS: SubAccount) => {
          let transactionsICP = await getAllTransactionsICP(
            elementS.sub_account_id,
            false,
            elementA.tokenSymbol === AssetSymbolEnum.Enum.OGY,
          );

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
        const selectedToken = tokens.find((tk: Token) => tk.symbol === elementA?.symbol);
        if (selectedToken) {
          elementA.subAccounts.map(async (elementS: SubAccount) => {
            let transactionsICRC1 = await getAllTransactionsICRC1(
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
    const userData = localStorage.getItem(authClient);
    if (userData) {
      const userDataJson = JSON.parse(userData);
      store.dispatch(setTokens(userDataJson.tokens));
      await updateAllBalances(true, userAgent, userDataJson.tokens, false, false);
    } else {
      const { tokens } = await updateAllBalances(true, userAgent, defaultTokens, true, false);
      store.dispatch(setTokens(tokens));
    }
    const myPrincipal = await userAgent.getPrincipal();
    await contactCacheRefresh(myPrincipal.toText());
    await allowanceCacheRefresh(myPrincipal.toText());
    dispatch(setLoading(false));
  };

  // TRANSACTION WEB WORKER
  let timerWorker = new Worker(timer_script, { type: "module", credentials: "include" });

  timerWorker.onmessage = (event) => {
    if (event.data && event.data.debug) {
      if (event.data) {
        console.log("message from worker: %o", event.data);
      }
    } else {
      if (event.data === WorkerTaskEnum.Values.TRANSACTIONS) {
        getTransactionsWorker();
      } else if (event.data === WorkerTaskEnum.Values.ASSETS) {
        getAssetsWorker();
      }
    }
  };

  timerWorker.onerror = (event) => {
    console.log(event);
  };

  useEffect(() => {
    let postRequest = {
      message: true,
    };

    timerWorker.postMessage(postRequest);
    return () => {
      timerWorker.terminate();
    };
  }, []);

  return { txWorker };
};
