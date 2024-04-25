import { getWatchOnlySessionsFromLocal, updateWatchOnlySessionFromLocal } from "@pages/helpers/watchOnlyStorage";
import { Dispatch, SetStateAction } from "react";
import { EditWatchOnlyItem } from "./WatchOnlyRecords";
import { WatchOnlyItem } from "@pages/login/components/WatchOnlyInput";
import { setReduxWatchOnlyHistory } from "@redux/auth/AuthReducer";
import { useAppDispatch } from "@redux/Store";

interface Options {
  setWatchOnlyItem: Dispatch<SetStateAction<EditWatchOnlyItem | null>>;
  watchOnlyItem: EditWatchOnlyItem | null;
  data: WatchOnlyItem;
}

export const MAX_ALIAS_LENGTH = 10;
export const MAX_ALIAS_ADDRESS_LENGTH = 24;

/**
 * Hook to handle the mutation of watch-only items, it depends on the useWatchOnly hook.
 */
export default function useWatchOnlyMutation({ setWatchOnlyItem, watchOnlyItem, data }: Options) {
  const dispatch = useAppDispatch();

  function onEditInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    // INFO: only allow alphanumeric characters and spaces
    const regexAliasValidation = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    const alias = event.target.value;
    const isValid = regexAliasValidation.test(alias) && alias.length <= MAX_ALIAS_LENGTH;

    setWatchOnlyItem((prev) => {
      return { ...prev, alias, principal: data.principal, isValid, isDelete: false };
    });
  }

  function onSaveEdit() {
    if (!watchOnlyItem || !watchOnlyItem?.isValid) return;

    updateWatchOnlySessionFromLocal({
      alias: watchOnlyItem.alias,
      principal: watchOnlyItem.principal,
    });

    const updated = getWatchOnlySessionsFromLocal();
    dispatch(setReduxWatchOnlyHistory(updated));
    setWatchOnlyItem(null);
  }

  function onActivateDelete() {
    setWatchOnlyItem({ ...data, isValid: true, isDelete: true });
  }

  function onCancelEdit() {
    setWatchOnlyItem(null);
  }

  function onEditAlias() {
    setWatchOnlyItem({ ...data, isValid: true, isDelete: false });
  }

  return {
    onEditInputChanged,
    onSaveEdit,
    onActivateDelete,
    onCancelEdit,
    onEditAlias,
  };
}
