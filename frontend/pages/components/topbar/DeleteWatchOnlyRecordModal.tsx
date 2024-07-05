import { BasicModal } from "@components/modal";
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
import { WatchOnlyItem } from "@pages/login/components/WatchOnlyInput";
import { useTranslation } from "react-i18next";
import { Cross1Icon } from "@radix-ui/react-icons";
import { deleteWatchOnlySessionFromLocal, getWatchOnlySessionsFromLocal } from "@pages/helpers/watchOnlyStorage";
import { Dispatch, SetStateAction } from "react";
import { EditWatchOnlyItem } from "./WatchOnlyRecords";
import { setReduxWatchOnlyHistory } from "@redux/auth/AuthReducer";
import { useAppDispatch } from "@redux/Store";
import { shortAddress } from "@common/utils/icrc";

interface DeleteWatchOnlyRecordModalProps {
  record: WatchOnlyItem;
  onClose: () => void;
  setWatchOnlyItem: Dispatch<SetStateAction<EditWatchOnlyItem | null>>;
}

export default function DeleteWatchOnlyRecordModal({
  record,
  onClose,
  setWatchOnlyItem,
}: DeleteWatchOnlyRecordModalProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <BasicModal
      open={true}
      width="w-[20rem]"
      padding="py-3 px-1"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
    >
      <div className="flex justify-between w-full px-2">
        <WarningIcon className="w-6 h-6" />
        <Cross1Icon className="self-end mt-1 mr-2 cursor-pointer" onClick={onClose} />
      </div>

      <div className="px-2">
        <p className="my-2 text-lg text-left">{t("watchOnlyMode.delete.message")}</p>

        <span className="font-bold text-left">
          {record?.alias ? record?.alias : "-"} ({shortAddress(record?.principal, 10, 10)})
        </span>
      </div>

      <div className="flex justify-between w-full px-4 mt-2">
        <span></span>
        <button
          className="flex justify-center items-center ml-2 p-0.5 bg-slate-color-error rounded cursor-pointer"
          onClick={onDelete}
        >
          <p className="px-2 py-1 font-bold text-md text-secondary-color-1-light">{t("delete")}</p>
        </button>
      </div>
    </BasicModal>
  );

  function onDelete() {
    deleteWatchOnlySessionFromLocal(record?.principal);
    setWatchOnlyItem(null);
    const updated = getWatchOnlySessionsFromLocal();
    dispatch(setReduxWatchOnlyHistory(updated));
    onClose();
  }
}
