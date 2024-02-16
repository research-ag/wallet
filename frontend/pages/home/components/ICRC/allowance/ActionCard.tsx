import { ReactComponent as TrashDarkIcon } from "@/assets/svg/files/trash-icon.svg";
import { ReactComponent as PencilIcon } from "@assets/svg/files/pencil.svg";
import { ReactComponent as DotsIcon } from "@assets/svg/files/dots-icon.svg";
import { ReactComponent as AlertIcon } from "@assets/svg/files/alert-icon.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close-icon.svg";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { TAllowance } from "@/@types/allowance";
import { Modal } from "@components/modal";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import useDeleteAllowance from "@pages/home/hooks/useDeleteAllowance";
import { middleTruncation } from "@/utils/strings";
import { useAppSelector } from "@redux/Store";
import useAllowanceDrawer from "@pages/home/hooks/useAllowanceDrawer";
import { useMemo, useState } from "react";
import { setSelectedAllowanceAction } from "@redux/allowance/AllowanceActions";

interface ActionCardProps {
  allowance: TAllowance;
}

export default function ActionCard(props: ActionCardProps) {
  const { contacts } = useAppSelector((state) => state.contacts);
  const [isOpen, setOpen] = useState(false);
  const { onOpenUpdateAllowanceDrawer } = useAllowanceDrawer();
  const { allowance } = props;
  const { t } = useTranslation();
  const { deleteAllowance, isPending } = useDeleteAllowance();

  const spenderName = useMemo(() => {
    const contact = contacts.find((contact) => contact.principal === allowance?.spender?.principal);
    return contact?.name ? contact.name : undefined;
  }, [allowance, contacts]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <span className="grid w-full cursor-pointer place-content-center">
          <DotsIcon className="w-6 h-6 cursor-pointer stroke-gray-color-3 dark:fill-PrimaryColorLight fill-gray-color-3" />
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
        <Modal
          triggerComponent={
            <div className="flex items-center justify-start p-2 cursor-pointer bg-ThirdColorLight dark:bg-secondary-color-2 rounded-b-md">
              <TrashDarkIcon className="mr-4 fill-slate-color-error" />
              <p className="font-bold text-slate-color-error ">{t("delete")}</p>
            </div>
          }
          contentComponent={<ContentComponent />}
          cancelComponent={<CloseIcon />}
          onConfirm={handleDelete}
          icon={<AlertIcon className="w-6 h-6" />}
          isLoading={isPending}
          disabled={isPending}
          isOpen={isOpen}
          onOpenChange={(open) => setOpen(open)}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );

  function ContentComponent() {
    return (
      <div className="mt-4">
        <p className={textStyles}>
          {t("allowance.sure.remove")}{" "}
          <span className="font-bold">{spenderName || middleTruncation(allowance.spender.principal, 4, 4)}</span>?
        </p>
        <p className={textStyles}>{t("allowance.permanently.deleted")}</p>
      </div>
    );
  }

  function onUpdateHandler() {
    setSelectedAllowanceAction(allowance);
    onOpenUpdateAllowanceDrawer();
  }

  async function handleDelete() {
    if (!allowance) return;
    deleteAllowance(allowance);
    setOpen(false);
  }
}

function getCellStyles(isOpacity = false) {
  return clsx("text-gray-color-3 dark:text-gray-color-7", isOpacity ? "opacity-50" : "");
}

const textStyles = clsx("text-gray-color-3 dark:text-gray-color-7");
