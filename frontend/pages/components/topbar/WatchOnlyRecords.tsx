import { WatchOnlyItem } from "@pages/login/components/WatchOnlyInput";
import WatchOnlyRecord from "./WatchOnlyRecord";
import { CustomInput } from "@components/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import useWatchOnly from "@pages/hooks/useWatchOnly";

interface WatchOnlyRecordsProps {
  start: number;
  end: number;
}

export interface EditWatchOnlyItem extends Pick<WatchOnlyItem, "principal" | "alias"> {
  isValid: boolean;
  isDelete: boolean;
}

export default function WatchOnlyRecords({ start, end }: WatchOnlyRecordsProps) {
  const { watchOnlyItem, setWatchOnlyItem, watchOnlyHistoryFiltered, onSearchChange } = useWatchOnly();

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
}
