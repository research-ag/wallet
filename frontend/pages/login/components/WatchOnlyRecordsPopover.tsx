import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { getWatchOnlySessionsFromLocal } from "@pages/helpers/watchOnlyStorage";
import { useEffect, useState } from "react";
import { WatchOnlyItem } from "./WatchOnlyInput";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { setWatchOnlyHistory } from "@redux/common/CommonReducer";
import { CustomInput } from "@components/input";
import { EditWatchOnlyItem } from "@pages/components/topbar/WatchOnlyRecords";
import HistoricalItem from "./HistoricalItem";

interface WatchOnlyRecordsPopoverProps {
  onHistoricalSelectHandler: (principal: string) => void;
}

export default function WatchOnlyRecordsPopover({ onHistoricalSelectHandler }: WatchOnlyRecordsPopoverProps) {
  const [watchOnlyItem, setWatchOnlyItem] = useState<EditWatchOnlyItem | null>(null);
  const { watchOnlyHistory } = useAppSelector((state) => state.common);
  const [watchOnlyHistoryFiltered, setWatchOnlyHistoryFiltered] = useState<WatchOnlyItem[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const watchOnlyItems = getWatchOnlySessionsFromLocal();
    if (watchOnlyItems.length !== watchOnlyHistory.length) {
      dispatch(setWatchOnlyHistory(watchOnlyItems));
    }
    setWatchOnlyHistoryFiltered(watchOnlyItems);
  }, [watchOnlyHistory]);

  if (watchOnlyHistory.length === 0) return null;

  return (
    <div className={itemsRootStyles}>
      <CustomInput
        className="h-8"
        prefix={<MagnifyingGlassIcon className="w-6 h-6 mr-2" />}
        placeholder="Search"
        onChange={onSearchChange}
        compOutClass="p-2"
      />

      <div className="overflow-y-auto scroll-y-light max-h-[7rem]">
        {watchOnlyHistoryFiltered.map((data) => (
          <HistoricalItem
            key={data.principal}
            onHistoricalSelectHandler={onHistoricalSelectHandler}
            data={data}
            setWatchOnlyItem={setWatchOnlyItem}
            watchOnlyItem={watchOnlyItem}
          />
        ))}
      </div>
    </div>
  );

  function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = e.target.value.trim();

    if (!searchValue) return setWatchOnlyHistoryFiltered(watchOnlyHistory);

    const filtered = watchOnlyHistory.filter((item) => {
      return item?.alias?.includes(searchValue) || item?.principal.includes(searchValue);
    });

    setWatchOnlyHistoryFiltered(filtered);
  }
}

const itemsRootStyles = clsx(
  "absolute z-10 w-full mt-1",
  "bg-white dark:bg-secondary-color-2",
  "rounded-md shadow-lg border border-gray-200 dark:border-gray-800",
);
