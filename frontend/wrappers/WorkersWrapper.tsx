import { AssetSymbolEnum } from "@/const";
import { hexToUint8Array } from "@/utils";
import contactCacheRefresh from "@pages/contacts/helpers/contactCacheRefresh";
import { allowanceCacheRefresh } from "@pages/home/helpers/allowanceCache";
import { getAllTransactionsICP, getAllTransactionsICRC1, updateAllBalances } from "@redux/assets/AssetActions";
import { setTxWorker } from "@redux/assets/AssetReducer";
import { setAppDataRefreshing, setLastDataRefresh } from "@redux/common/CommonReducer";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import dayjs from "dayjs";
import { useEffect } from "react";

const WORKER_INTERVAL = 1 * 60 * 1000; // 10 minutes
const DATA_STALE_THRESHOLD = 50; // 9 minutes 

export default function WorkersWrapper({ children }: { children: React.ReactNode }) {
  const { assets } = useAppSelector((state) => state.asset);
  const { userAgent } = useAppSelector((state) => state.auth);
  const { isAppDataFreshing, lastDataRefresh } = useAppSelector((state) => state.common);
  const dispatch = useAppDispatch();

  async function transactionCacheRefresh() {
    try {
      assets.map((elementA: Asset) => {
        if (elementA.tokenSymbol === AssetSymbolEnum.Enum.ICP || elementA.tokenSymbol === AssetSymbolEnum.Enum.OGY) {
          elementA.subAccounts.map(async (elementS: SubAccount) => {
            const transactionsICP = await getAllTransactionsICP({
              subaccount_index: elementS.sub_account_id,
              loading: false,
              isOGY: elementA.tokenSymbol === AssetSymbolEnum.Enum.OGY,
            });

            dispatch(
              setTxWorker({
                tx: transactionsICP,
                symbol: elementA.symbol,
                tokenSymbol: elementA.tokenSymbol,
                subaccount: elementS.sub_account_id,
              }),
            );
          });
        } else {
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

              dispatch(
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
    } catch (error) {
      console.error("Error in transactionCacheRefresh worker", error);
    }
  }

  async function dataRefresh() {
    try {
      console.log("Data Refreshed");
      await updateAllBalances({
        loading: true,
        myAgent: userAgent,
        assets: assets.length !== 0 ? assets : [],
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
      const isDataStale = dayjs().diff(dayjs(lastDataRefresh), "seconds") >= DATA_STALE_THRESHOLD;

      console.log("isDataStale", isDataStale);
      

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
