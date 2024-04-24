import { WatchOnlyItem } from "@pages/login/components/WatchOnlyInput";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { useEffect, useState } from "react";
import WatchOnlyRecord from "./WatchOnlyRecord";
import { CustomInput } from "@components/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { getWatchOnlySessionsFromLocal } from "@pages/helpers/watchOnlyStorage";
import { setWatchOnlyHistory } from "@redux/common/CommonReducer";

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
    <div className="absolute z-10 w-full mt-1 text-left bg-white border border-gray-200 rounded-md shadow-lg dark:border-gray-800 dark:bg-secondary-color-2">
      <CustomInput
        className="h-8"
        prefix={<MagnifyingGlassIcon className="w-6 h-6 mr-2" />}
        placeholder="Search"
        onChange={onSearchChange}
        compOutClass="p-2"
      />

      <div className="max-h-[10rem] overflow-y-auto scroll-y-light">
        {watchOnlyHistoryFiltered.map((data) => (
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
    </div>
  );

  function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = e.target.value.trim();

    if (!searchValue) return setWatchOnlyHistoryFiltered(watchOnlyHistory);

    const filtered = watchOnlyHistory.filter((item) => {
      return item?.alias?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) || item?.principal.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase());
    });

    setWatchOnlyHistoryFiltered(filtered);
  }
}
