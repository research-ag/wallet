import { useTranslation } from "react-i18next";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";

interface CloseAssetDrawerProps {
  isEdit: boolean;
  onClose: () => void;
}

export default function CloseAssetDrawer({ isEdit, onClose }: CloseAssetDrawerProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-center justify-between w-full mb-5">
      <p className="text-lg font-bold">{isEdit ? t("edit.asset") : t("add.asset")}</p>
      <CloseIcon
        className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
        onClick={onClose}
      />
    </div>
  );
}
