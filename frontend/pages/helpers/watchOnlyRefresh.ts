import { setReduxWatchOnlyHistory } from "@redux/auth/AuthReducer";
import { getWatchOnlySessionsFromLocal } from "./watchOnlyStorage";
import store from "@redux/Store";

export default function watchOnlyRefresh() {
  const localWatchOnlyHistory = getWatchOnlySessionsFromLocal();
  store.dispatch(setReduxWatchOnlyHistory(localWatchOnlyHistory));
}
