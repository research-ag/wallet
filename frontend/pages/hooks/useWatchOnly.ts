import { EditWatchOnlyItem } from "@pages/components/topbar/WatchOnlyRecords";
import { WatchOnlyItem } from "@pages/login/components/WatchOnlyInput";
import { useAppSelector } from "@redux/Store";
import { useEffect, useState } from "react";

/**
 * Hook to controls the filtering, listing and selection of watch-only items.
 */
export default function useWatchOnly() {
  const { watchOnlyHistory } = useAppSelector((state) => state.auth);
  const [watchOnlyItem, setWatchOnlyItem] = useState<EditWatchOnlyItem | null>(null);
  const [watchOnlyHistoryFiltered, setWatchOnlyHistoryFiltered] = useState<WatchOnlyItem[]>([]);

  useEffect(() => {
    setWatchOnlyHistoryFiltered(watchOnlyHistory);
  }, [watchOnlyHistory]);

  function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = e.target.value.trim();

    if (!searchValue) return setWatchOnlyHistoryFiltered(watchOnlyHistory);

    const filtered = watchOnlyHistory.filter((item) => {
      return (
        item?.alias?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
        item?.principal.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
      );
    });

    setWatchOnlyHistoryFiltered(filtered);
  }

  return {
    watchOnlyItem,
    setWatchOnlyItem,
    watchOnlyHistoryFiltered,
    setWatchOnlyHistoryFiltered,
    onSearchChange,
  };
}
