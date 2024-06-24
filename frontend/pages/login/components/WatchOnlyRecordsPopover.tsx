import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { CustomInput } from "@components/input";
import HistoricalItem from "@/pages/login/components/HistoricalItem";
import useWatchOnly from "@pages/hooks/useWatchOnly";
import { useTranslation } from "react-i18next";

interface WatchOnlyRecordsPopoverProps {
  onHistoricalSelectHandler: (principal: string) => void;
}

export default function WatchOnlyRecordsPopover({ onHistoricalSelectHandler }: WatchOnlyRecordsPopoverProps) {
  const { t } = useTranslation();
  const { watchOnlyItem, setWatchOnlyItem, watchOnlyHistoryFiltered, onSearchChange } = useWatchOnly();

  return (
    <div className={itemsRootStyles}>
      <CustomInput
        className="h-8"
        prefix={<MagnifyingGlassIcon className="w-6 h-6 mr-2 text-black-color dark:text-white" />}
        placeholder={t("search")}
        onChange={onSearchChange}
        compOutClass="p-2"
      />

      <div className="overflow-y-auto scroll-y-light max-h-[7rem]">
        {watchOnlyHistoryFiltered.map((data, index) => (
          <HistoricalItem
            key={data.principal}
            onHistoricalSelectHandler={onHistoricalSelectHandler}
            data={data}
            setWatchOnlyItem={setWatchOnlyItem}
            watchOnlyItem={watchOnlyItem}
            isLast={index === watchOnlyHistoryFiltered.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

const itemsRootStyles = clsx(
  "absolute z-10 w-full mt-1",
  "bg-white dark:bg-secondary-color-2",
  "rounded-md shadow-lg border border-gray-200 dark:border-gray-800",
);
