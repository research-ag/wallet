import { ReactComponent as TrashDarkIcon } from "@/assets/svg/files/trash-icon.svg";
import { ReactComponent as PencilIcon } from "@assets/svg/files/pencil.svg";
import { ReactComponent as DotsIcon } from "@assets/svg/files/dots-icon.svg";
import { ReactComponent as AlertIcon } from "@assets/svg/files/alert-icon.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close-icon.svg";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Allowance } from "@/@types/allowance";
import { Modal } from "@components/core/modal";
import {
  EditActionType,
  setEditAllowanceDrawerState,
  setSelectedAllowanceAction,
} from "@redux/allowances/AllowanceActions";
import { useDeleteAllowance } from "@pages/home/hooks/useDeleteAllowance";

interface ActionCardProps {
  allowance: Allowance;
  refetchAllowances: () => void;
}

export default function ActionCard(props: ActionCardProps) {
  const { allowance, refetchAllowances } = props;
  const { deleteAllowance, isPending } = useDeleteAllowance();

  const handleDelete = async () => {
    deleteAllowance(allowance.id);
    refetchAllowances();
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <span className="grid w-full py-3 cursor-pointer place-content-center">
          <DotsIcon />
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="flex flex-col w-32 mr-10 rounded-md border border-[#2B2759]" sideOffset={5}>
        <DropdownMenu.Item
          className="flex items-center justify-start bg-[#332F60] rounded-t-md p-2 cursor-pointer"
          onClick={() => {
            setSelectedAllowanceAction(allowance);
            setEditAllowanceDrawerState(EditActionType.openDrawer);
          }}
        >
          <PencilIcon className="mr-4" fill="#ffffff" />
          <p className="font-bold ">Edit</p>
        </DropdownMenu.Item>
        <Modal
          triggerComponent={
            <div className="flex items-center justify-start bg-[#211E49] rounded-b-md p-2 cursor-pointer">
              <TrashDarkIcon className="mr-4" fill="#B0736F" />
              <p className="font-bold text-[#B0736F] ">Delete</p>
            </div>
          }
          contentComponent={<ContentComponent />}
          cancelComponent={<CloseIcon />}
          onConfirm={handleDelete}
          icon={<AlertIcon className="w-6 h-6" />}
          isLoading={isPending}
          disabled={isPending}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );

  function ContentComponent() {
    return (
      <div className="mt-4">
        <p className="text-lg">
          Are you sure you want to Remove <span className="font-bold">Jack McDonald</span>?
        </p>
        <p>This Allowance will be permanently deleted.</p>
      </div>
    );
  }
}
