
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import { getWatchOnlySessionsFromLocal } from "@pages/helpers/watchOnlyStorage";
import { useEffect, useState } from "react";
import { WatchOnlyItem } from "./WatchOnlyInput";
import clsx from "clsx";
import { useAppDispatch } from "@redux/Store";

interface WatchOnlyRecordsPopoverProps {
  onHistoricalSelectHandler: (principal: string) => void;
};

export default function WatchOnlyRecordsPopover({ onHistoricalSelectHandler }: WatchOnlyRecordsPopoverProps) {
  const dispatch = useAppDispatch();
  const [watchOnlyHistory, setWatchOnlyHistory] = useState<WatchOnlyItem[]>([]);

  useEffect(() => {
    const watchOnlyItems = getWatchOnlySessionsFromLocal();
    if (watchOnlyItems.length !== watchOnlyHistory.length) {
      dispatch(setWatchOnlyHistory(watchOnlyItems));
    }
  }, []);

  if (watchOnlyHistory.length === 0) return null;

  return (
    <div className={itemsRootStyles}>
      {watchOnlyHistory.map((data) => (
        <HistoricalItem key={data.principal} onHistoricalSelectHandler={onHistoricalSelectHandler} data={data} />
      ))}
    </div>
  );


  function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    // TODO: if the search is empty, set the searchHistory to null
    // TODO: search over the redux list and set the searchHistory
  };
};

const itemsRootStyles = clsx(
  "absolute z-10 w-full mt-1",
  "bg-white dark:bg-level-1-color",
  "rounded-sm shadow-lg",
  "overflow-y-auto  scroll-y-light",
  "max-h-[10rem]",
);

// ------------------------------ COMPONENT ------------------------------

interface HistoricalItemProps {
  onHistoricalSelectHandler: (principal: string) => void;
  data: WatchOnlyItem;
  isLast?: boolean;
}

function HistoricalItem(props: HistoricalItemProps) {
  const { onHistoricalSelectHandler, data } = props;

  return (
    <div className={itemStyles} onClick={() => onHistoricalSelectHandler(data.principal)}>
      <div className="flex items-center justify-between">
        <CounterClockwiseClockIcon className="w-4 h-4 mr-2" />
        <div className="text-left">
          <div className="text-sm">{!data?.alias || data?.alias?.length > 0 ? data.alias : "-"}</div>
          <div className="text-sm">{data.principal}</div>
        </div>
      </div>
    </div>
  );
}

const itemStyles = clsx(
  "cursor-pointer",
  "flex items-center justify-between px-2 py-1",
  "dark:bg-level-1-color bg-secondary-color-1-light",
  "dark:hover:bg-secondary-color-2 hover:bg-secondary-color-2-light",
  "text-black-color dark:text-white",
  "transition-all duration-100 ease-in-out",
);
