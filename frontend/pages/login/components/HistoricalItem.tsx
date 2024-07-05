import { CheckIcon, Cross1Icon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction } from "react";
import { WatchOnlyItem } from "@/pages/login/components/WatchOnlyInput";
import clsx from "clsx";
import { CustomInput } from "@components/input";
import { EditWatchOnlyItem } from "@pages/components/topbar/WatchOnlyRecords";
import DeleteWatchOnlyRecordModal from "@pages/components/topbar/DeleteWatchOnlyRecordModal";
import useWatchOnlyMutation from "@pages/components/topbar/useWatchOnlyMutation";
import { shortAddress } from "@common/utils/icrc";

interface HistoricalItemProps {
  onHistoricalSelectHandler: (principal: string) => void;
  data: WatchOnlyItem;
  isLast?: boolean;
  setWatchOnlyItem: Dispatch<SetStateAction<EditWatchOnlyItem | null>>;
  watchOnlyItem: EditWatchOnlyItem | null;
}

export default function HistoricalItem(props: HistoricalItemProps) {
  const { onHistoricalSelectHandler, data, setWatchOnlyItem, watchOnlyItem, isLast } = props;

  const { onEditInputChanged, onSaveEdit, onActivateDelete, onCancelEdit, onEditAlias } = useWatchOnlyMutation({
    setWatchOnlyItem,
    watchOnlyItem,
    data,
  });

  const isBeingEdited = watchOnlyItem?.principal?.toString() === data.principal;

  return (
    <div className={getItemStyles(data.principal === watchOnlyItem?.principal, isLast)}>
      {isBeingEdited && !watchOnlyItem.isDelete ? (
        <div className="flex items-center w-full">
          <CustomInput
            intent="primary"
            placeholder="Alias"
            value={watchOnlyItem?.alias || ""}
            border={watchOnlyItem.isValid ? undefined : "error"}
            sizeComp="small"
            sizeInput="small"
            inputClass="h-6"
            compOutClass="!w-[6rem]"
            autoFocus
            onChange={onEditInputChanged}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSaveEdit();
            }}
          />
          {data?.alias && <span className="mx-1 text-md"> | </span>}
          <div className="text-md ml-[0.5rem]">{shortAddress(data.principal, 10, 10)}</div>
        </div>
      ) : (
        <div className="w-full" onClick={() => onHistoricalSelectHandler(data.principal)}>
          <div className="flex items-center justify-between w-fit">
            {data?.alias && <div className="font-bold text-md">{data?.alias}</div>}
            {data?.alias && <span className="mx-1 text-md"> | </span>}
            <div className="text-md">{shortAddress(data.principal, 10, 10)}</div>
          </div>
        </div>
      )}

      {isBeingEdited && !watchOnlyItem.isDelete ? (
        <div className="flex">
          <div className="grid w-5 h-5 mr-1 rounded-sm cursor-pointer bg-black-color place-items-center">
            <CheckIcon onClick={onSaveEdit} className="w-3 h-3 text-white" />
          </div>
          <div className="grid w-5 h-5 rounded-sm cursor-pointer bg-black-color place-items-center">
            <Cross1Icon onClick={onCancelEdit} className="w-3 h-3 text-white" />
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="grid w-5 h-5 mr-1 rounded-sm cursor-pointer bg-black-color place-items-center">
            <Pencil1Icon onClick={onEditAlias} className="w-3 h-3 text-white" />
          </div>
          <div className="grid w-5 h-5 rounded-sm cursor-pointer bg-slate-color-error place-items-center">
            <TrashIcon onClick={onActivateDelete} className="w-3 h-3 text-white" />
          </div>
        </div>
      )}

      {watchOnlyItem?.isDelete && (
        <DeleteWatchOnlyRecordModal
          setWatchOnlyItem={setWatchOnlyItem}
          record={watchOnlyItem}
          onClose={() => setWatchOnlyItem(null)}
        />
      )}
    </div>
  );
}

const getItemStyles = (isActive = false, isLast = false) =>
  clsx(
    "cursor-pointer",
    "flex items-center justify-between p-2",
    "text-black-color dark:text-white",
    "transition-all duration-100 ease-in-out",
    {
      "border-b-2 dark:border-black-color": !isLast,
      "rounded-b-md": isLast,
      "hover:bg-gray-color-8/30": !isActive,
      "bg-primary-color": isActive,
    }
  );
