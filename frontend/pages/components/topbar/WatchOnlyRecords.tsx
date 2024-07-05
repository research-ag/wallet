import { WatchOnlyItem } from "@pages/login/components/WatchOnlyInput";
import WatchOnlyRecord from "./WatchOnlyRecord";
import { CustomInput } from "@components/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import useWatchOnly from "@pages/hooks/useWatchOnly";
import { useTranslation } from "react-i18next";

export interface EditWatchOnlyItem extends Pick<WatchOnlyItem, "principal" | "alias"> {
  isValid: boolean;
  isDelete: boolean;
}

export default function WatchOnlyRecords() {
  const { t } = useTranslation();
  const { watchOnlyItem, setWatchOnlyItem, watchOnlyHistoryFiltered, onSearchChange } = useWatchOnly();

  return (
    <div className="absolute z-10 w-full mt-1 text-left bg-white border border-gray-200 rounded-md shadow-lg dark:border-gray-800 dark:bg-secondary-color-2">
      <CustomInput
        className="h-8"
        prefix={<MagnifyingGlassIcon className="w-6 h-6 mr-2" />}
        placeholder={t("search")}
        onChange={onSearchChange}
        compOutClass="p-2"
      />

      <div className="max-h-[10rem] overflow-y-auto scroll-y-light">
        {watchOnlyHistoryFiltered.map((data, index) => (
          <WatchOnlyRecord
            key={data.principal}
            data={data}
            watchOnlyItem={watchOnlyItem}
            setWatchOnlyItem={setWatchOnlyItem}
            isLast={index === watchOnlyHistoryFiltered.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
