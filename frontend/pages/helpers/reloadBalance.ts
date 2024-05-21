import { db } from "@/database/db";
import contactCacheRefresh from "@pages/contacts/helpers/contactCacheRefresh";
import { allowanceCacheRefresh } from "@pages/allowances/helpers/cache";
import { updateAllBalances } from "@redux/assets/AssetActions";
import { setAppDataRefreshing, setLastDataRefresh } from "@redux/common/CommonReducer";
import store from "@redux/Store";
import dayjs from "dayjs";
import { transactionCacheRefresh } from "@pages/home/helpers/cache";
import logger from "@/common/utils/logger";

export default async function reloadBallance() {
  try {
    store.dispatch(setAppDataRefreshing(true));

    const dbAssets = await db().getAssets();
    await updateAllBalances({
      loading: true,
      myAgent: store.getState().auth.userAgent,
      assets: dbAssets,
      fromLogin: true,
      basicSearch: true,
    });

    await transactionCacheRefresh(store.getState().asset.list.assets);
    await allowanceCacheRefresh();
    await contactCacheRefresh();

    store.dispatch(setLastDataRefresh(dayjs().toISOString()));
    store.dispatch(setAppDataRefreshing(false));
  } catch (e) {
    logger.debug("Error reloading balance", e);
  }
}
