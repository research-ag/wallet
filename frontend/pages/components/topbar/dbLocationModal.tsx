// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { clsx } from "clsx";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { ThemeHook } from "@pages/hooks/themeHook";
import { DbLocationHook } from "@pages/hooks/dbLocationHook";
import { ThemesEnum } from "@/const";
import { db } from "@/database/db";

interface DbLocationModalProps {
  setOpen(value: boolean): void;
}

const DbLocationModal = ({ setOpen }: DbLocationModalProps) => {
  const { t } = useTranslation();

  const { theme } = ThemeHook();
  const { changeDbLocation, dbLocation } = DbLocationHook();

  return (
    <Fragment>
      <div className="flex flex-row items-center justify-between w-full mb-2 top-modal">
        <p className="font-bold text-[1.15rem]">{t("database.location")}</p>
        <CloseIcon
          className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={() => {
            setOpen(false);
          }}
        />
      </div>
      <p className="mb-2 font-light">{t("database.modal.msg")}</p>
      <div
        className={clsx(themeBox, "bg-ThemeColorSelectorLight", "border-BorderColor")}
        onClick={() => {
          handleChange("local");
        }}
      >
        <div
          className={clsx(option, optionBottom, "border-BorderColor", "bg-PrimaryColorLight", "dark:bg-PrimaryColor")}
        >
          <RadioGroup.Root
            value={dbLocation}
            onChange={() => {
              handleChange("local");
            }}
          >
            <div className="flex flex-row items-center p-3">
              <RadioGroup.Item
                className={`w-5 h-5 rounded-full border-2  outline-none p-0 ${
                  theme === ThemesEnum.enum.light ? "border-RadioCheckColor" : "border-RadioNoCheckColorLight"
                }`}
                value={"local"}
                id="r-local"
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-RadioCheckColor" />
              </RadioGroup.Item>
              <p className="ml-4 opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                {t("database.localStorage")}
              </p>
            </div>
          </RadioGroup.Root>
        </div>
      </div>
      <div className={clsx(themeBox, "bg-ThemeColorSelector", "border-BorderColor")}>
        <div
          className={clsx(option, optionBottom, "border-BorderColor", "bg-PrimaryColorLight", "dark:bg-PrimaryColor")}
          onClick={() => {
            handleChange("rxdb");
          }}
        >
          <RadioGroup.Root
            value={dbLocation}
            onChange={() => {
              handleChange("rxdb");
            }}
          >
            <div className="flex flex-row items-center p-3">
              <RadioGroup.Item
                className={`w-5 h-5 rounded-full border-2  outline-none p-0 ${
                  theme === ThemesEnum.enum.light ? "border-RadioCheckColor" : "border-RadioNoCheckColorLight"
                }`}
                value={"rxdb"}
                id="r-rxdb"
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-RadioCheckColor" />
              </RadioGroup.Item>
              <p className="ml-4 opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                {t("database.canister")}
              </p>
            </div>
          </RadioGroup.Root>
        </div>
      </div>
    </Fragment>
  );

  function handleChange(location: "local" | "rxdb") {
    changeDbLocation(location);
    db().setDbLocation(location);
  }
};

export default DbLocationModal;

// Tailwind CSS constants
const themeBox = clsx("flex", "flex-col", "w-full", "border", "rounded-lg", "mb-4", "p-0", "overflow-hidden");
const option = clsx("w-full", "flex", "flex-row", "justify-start", "items-center", "p-4");
const optionBottom = clsx("py-0", "border-t");
