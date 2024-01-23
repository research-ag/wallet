import IconButton from "@components/button/IconButton";
import { ReactComponent as PlusIcon } from "@assets/svg/files/plus-icon.svg";
import { t } from "i18next";
import useAllowanceDrawer from "@pages/home/hooks/useAllowanceDrawer";

export default function AddAllowanceButton() {
  const { onOpenCreateAllowanceDrawer } = useAllowanceDrawer();
  return (
    <div className="flex items-center justify-center">
      <p className="mx-2 text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {t("allowance.add.allowance")}
      </p>
      <IconButton icon={<PlusIcon />} onClick={onOpenCreateAllowanceDrawer} />
    </div>
  );
}
