import { EditWatchOnlyItem } from "@pages/components/topbar/WatchOnlyRecords";
import { getWatchOnlySessionsFromLocal } from "@pages/helpers/watchOnlyStorage";
import { WatchOnlyItem } from "@pages/login/components/WatchOnlyInput";
import { useEffect, useState } from "react";

/**
 * Hook to controls the filtering, listing and selection of watch-only items.
 */
export default function useWatchOnly() {
  const [watchOnlyItem, setWatchOnlyItem] = useState<EditWatchOnlyItem | null>(null);
  const [watchOnlyHistoryFiltered, setWatchOnlyHistoryFiltered] = useState<WatchOnlyItem[]>([]);

  useEffect(() => {
    // INFO: if the watchOnlyItem is null it means that deletion, update or creation was done
    if (watchOnlyItem) return;
    const watchOnlyItems = getWatchOnlySessionsFromLocal();
    setWatchOnlyHistoryFiltered(watchOnlyItems);
  }, [watchOnlyItem]);

  function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = e.target.value.trim();

    const watchOnlyHistory = getWatchOnlySessionsFromLocal();

    if (!searchValue) return setWatchOnlyHistoryFiltered(watchOnlyHistory);

    const filtered = watchOnlyHistory.filter((item) => {
      return (
        item?.alias?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
        item?.principal.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
      );
    });

    setWatchOnlyHistoryFiltered(filtered);
  }

  return { watchOnlyItem, setWatchOnlyItem, watchOnlyHistoryFiltered, setWatchOnlyHistoryFiltered, onSearchChange };
}
