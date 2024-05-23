import { ReactComponent as TrashDarkIcon } from "@/assets/svg/files/trash-icon.svg";
import { ReactComponent as PencilIcon } from "@assets/svg/files/pencil.svg";
import { ReactComponent as DotsIcon } from "@assets/svg/files/dots-icon.svg";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { TAllowance } from "@/@types/allowance";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { setIsDeleteAllowanceAction, setSelectedAllowanceAction } from "@redux/allowance/AllowanceActions";
import useAllowanceDrawer from "../hooks/useAllowanceDrawer";

interface ActionCardProps {
  allowance: TAllowance;
}

export default function ActionCard(props: ActionCardProps) {
  const { onOpenUpdateAllowanceDrawer } = useAllowanceDrawer();
  const { allowance } = props;
  const { t } = useTranslation();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <span className="cursor-pointer">
          <DotsIcon className="w-5 h-5 cursor-pointer stroke-gray-color-3 dark:fill-PrimaryColorLight fill-gray-color-3" />
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="flex flex-col w-32 mr-10 border rounded-md bg-PrimaryColorLight dark:border-BorderColor "
        sideOffset={5}
      >
        <DropdownMenu.Item
          className="flex items-center justify-start p-2 cursor-pointer dark:bg-secondary-color-6 rounded-t-md"
          onClick={onUpdateHandler}
        >
          <PencilIcon className="mr-4 fill-gray-color-3 dark:fill-gray-color-7" />
          <p className={getCellStyles()}>{t("edit")}</p>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={onDelete}>
          <div className="flex items-center justify-start p-2 cursor-pointer bg-ThirdColorLight dark:bg-secondary-color-2 rounded-b-md">
            <TrashDarkIcon className="mr-4 fill-slate-color-error" />
            <p className="font-bold text-slate-color-error ">{t("delete")}</p>
          </div>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );

  function onDelete() {
    setSelectedAllowanceAction(allowance);
    setIsDeleteAllowanceAction(true);
  }

  function onUpdateHandler() {
    setSelectedAllowanceAction({ ...allowance, amount: allowance?.amount?.replace(/,/g, "") || "0" });
    onOpenUpdateAllowanceDrawer();
  }
}

function getCellStyles(isOpacity = false) {
  return clsx("text-gray-color-3 dark:text-gray-color-7", isOpacity ? "opacity-50" : "");
}
