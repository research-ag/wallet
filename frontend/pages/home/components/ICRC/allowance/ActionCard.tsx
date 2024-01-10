import { ReactComponent as TrashDarkIcon } from "@/assets/svg/files/trash-icon.svg";
import { ReactComponent as PencilIcon } from "@assets/svg/files/pencil.svg";
import { ReactComponent as DotsIcon } from "@assets/svg/files/dots-icon.svg";
import { ReactComponent as AlertIcon } from "@assets/svg/files/alert-icon.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close-icon.svg";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { TAllowance } from "@/@types/allowance";
import { Modal } from "@components/modal";
import clsx from "clsx";
import { ThemesEnum } from "@/const";
import { useTranslation } from "react-i18next";
import useDeleteAllowance from "@pages/home/hooks/useDeleteAllowance";
import { ThemeHook } from "@pages/hooks/themeHook";
import { middleTruncation } from "@/utils/strings";
import { useAppDispatch } from "@redux/Store";
import { setSelectedAllowance } from "@redux/allowance/AllowanceReducer";
import useAllowanceDrawer from "@pages/home/hooks/useAllowanceDrawer";

interface ActionCardProps {
  allowance: TAllowance;
  refetchAllowances: () => void;
}

export default function ActionCard(props: ActionCardProps) {
  const { onOpenUpdateAllowanceDrawer } = useAllowanceDrawer();
  const dispatch = useAppDispatch();
  const { allowance, refetchAllowances } = props;
  const { t } = useTranslation();
  const { deleteAllowance, isPending } = useDeleteAllowance();
  const { theme } = ThemeHook();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <span className="grid w-full py-3 cursor-pointer place-content-center">
          <DotsIcon className="w-6 h-6 cursor-pointer stroke-PrimaryTextColorLight dark:fill-PrimaryColorLight fill-PrimaryTextColorLight" />
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="flex flex-col w-32 mr-10 border rounded-md bg-PrimaryColorLight dark:border-BorderColor "
        sideOffset={5}
      >
        <DropdownMenu.Item
          className="flex items-center justify-start p-2 cursor-pointer dark:bg-PopSelectColor rounded-t-md"
          onClick={onUpdateHandler}
        >
          <PencilIcon className="mr-4" fill={theme === ThemesEnum.Enum.light ? "#000000" : "#ffffff"} />
          <p className={getCellStyles()}>{t("edit")}</p>
        </DropdownMenu.Item>
        <Modal
          triggerComponent={
            <div className="flex items-center justify-start p-2 cursor-pointer bg-ThirdColorLight dark:bg-SecondaryColor rounded-b-md">
              <TrashDarkIcon className="mr-4" fill="#B0736F" />
              <p className="font-bold text-LockColor ">{t("delete")}</p>
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
          {t("allowance.sure.remove")}{" "}
          <span className="font-bold">
            {allowance.spender.name || middleTruncation(allowance.spender.principal, 4, 4)}
          </span>
          ?
        </p>
        <p className={textStyles}>{t("allowance.permanently.deleted")}</p>
      </div>
    );
  }

  function onUpdateHandler() {
    dispatch(setSelectedAllowance(allowance));
    onOpenUpdateAllowanceDrawer();
  }

  async function handleDelete() {
    if (!allowance.id) return;
    deleteAllowance(allowance);
    // TODO: refetch allowances not from props instead from query functions
    refetchAllowances();
  }
}

function getCellStyles(isOpacity = false) {
  return clsx("text-PrimaryTextColorLight dark:text-PrimaryTextColor", isOpacity ? "opacity-50" : "");
}

const textStyles = clsx("text-PrimaryTextColorLight dark:text-PrimaryTextColor");
