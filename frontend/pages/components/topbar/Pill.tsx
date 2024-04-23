import { shortAddress } from "@/utils";
import { CustomInput } from "@components/input";
import { WatchOnlyItem } from "@pages/login/components/WatchOnlyInput";
import { CheckIcon, ChevronDownIcon, ChevronLeftIcon, Cross1Icon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { setWatchOnlyHistory } from "@redux/common/CommonReducer";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

interface PillProps {
  text: string;
  start: number;
  end: number;
  icon?: string;
}

export default function Pill({ text, start, end, icon }: PillProps) {
  const { watchOnlyMode } = useAppSelector((state) => state.auth);
  const [historicalOpen, setHistoricalOpen] = useState(false);

  return (
    <div className="relative">
      <div className="px-3 py-1 rounded-full bg-GrayColor/50">
        <div className="flex items-center justify-center w-full gap-2 whitespace-nowrap">
          <img src={icon} alt="icon" className="w-5" />
          {shortAddress(text, start, end)}
          {watchOnlyMode &&
            (historicalOpen ? (
              <ChevronDownIcon className="w-4 h-4 cursor-pointer" onClick={onOpenHistorical} />
            ) : (
              <ChevronLeftIcon className="w-4 h-4 cursor-pointer" onClick={onOpenHistorical} />
            ))}
        </div>
      </div>

      {watchOnlyMode && historicalOpen && <SessionList start={start} end={end} />}
    </div>
  );

  function onOpenHistorical() {
    setHistoricalOpen((prev) => !prev);
  }
}

// -------------------------------------- COMPONENT ---------------------------------------- //

interface SessionListProps {
  start: number;
  end: number;
}

interface EditWatchOnlyItem extends Pick<WatchOnlyItem, "principal" | "alias"> {
  isValid: boolean;
}

function SessionList({ start, end }: SessionListProps) {
  const { watchOnlyHistory } = useAppSelector((state) => state.common);
  const [watchOnlyItem, setWatchOnlyItem] = useState<EditWatchOnlyItem | null>(null);
  console.log("watchOnlyItem", watchOnlyItem);

  return (
    <div className="absolute z-10 w-full max-h-[10rem] overflow-y-auto  scroll-y-light bg-white dark:bg-level-1-color text-left mt-1 rounded-lg shadow-lg">
      {watchOnlyHistory.map((data) => (
        <Element
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

// ------------------------------------ COMPONENT --------------------------------------- //

interface ElementProps {
  watchOnlyItem: EditWatchOnlyItem | null;
  setWatchOnlyItem: Dispatch<SetStateAction<EditWatchOnlyItem | null>>;
  data: WatchOnlyItem;
  start: number;
  end: number;
}

function Element({ data, start, end, watchOnlyItem, setWatchOnlyItem }: ElementProps) {
  const dispatch = useAppDispatch();
  const isBeingEdited = watchOnlyItem?.principal?.toString() === data.principal;

  return (
    <div
      key={data.principal}
      className="flex items-center justify-between p-1 cursor-pointer dark:hover:bg-secondary-color-2 hover:bg-secondary-color-2-light"
    >
      {isBeingEdited ? (
        <CustomInput
          intent="primary"
          placeholder="Alias"
          value={watchOnlyItem?.alias || ""}
          border={watchOnlyItem.isValid ? undefined : "error"}
          sizeComp="small"
          sizeInput="small"
          inputClass="h-6"
          autoFocus
          onChange={onEditInputChanged}
        />
      ) : (
        <div className="text-md" onClick={onChangeSession}>
          {data.alias ? data.alias : "-"}
          <span className="text-gray-400">
            {" "}
            ({shortAddress(data.principal, start, end - (data?.alias?.length || 0))})
          </span>
        </div>
      )}

      {isBeingEdited ? (
        <div className="flex">
          <Cross1Icon className="w-3 h-3 ml-1" onClick={onCancelEdit} />
          <CheckIcon className="w-3 h-3 ml-1" onClick={onSaveEdit} />
        </div>
      ) : (
        <div className="flex">
          <Pencil1Icon className="w-3 h-3 ml-1" onClick={onEditAlias} />
          <TrashIcon className="w-3 h-3 ml-1" onClick={onDelete} />
        </div>
      )}
    </div>
  );

  function onEditInputChanged(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    // INFO: only allow alphanumeric characters and spaces
    const regexAliasValidation = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    const alias = event.target.value;
    const isValid = regexAliasValidation.test(alias) && alias.length <= 20;

    setWatchOnlyItem((prev) => {
      return { ...prev, alias, principal: data.principal, isValid };
    });
  }

  function onSaveEdit() {
    if (!watchOnlyItem || !watchOnlyItem?.isValid) return;
    updateWatchOnlySessionFromLocal(watchOnlyItem);

    const updated = getWatchOnlySessionsFromLocal();
    dispatch(setWatchOnlyHistory(updated));

    setWatchOnlyItem(null);
  }

  function onDelete() {
    console.log("onDelete");
    setWatchOnlyItem(null);
  }

  function onCancelEdit() {
    console.log("onCancelEdit");
    setWatchOnlyItem(null);
  }

  function onEditAlias() {
    console.log("onEditAlias");
    setWatchOnlyItem({ ...data, isValid: true });
  }

  function onChangeSession() {
    console.log("onChangeSession");
    setWatchOnlyItem(null);
  }
}

// ------------------------------------ UTILS --------------------------------------- //

export function getWatchOnlySessionsFromLocal(): WatchOnlyItem[] {
  const watchOnlyItems = localStorage.getItem("watch-only-sessions");
  return watchOnlyItems ? JSON.parse(watchOnlyItems) : [];
}

export function setWatchOnlySessionsToLocal(watchOnlyItems: WatchOnlyItem[]) {
  localStorage.setItem("watch-only-sessions", JSON.stringify(watchOnlyItems));
}

export function addWatchOnlySessionToLocal(newWatchOnlyItem: WatchOnlyItem) {
  const watchOnlyItems = getWatchOnlySessionsFromLocal();
  const isAlreadyAdded = watchOnlyItems.some((item) => item.principal === newWatchOnlyItem.principal);

  if (isAlreadyAdded) return;
  const updatedWatchOnlyItems = [...watchOnlyItems, newWatchOnlyItem];
  setWatchOnlySessionsToLocal(updatedWatchOnlyItems);
}

export function deleteWatchOnlySessionFromLocal(principal: string) {
  const watchOnlyItems = getWatchOnlySessionsFromLocal();
  const updatedWatchOnlyItems = watchOnlyItems.filter((item) => item.principal !== principal);
  setWatchOnlySessionsToLocal(updatedWatchOnlyItems);
}

export function updateWatchOnlySessionFromLocal(updatedWatchOnlyItem: WatchOnlyItem) {
  const watchOnlyItems = getWatchOnlySessionsFromLocal();
  const updatedWatchOnlyItems = watchOnlyItems.map((item) => {
    if (item.principal === updatedWatchOnlyItem.principal) {
      return updatedWatchOnlyItem;
    }
    return item;
  });

  setWatchOnlySessionsToLocal(updatedWatchOnlyItems);
}
