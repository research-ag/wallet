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

interface WatchOnlyRecordProps {
  watchOnlyItem: EditWatchOnlyItem | null;
  setWatchOnlyItem: Dispatch<SetStateAction<EditWatchOnlyItem | null>>;
  data: WatchOnlyItem;
  start: number;
  end: number;
}

export default function WatchOnlyRecord(props: WatchOnlyRecordProps) {
  const { data, start, end, watchOnlyItem, setWatchOnlyItem } = props;
  const dispatch = useAppDispatch();
  const isBeingEdited = watchOnlyItem?.principal?.toString() === data.principal;

  return (
    <div
      key={data.principal}
      className="flex items-center justify-between p-1 cursor-pointer dark:hover:bg-secondary-color-1 hover:bg-secondary-color-1-light"
    >
      {isBeingEdited && !watchOnlyItem.isDelete ? (
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
          onKeyDown={(e) => { if (e.key === "Enter") onSaveEdit(); }}
        />
      ) : (
        <div className="text-md" onClick={onChangeSession} onDoubleClick={onEditAlias}>
          {data.alias ? data.alias : "-"}
          <span className="text-sm text-gray-400">
            {" "}
            (
            {shortAddress(data.principal, start - (data?.alias?.length || 0) / 2, end - (data?.alias?.length || 0) / 2)}
            )
          </span>
        </div>
      )}

      {isBeingEdited && !watchOnlyItem.isDelete ? (
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
