import { WatchOnlyItem } from "@pages/login/components/WatchOnlyInput";
import { useAppSelector } from "@redux/Store";
import { useState } from "react";
import WatchOnlyRecord from "./WatchOnlyRecord";

interface WatchOnlyRecordsProps {
  start: number;
  end: number;
}

export interface EditWatchOnlyItem extends Pick<WatchOnlyItem, "principal" | "alias"> {
  isValid: boolean;
  isDelete: boolean;
}

export default function WatchOnlyRecords({ start, end }: WatchOnlyRecordsProps) {
  const { watchOnlyHistory } = useAppSelector((state) => state.common);
  const [watchOnlyItem, setWatchOnlyItem] = useState<EditWatchOnlyItem | null>(null);

  return (
    <div className="absolute z-10 w-full max-h-[10rem] overflow-y-auto  scroll-y-light bg-white dark:bg-level-1-color text-left mt-1 rounded-lg shadow-lg p-2">
      {watchOnlyHistory.map((data) => (
        <WatchOnlyRecord
          key={data.principal}
          data={data}
          start={start}
          end={end}
          watchOnlyItem={watchOnlyItem}
          setWatchOnlyItem={setWatchOnlyItem}
        />
      ))}
    </div>
  );
}
