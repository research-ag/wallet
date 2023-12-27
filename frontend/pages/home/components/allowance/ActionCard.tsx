import { ReactComponent as TrashDarkIcon } from "@/assets/svg/files/trash-icon.svg";
import { ReactComponent as PencilIcon } from "@assets/svg/files/pencil.svg";
import { ReactComponent as DotsIcon } from "@assets/svg/files/dots-icon.svg";
import { ReactComponent as AlertIcon } from "@assets/svg/files/alert-icon.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close-icon.svg";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useDeleteAllowance } from "@pages/home/hooks/useAllowanceMutation";
import { Allowance } from "@/@types/allowance";
import { useState } from "react";

interface ActionCardProps {
  onDrawerOpen: () => void;
  allowance: Allowance;
}

export default function ActionCard(props: ActionCardProps) {
  const [openModal, setModal] = useState(false);
  const { onDrawerOpen, allowance } = props;

  const { deleteAllowance } = useDeleteAllowance();

  const deleteRow = async () => () => setModal(true);

  const handleDelete = async (open: boolean) => {
    console.log(open);
    setModal(false);
  };

  return (
    <DropdownMenu.Root>
      <Modal open={openModal} />
      <DropdownMenu.Trigger asChild>
        <span className="grid w-full py-3 cursor-pointer place-content-center">
          <DotsIcon />
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="flex flex-col w-32 mr-10 rounded-md border border-[#2B2759]" sideOffset={5}>
        <DropdownMenu.Item
          className="flex items-center justify-start bg-[#332F60] rounded-t-md p-2 cursor-pointer"
          onClick={onDrawerOpen}
        >
          <PencilIcon className="mr-4" fill="#ffffff" />
          <p className="font-bold ">Edit</p>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={deleteRow}
          className="flex items-center justify-start bg-[#211E49] rounded-b-md p-2 cursor-pointer"
        >
          <TrashDarkIcon className="mr-4" fill="#B0736F" />
          <p className="font-bold text-[#B0736F] ">Delete</p>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

interface IProps {
  open: boolean;
}

function Modal({ open }: IProps) {
  return (
    <div
      className={`fixed bg-black/10 z-[1000] bottom-0 right-0 top-0 left-0 grid place-items-center ${
        !open ? "hidden" : ""
      }`}
    >
      <div className="bg-[#211E49] w-[28rem] p-4 rounded-lg border border-[#444277]">
        <div className="flex items-center justify-between mb-4">
          <AlertIcon className="w-6 h-6" />
          <CloseIcon className="w-6 h-6 ml-auto" />
        </div>
        <div className="">
          <p className="text-lg">
            Are you sure you want to Remove <span className="font-bold">Jack MackDonald</span>
          </p>
          <p>This Allowance will be permanently deleted.</p>
        </div>
        <div className="flex items-center justify-end mt-4">
          <button className="bg-[#33B2EF] rounded-lg w-24">Yes</button>
        </div>
      </div>
    </div>
  );
}
