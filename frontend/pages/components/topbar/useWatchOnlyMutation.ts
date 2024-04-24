import { updateWatchOnlySessionFromLocal } from "@pages/helpers/watchOnlyStorage";
import { Dispatch, SetStateAction } from "react";
import { EditWatchOnlyItem } from "./WatchOnlyRecords";
import { WatchOnlyItem } from "@pages/login/components/WatchOnlyInput";

interface Options {
  setWatchOnlyItem: Dispatch<SetStateAction<EditWatchOnlyItem | null>>;
  watchOnlyItem: EditWatchOnlyItem | null;
  data: WatchOnlyItem;
}

/**
 * Hook to handle the mutation of watch-only items, it depends on the useWatchOnly hook.
 */
export default function useWatchOnlyMutation({ setWatchOnlyItem, watchOnlyItem, data }: Options) {
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

  function onSaveEdit() {
    if (!watchOnlyItem || !watchOnlyItem?.isValid) return;
    updateWatchOnlySessionFromLocal(watchOnlyItem);
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

  return {
    onEditInputChanged,
    onSaveEdit,
    onDelete,
    onCancelEdit,
    onEditAlias,
  };
}
