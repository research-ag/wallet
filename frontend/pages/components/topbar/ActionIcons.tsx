import { CheckIcon, Cross1Icon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { EditWatchOnlyItem } from "./WatchOnlyRecords";

interface ActionIconsProps {
  isBeingEdited: boolean;
  watchOnlyItem: EditWatchOnlyItem | null;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditAlias: () => void;
  onActivateDelete: () => void;
  isCurrentUser: boolean;
}

export default function ActionIcons(props: ActionIconsProps) {
  const { isBeingEdited, watchOnlyItem, onSaveEdit, onCancelEdit, onEditAlias, onActivateDelete, isCurrentUser } =
    props;

  return (
    <>
      {isBeingEdited && !watchOnlyItem?.isDelete ? (
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

          {!isCurrentUser && (
            <div className="grid w-5 h-5 rounded-sm cursor-pointer bg-slate-color-error place-items-center">
              <TrashIcon onClick={onActivateDelete} className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      )}
    </>
  );
}
