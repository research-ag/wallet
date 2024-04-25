import { CustomInput } from "@components/input";
import { SetStateAction, Dispatch } from "react";
import { shortAddress } from "@/utils";
import DeleteWatchOnlyRecordModal from "./DeleteWatchOnlyRecordModal";
import { EditWatchOnlyItem } from "./WatchOnlyRecords";
import { WatchOnlyItem } from "@pages/login/components/WatchOnlyInput";
import { handlePrincipalAuthenticated } from "@redux/CheckAuth";
import clsx from "clsx";
import useWatchOnlyMutation, { MAX_ALIAS_ADDRESS_LENGTH } from "./useWatchOnlyMutation";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import ActionIcons from "./ActionIcons";
import { clearDataContacts } from "@redux/contacts/ContactsReducer";
import { setTransactions } from "@redux/transaction/TransactionReducer";
import { setReduxAllowances } from "@redux/allowance/AllowanceReducer";

interface WatchOnlyRecordProps {
  watchOnlyItem: EditWatchOnlyItem | null;
  setWatchOnlyItem: Dispatch<SetStateAction<EditWatchOnlyItem | null>>;
  data: WatchOnlyItem;
}

export default function WatchOnlyRecord(props: WatchOnlyRecordProps) {
  const { userPrincipal } = useAppSelector((state) => state.auth);
  const { data, watchOnlyItem, setWatchOnlyItem } = props;
  const dispatch = useAppDispatch();

  const { onEditInputChanged, onSaveEdit, onDelete, onCancelEdit, onEditAlias } = useWatchOnlyMutation({
    setWatchOnlyItem,
    watchOnlyItem,
    data,
  });

  const isBeingEdited = watchOnlyItem?.principal?.toString() === data.principal;
  const isCurrentUser = data.principal === userPrincipal.toString();
  const spaces = Math.floor((MAX_ALIAS_ADDRESS_LENGTH - (data?.alias?.length || 0)) / 3);

  return (
    <div key={data.principal} className={getItemStyles(data.principal === watchOnlyItem?.principal)}>
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
            compOutClass="!max-w-[4rem]"
            autoFocus
            onChange={onEditInputChanged}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSaveEdit();
            }}
          />
          {data?.alias && <span className="mx-1 text-md"> | </span>}
          <div className="text-md">{shortAddress(data.principal, spaces, spaces)}</div>
        </div>
      ) : (
        <div className="w-full" onClick={onChangeSession}>
          <div className="flex items-center justify-between w-fit">
            {data?.alias && <div className="font-bold text-md">{data?.alias}</div>}
            {data?.alias && <span className="mx-1 text-md"> | </span>}
            <div className="text-md">{shortAddress(data.principal, 5, 5)}</div>
          </div>
        </div>
      )}

      {isCurrentUser && !isBeingEdited && <span className="w-2 h-2 mr-3 bg-slate-color-success rounded-full"></span>}

      <ActionIcons
        isBeingEdited={isBeingEdited}
        watchOnlyItem={watchOnlyItem}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        onEditAlias={onEditAlias}
        onDelete={onDelete}
        isCurrentUser={isCurrentUser}
      />

      {watchOnlyItem?.isDelete && (
        <DeleteWatchOnlyRecordModal
          setWatchOnlyItem={setWatchOnlyItem}
          record={watchOnlyItem}
          onClose={() => setWatchOnlyItem(null)}
        />
      )}
    </div>
  );

  async function onChangeSession() {
    dispatch(setTransactions([]));
    dispatch(clearDataContacts());
    dispatch(setReduxAllowances([]));
    if (!isCurrentUser) await handlePrincipalAuthenticated(data.principal);
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
