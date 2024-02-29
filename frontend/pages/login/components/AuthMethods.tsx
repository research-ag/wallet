// svgs
import { ReactComponent as ChevIcon } from "@/assets/svg/files/chev-icon.svg";
//
import { useTranslation } from "react-i18next";
import FlagSelector from "./flagSelector";
import { useState } from "react";
import AuthMethodRender from "./AuthMethodRender";

export default function AuthMethods() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h2 className="text-[2rem] font-bold text-PrimaryTextColorLight dark:text-PrimaryTextColor">
          {t("login.title")}
        </h2>
        <AuthMethodRender />
      </div>
      <div className="flex flex-col items-center justify-center text-center pt-14 pb-14">
        <p className="text-lg font-light text-PrimaryTextColorLight dark:text-PrimaryTextColor">
          {t("login.bottom.msg")}
        </p>
        <p className="text-lg font-light text-PrimaryTextColorLight dark:text-PrimaryTextColor">
          <span className="text-lg font-bold">{t("login.bottom.msg.terms")}</span> {t("and")}{" "}
          <span>{t("login.bottom.msg.policy")}</span>
        </p>
      </div>
      <div className="absolute flex flex-row items-center justify-center right-8 top-6 bg-none">
        <FlagSelector open={open} handleOpenChange={handleOpenChange}></FlagSelector>
        <div
          className={`p-1 cursor-pointer ${open ? "" : "rotate-90"}`}
          onClick={() => {
            handleOpenChange(!open);
          }}
        >
          <ChevIcon className="w-8 h-8 " />
        </div>
      </div>
    </div>
  );

  function handleOpenChange(value: boolean) {
    setOpen(value);
  }
}
