import { ReactComponent as TrashDarkIcon } from "@/assets/svg/files/trash-icon.svg";
import { ReactComponent as PencilIcon } from "@assets/svg/files/pencil.svg";
import { ReactComponent as DotsIcon } from "@assets/svg/files/dots-icon.svg";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface ActionCardProps {
  onDrawerOpen: () => void;
}

export default function ActionCard(props: ActionCardProps) {
  const { onDrawerOpen } = props;
  const deleteRow = () => {
    console.log("delete");
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <span className="grid w-full py-3 cursor-pointer place-content-center">
          <DotsIcon />
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="flex flex-col w-32 mr-10 rounded-md border border-[#2B2759]" sideOffset={5}>
        <DropdownMenu.Item className="flex items-center justify-start bg-[#332F60] rounded-t-md" onClick={onDrawerOpen}>
          <PencilIcon className="mr-4" fill="#ffffff" />
          <p className="font-bold ">Edit</p>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={deleteRow} className="flex items-center justify-start bg-[#211E49] rounded-b-md">
          <TrashDarkIcon className="mr-4" fill="#B0736F" />
          <p className="font-bold text-[#B0736F] ">Delete</p>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
