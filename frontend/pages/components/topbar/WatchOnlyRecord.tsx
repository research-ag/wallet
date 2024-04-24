import { CustomInput } from "@components/input";
import { SetStateAction, Dispatch, ChangeEvent } from "react";
import { useAppDispatch } from "@redux/Store";
import { shortAddress } from "@/utils";
import { CheckIcon, Cross1Icon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { setWatchOnlyHistory } from "@redux/common/CommonReducer";
import DeleteWatchOnlyRecordModal from "./DeleteWatchOnlyRecordModal";
import { EditWatchOnlyItem } from "./WatchOnlyRecords";
import { WatchOnlyItem } from "@pages/login/components/WatchOnlyInput";
import { getWatchOnlySessionsFromLocal, updateWatchOnlySessionFromLocal } from "@pages/helpers/watchOnlyStorage";
import { handlePrincipalAuthenticated } from "@redux/CheckAuth";
import clsx from "clsx";

interface WatchOnlyRecordProps {
  watchOnlyItem: EditWatchOnlyItem | null;
  setWatchOnlyItem: Dispatch<SetStateAction<EditWatchOnlyItem | null>>;
  data: WatchOnlyItem;
  start: number;
  end: number;
}

export default function WatchOnlyRecord(props: WatchOnlyRecordProps) {
  const { data, watchOnlyItem, setWatchOnlyItem } = props;
  const dispatch = useAppDispatch();
  const isBeingEdited = watchOnlyItem?.principal?.toString() === data.principal;

  return (
    <div key={data.principal} className={getItemStyles(data.principal === watchOnlyItem?.principal)}>
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
        <div className="w-full" onClick={onChangeSession}>
          <div className="flex items-center justify-between w-fit">
            {data?.alias && <div className="font-bold text-md">{data?.alias}</div>}
            {data?.alias && <span className="mx-1 text-md"> | </span>}
            <div className="text-md">{shortAddress(data.principal, 5, 5)}</div>
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
            <TrashIcon onClick={onDelete} className="w-3 h-3 text-white" />
          </div>
        </div>
      )}

      {watchOnlyItem?.isDelete && (
        <DeleteWatchOnlyRecordModal record={watchOnlyItem} onClose={() => setWatchOnlyItem(null)} />
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
      return { ...prev, alias, principal: data.principal, isValid, isDelete: false };
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
    setWatchOnlyItem({ ...data, isValid: true, isDelete: true });
  }

  function onCancelEdit() {
    setWatchOnlyItem(null);
  }

  function onEditAlias() {
    setWatchOnlyItem({ ...data, isValid: true, isDelete: false });
  }

  async function onChangeSession() {
    await handlePrincipalAuthenticated(data.principal);
  }
}

const getItemStyles = (isActive = false) =>
  clsx(
    "cursor-pointer border-b-2 dark:border-black-color",
    "flex items-center justify-between p-2",
    "text-black-color dark:text-white",
    "transition-all duration-100 ease-in-out",
    !isActive ? "hover:bg-gray-color-8/30" : null,
    isActive ? "bg-primary-color" : null,
  );
