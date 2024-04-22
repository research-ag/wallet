import { db } from "@/database/db";
import contactCacheRefresh from "@pages/contacts/helpers/contactCacheRefresh";
import { allowanceCacheRefresh } from "@pages/home/helpers/allowanceCache";
import { updateAllBalances } from "@redux/assets/AssetActions";
import { setAppDataRefreshing, setLastDataRefresh } from "@redux/common/CommonReducer";
import store from "@redux/Store";
import dayjs from "dayjs";

export default async function reloadBallance() {
  try {
    store.dispatch(setAppDataRefreshing(true));

    const dbAssets = await db().getAssets();

    await updateAllBalances({
      loading: true,
      myAgent: store.getState().auth.userAgent,
      assets: dbAssets,
      fromLogin: true,
    });

    await allowanceCacheRefresh();
    await contactCacheRefresh();

    store.dispatch(setLastDataRefresh(dayjs().toISOString()));
    store.dispatch(setAppDataRefreshing(false));
  } catch (e) {
    console.error("Error reloading balance", e);
  }
}
