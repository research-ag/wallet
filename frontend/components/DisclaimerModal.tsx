// svgs
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
//
import { BasicModal } from "@components/modal";
import { CustomButton } from "@components/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function DisclaimerModal({ isLoginPage }: { isLoginPage: boolean }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  return (
    <BasicModal open={open && !isLoginPage} width="w-[30rem]" border="dark:border-2 dark:border-gray-color-6">
      <div className="flex flex-col items-start justify-start w-full gap-4">
        <div className="flex items-center justify-start gap-4 fle-row">
          <WarningIcon className="w-6 h-6" />
          <p className="font-semibold">{t("disclaimer.title")}</p>
        </div>
        <p className="text-justify ">{t("disclaimer.msg")}</p>
        <div className="flex flex-row items-start justify-end w-full ">
          <CustomButton className="min-w-[5rem]" onClick={() => setOpen(false)} size={"small"}>
            <p>{t("agree")}</p>
          </CustomButton>
        </div>
      </div>
    </BasicModal>
  );
}
