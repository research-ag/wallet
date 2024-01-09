import { IconButton } from "@components/button";
import { ReactComponent as PlusIcon } from "@assets/svg/files/plus-icon.svg";
import { t } from "i18next";

export default function AddAllowanceButton() {
  return (
    <div className="flex items-center justify-center">
      <p className="mx-2 text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {t("allowance.add.allowance")}
      </p>
      <IconButton icon={<PlusIcon />} />
    </div>
  );
}
