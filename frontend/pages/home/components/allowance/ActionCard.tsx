import { ReactComponent as TrashDarkIcon } from "@/assets/svg/files/trash-icon.svg";
import { ReactComponent as PencilIcon } from "@assets/svg/files/pencil.svg";
import { ReactComponent as DotsIcon } from "@assets/svg/files/dots-icon.svg";
import { ReactComponent as AlertIcon } from "@assets/svg/files/alert-icon.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close-icon.svg";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Allowance } from "@/@types/allowance";
import { Modal } from "@components/modal";
import {
  EditActionType,
  setEditAllowanceDrawerState,
  setSelectedAllowanceAction,
} from "@redux/allowances/AllowanceActions";
import { useDeleteAllowance } from "@pages/home/hooks/useDeleteAllowance";
import clsx from "clsx";
import { ThemeHook } from "@/hooks/themeHook";
import { ThemesEnum } from "@/const";

interface ActionCardProps {
  allowance: Allowance;
  refetchAllowances: () => void;
}

export default function ActionCard(props: ActionCardProps) {
  const { allowance, refetchAllowances } = props;
  const { deleteAllowance, isPending } = useDeleteAllowance();
  const { theme } = ThemeHook();

  const handleDelete = async () => {
    if (!allowance.id) return;
    deleteAllowance(allowance.id);
    refetchAllowances();
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <span className="grid w-full py-3 cursor-pointer place-content-center">
          <DotsIcon className="w-6 h-6 cursor-pointer stroke-PrimaryTextColorLight dark:fill-PrimaryColorLight fill-PrimaryTextColorLight" />
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="flex flex-col w-32 mr-10 border rounded-md dark:border-BorderColor"
        sideOffset={5}
      >
        <DropdownMenu.Item
          className="flex items-center justify-start p-2 cursor-pointer dark:bg-PopSelectColor rounded-t-md"
          onClick={() => {
            setSelectedAllowanceAction(allowance);
            setEditAllowanceDrawerState(EditActionType.openDrawer);
          }}
        >
          <PencilIcon className="mr-4" fill={theme === ThemesEnum.Enum.light ? "#000000" : "#ffffff"} />
          <p className={getCellStyles()}>Edit</p>
        </DropdownMenu.Item>
        <Modal
          triggerComponent={
            <div className="flex items-center justify-start p-2 cursor-pointer bg-ThirdColorLight dark:bg-SecondaryColor rounded-b-md">
              <TrashDarkIcon className="mr-4" fill="#B0736F" />
              <p className="font-bold text-LockColor ">Delete</p>
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
        <p className={textStyles}>
          Are you sure you want to Remove <span className="font-bold">{allowance.spender.name}</span>?
        </p>
        <p className={textStyles}>This Allowance will be permanently deleted.</p>
      </div>
    );
  }
}

const getCellStyles = (isOpacity = false) =>
  clsx("text-PrimaryTextColorLight dark:text-PrimaryTextColor", isOpacity ? "opacity-50" : "");

const textStyles = clsx("text-PrimaryTextColorLight dark:text-PrimaryTextColor");
