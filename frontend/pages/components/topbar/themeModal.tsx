// svgs
import { ReactComponent as HplDark } from "@assets/svg/files/logo_ICRC-1-dark.svg";
import { ReactComponent as HplLight } from "@assets/svg/files/logo_ICRC-1.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { clsx } from "clsx";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { ThemeHook } from "@pages/hooks/themeHook";
import { ThemesEnum } from "@/common/const";
import { db } from "@/database/db";

interface ThemeModalProps {
  setOpen(value: boolean): void;
}

const ThemeModal = ({ setOpen }: ThemeModalProps) => {
  const { t } = useTranslation();

  const { changeTheme, theme } = ThemeHook();

  return (
    <Fragment>
      <div className="flex flex-row items-center justify-between w-full mb-2 top-modal">
        <p className="font-bold text-[1.15rem]">{t("themes")}</p>
        <CloseIcon
          className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={() => {
            setOpen(false);
          }}
        />
      </div>
      <p className="mb-2 font-light">{t("theme.modal.msg")}</p>
      <div
        className={clsx(themeBox, "bg-ThemeColorSelectorLight", "border-BorderColor")}
        onClick={() => {
          handleChange(ThemesEnum.enum.light);
        }}
      >
        <div className={option}>
          <HplLight className="max-w-[10rem] h-auto" />
          <p className={clsx(logoMsg, "border-BorderColor !text-ThemeColorSelector")}>{t("theme.modal.msg.option")}</p>
        </div>
        <div
          className={clsx(option, optionBottom, "border-BorderColor", "bg-PrimaryColorLight", "dark:bg-PrimaryColor")}
        >
          <RadioGroup.Root
            value={theme}
            onChange={() => {
              handleChange(ThemesEnum.enum.light);
            }}
          >
            <div className="flex flex-row items-center p-3">
              <RadioGroup.Item
                className={`w-5 h-5 rounded-full border-2  outline-none p-0 ${
                  theme === ThemesEnum.enum.light ? "border-RadioCheckColor" : "border-RadioNoCheckColorLight"
                }`}
                value={ThemesEnum.enum.light}
                id="r-light"
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-RadioCheckColor" />
              </RadioGroup.Item>
              <p className="ml-4 opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                {t(ThemesEnum.enum.light)}
              </p>
            </div>
          </RadioGroup.Root>
        </div>
      </div>
      <div
        className={clsx(themeBox, "bg-ThemeColorSelector", "border-BorderColor")}
        onClick={() => {
          handleChange(ThemesEnum.enum.dark);
        }}
      >
        <div className={option}>
          <HplDark className="max-w-[10rem] h-auto" />
          <p className={clsx(logoMsg, "border-BorderColor text-ThemeColorSelectorLight")}>
            {t("theme.modal.msg.option")}
          </p>
        </div>
        <div
          className={clsx(option, optionBottom, "border-BorderColor", "bg-PrimaryColorLight", "dark:bg-PrimaryColor")}
        >
          <RadioGroup.Root
            value={theme}
            onChange={() => {
              handleChange(ThemesEnum.enum.dark);
            }}
          >
            <div className="flex flex-row items-center p-3">
              <RadioGroup.Item
                className={`w-5 h-5 rounded-full border-2  outline-none p-0 ${
                  theme === ThemesEnum.enum.dark ? "border-RadioCheckColor" : "border-RadioNoCheckColor"
                }`}
                value={ThemesEnum.enum.dark}
                id="r-dark"
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-RadioCheckColor" />
              </RadioGroup.Item>
              <p className="ml-4 opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                {t(ThemesEnum.enum.dark)}
              </p>
            </div>
          </RadioGroup.Root>
        </div>
      </div>
    </Fragment>
  );

  function handleChange(theme: string) {
    if (theme === ThemesEnum.enum.light) {
      document.documentElement.classList.remove(ThemesEnum.enum.dark);
      changeTheme(ThemesEnum.enum.light);
      db().setTheme(ThemesEnum.enum.light);
    } else {
      document.documentElement.classList.add(ThemesEnum.enum.dark);
      changeTheme(ThemesEnum.enum.dark);
      db().setTheme(ThemesEnum.enum.dark);
    }
  }
};

export default ThemeModal;

// Tailwind CSS constants
const themeBox = clsx("flex", "flex-col", "w-full", "border", "rounded-lg", "mb-4", "p-0", "overflow-hidden");
const option = clsx("w-full", "flex", "flex-row", "justify-start", "items-center", "p-4");
const optionBottom = clsx("py-0", "border-t");
const logoMsg = clsx("py-4", "p-8", "border-l-[2px]", "ml-4", "font-medium");
