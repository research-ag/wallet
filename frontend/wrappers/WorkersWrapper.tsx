import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { setAppDataRefreshing } from "@redux/common/CommonReducer";
import { db } from "@/database/db";
import { getSNSTokens, updateAllBalances } from "@redux/assets/AssetActions";
import { allowanceCacheRefresh } from "@pages/allowances/helpers/cache";
import contactCacheRefresh from "@pages/contacts/helpers/contactCacheRefresh";
import { setICRC1SystemAssets } from "@redux/assets/AssetReducer";
import { transactionCacheRefresh } from "@pages/home/helpers/cache";
import { getckERC20Tokens } from "@common/utils/ckERC20";
import serviceCacheRefresh from "@pages/contacts/helpers/serviceCacheRefresh";
import loadServices from "@pages/services/helpers/loadServices";

const WORKER_INTERVAL = 10 * 60 * 1000; // 10 minutes

export default function WorkersWrapper({ children }: { children: React.ReactNode }) {
  const { isAppDataFreshing } = useAppSelector((state) => state.common);
  const { userAgent } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { assets } = useAppSelector((state) => state.asset.list);
  const initialFetch = useRef<boolean>(true);

  async function loadInitialData() {
    if (!initialFetch.current) return;
    initialFetch.current = false;

    dispatch(setAppDataRefreshing(true));

    await loadServices();
    const [erc20Tokens, snsTokens] = await Promise.all([getckERC20Tokens(), getSNSTokens(userAgent)]);

    dispatch(setICRC1SystemAssets([...erc20Tokens, ...snsTokens]));

    const dbAssets = await db().getAssets();

    await updateAllBalances({
      loading: true,
      fromLogin: true,
      myAgent: userAgent,
      assets: dbAssets,
      basicSearch: true,
    });

    await transactionCacheRefresh(assets);
    await allowanceCacheRefresh();
    await contactCacheRefresh();

    dispatch(setAppDataRefreshing(false));
  }

  async function workerDataRefresh() {
    if (!isAppDataFreshing) {
      dispatch(setAppDataRefreshing(true));

      const DBAssets = await db().getAssets();
      await updateAllBalances({
        loading: true,
        myAgent: userAgent,
        assets: DBAssets,
        basicSearch: true,
      });

      await transactionCacheRefresh(assets);
      await allowanceCacheRefresh();
      await contactCacheRefresh();
      await serviceCacheRefresh();

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
