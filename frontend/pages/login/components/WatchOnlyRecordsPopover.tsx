import {
  CheckIcon,
  CounterClockwiseClockIcon,
  Cross1Icon,
  MagnifyingGlassIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { getWatchOnlySessionsFromLocal, updateWatchOnlySessionFromLocal } from "@pages/helpers/watchOnlyStorage";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { WatchOnlyItem } from "./WatchOnlyInput";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { setWatchOnlyHistory } from "@redux/common/CommonReducer";
import { CustomInput } from "@components/input";
import { shortAddress } from "@/utils";
import { EditWatchOnlyItem } from "@pages/components/topbar/WatchOnlyRecords";

interface WatchOnlyRecordsPopoverProps {
  onHistoricalSelectHandler: (principal: string) => void;
}

export default function WatchOnlyRecordsPopover({ onHistoricalSelectHandler }: WatchOnlyRecordsPopoverProps) {
  const [watchOnlyItem, setWatchOnlyItem] = useState<EditWatchOnlyItem | null>(null);
  const { watchOnlyHistory } = useAppSelector((state) => state.common);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const watchOnlyItems = getWatchOnlySessionsFromLocal();
    if (watchOnlyItems.length !== watchOnlyHistory.length) {
      dispatch(setWatchOnlyHistory(watchOnlyItems));
    }
  }, []);

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
        {watchOnlyHistory.map((data) => (
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
    console.log(e.target.value);
    // TODO: if the search is empty, set the searchHistory to null
    // TODO: search over the redux list and set the searchHistory
  }
}

const itemsRootStyles = clsx(
  "absolute z-10 w-full mt-1",
  "bg-white dark:bg-secondary-color-2",
  "rounded-md shadow-lg border border-gray-200 dark:border-gray-800",
);

// ------------------------------ COMPONENT ------------------------------

interface HistoricalItemProps {
  onHistoricalSelectHandler: (principal: string) => void;
  data: WatchOnlyItem;
  isLast?: boolean;
  setWatchOnlyItem: Dispatch<SetStateAction<EditWatchOnlyItem | null>>;
  watchOnlyItem: EditWatchOnlyItem | null;
}

function HistoricalItem(props: HistoricalItemProps) {
  const dispatch = useAppDispatch();
  const { onHistoricalSelectHandler, data, setWatchOnlyItem, watchOnlyItem } = props;
  const isBeingEdited = watchOnlyItem?.principal?.toString() === data.principal;

  return (
    // <div className={getItemStyles(data.principal === watchOnlyItem?.principal)}>
    <div className={getItemStyles()}>
      {isBeingEdited && !watchOnlyItem.isDelete ? (
        <CustomInput
          intent="primary"
          placeholder="Alias"
          value={watchOnlyItem?.alias || ""}
          border={watchOnlyItem.isValid ? undefined : "error"}
          sizeComp="small"
          sizeInput="small"
          inputClass="h-6"
          compOutClass="w-[11rem]"
          autoFocus
          onChange={onEditInputChanged}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSaveEdit();
          }}
        />
      ) : (
        <div className="w-full" onClick={() => onHistoricalSelectHandler(data.principal)}>
          <div className="flex items-center justify-between w-fit">
            <div className="font-bold text-md">{data?.alias}</div>
            <span className="mx-1 text-md"> | </span>
            <div className="text-md">{shortAddress(data.principal, 10, 10)}</div>
          </div>
        </div>
      )}

      {isBeingEdited && !watchOnlyItem.isDelete ? (
        <div className="flex">
          <div className="grid w-5 h-5 mr-1 rounded-sm cursor-pointer bg-slate-color-success place-items-center">
            <CheckIcon onClick={onSaveEdit} />
          </div>
          <div className="grid w-5 h-5 rounded-sm cursor-pointer bg-primary-color place-items-center">
            <Cross1Icon onClick={onCancelEdit} />
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="grid w-5 h-5 mr-1 rounded-sm cursor-pointer bg-primary-color place-items-center">
            <Pencil1Icon onClick={onEditAlias} />
          </div>
          <div className="grid w-5 h-5 rounded-sm cursor-pointer bg-slate-color-error place-items-center">
            <TrashIcon onClick={onDelete} />
          </div>
        </div>
      )}
    </div>
  );

  function onSaveEdit() {
    if (!watchOnlyItem || !watchOnlyItem?.isValid) return;
    updateWatchOnlySessionFromLocal(watchOnlyItem);

    const updated = getWatchOnlySessionsFromLocal();
    dispatch(setWatchOnlyHistory(updated));

    setWatchOnlyItem(null);
  }

  function onEditAlias() {
    setWatchOnlyItem({ ...data, isValid: true, isDelete: false });
  }

  function onDelete() {
    setWatchOnlyItem({ ...data, isValid: true, isDelete: true });
  }

  function onCancelEdit() {
    setWatchOnlyItem(null);
  }

  function onEditInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    // INFO: only allow alphanumeric characters and spaces
    const regexAliasValidation = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    const alias = event.target.value;
    const isValid = regexAliasValidation.test(alias) && alias.length <= 20;

    setWatchOnlyItem((prev) => {
      return { ...prev, alias, principal: data.principal, isValid, isDelete: false };
    });
  }
}

const getItemStyles = (isActive = false) =>
  clsx(
    "cursor-pointer",
    "flex items-center justify-between p-2",
    "text-black-color dark:text-white",
    "transition-all duration-100 ease-in-out",
    !isActive ? "hover:bg-gray-color-8/30" : null,
    isActive ? "bg-primary-color" : null,
  );
