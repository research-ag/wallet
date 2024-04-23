import store from "@redux/Store";
import { getWatchOnlySessionsFromLocal } from "./watchOnlyStorage";
import { setWatchOnlyHistory } from "@redux/common/CommonReducer";

export default function refreshWatchOnlyRecords() {
  const records = getWatchOnlySessionsFromLocal();
  store.dispatch(setWatchOnlyHistory(records));
}
