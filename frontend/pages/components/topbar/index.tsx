import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as brazilSvg from "@/assets/svg/files/brazil.svg?react";

//
import { Fragment, useState } from "react";

import { AccountHook } from "@hooks/accountHook";
import { AssetHook } from "@pages/home/hooks/assetHook";
// svgs
import ChevronIcon from "@/assets/svg/files/chevron-right.svg?react";
import { CustomCopy } from "@components/CopyTooltip";
import ICRC1Logo from "@/assets/svg/files/logo_ICRC-1.svg?react";
import ICRC1LogoDark from "@/assets/svg/files/logo_ICRC-1-dark.svg?react";
import ItalyFlagIcon from "@/assets/svg/files/italia.svg?react";
import { LanguageHook } from "@hooks/languageHook";
import Modal from "@components/Modal";
import RefreshIcon from "@/assets/svg/files/refresh-ccw.svg?react";
import SpainFlagIcon from "@/assets/svg/files/españa.svg?react";
import SunIcon from "@/assets/svg/files/sun-icon.svg?react";
import { ThemeHook } from "@hooks/themeHook";
import ThemeModal from "./themeModal";
import { ThemesEnum } from "@/const";
import UsaFlagIcon from "@/assets/svg/files/usa.svg?react";
import WalletIcon from "@/assets/svg/files/wallet-icon.svg?react";
import { clsx } from "clsx";
import i18n from "@/i18n";
import { logout } from "@redux/CheckAuth";
import { setLoading } from "@redux/assets/AssetReducer";
import { shortAddress } from "@/utils";
import { useAppDispatch } from "@redux/Store";
import { useTranslation } from "react-i18next";

const TopBarComponent = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { onLanguageChange } = LanguageHook();

  const { theme, themeOpen, setThemeOpen } = ThemeHook();
  const { authClient } = AccountHook();
  const { getTotalAmountInCurrency, reloadBallance, assetLoading } = AssetHook();

  const [langOpen, setLangOpen] = useState(false);

  const langOpts = [
    { abrev: "en", name: "english", flag: <UsaFlagIcon className={flag} /> },
    { abrev: "es", name: "spanish", flag: <SpainFlagIcon className={flag} /> },
    { abrev: "it", name: "italian", flag: <ItalyFlagIcon className={flag} /> },
    { abrev: "pt", name: "portuguese", flag: <brazilSvg.ReactComponent className={flag} /> },
  ];

  return (
    <Fragment>
      <div className="flex flex-row justify-between min-h-[4.5rem] w-full bg-PrimaryColorLight dark:bg-PrimaryColor text-PrimaryTextColorLight dark:text-PrimaryTextColor border-b border-BorderColorFourthLight dark:border-BorderColorFourth">
        <div className="flex flex-row items-center justify-start gap-24 pl-9 text-md">
          {theme === ThemesEnum.enum.dark ? (
            <ICRC1LogoDark className="max-w-[7rem] h-auto" />
          ) : (
            <ICRC1Logo className="max-w-[7rem] h-auto" />
          )}
          <div className="flex flex-row items-center justify-start gap-3">
            <p className="opacity-50">{shortAddress(authClient, 12, 10)}</p>
            <CustomCopy size={"small"} copyText={authClient} />
            <RefreshIcon
              className={`h-4 w-4 cursor-pointer fill-PrimaryTextColorLight dark:fill-PrimaryTextColor ${
                assetLoading ? "do-spin" : ""
              }`}
              onClick={handleReloadButton}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-start pr-9 gap-9">
          <div className="flex flex-row items-center justify-start gap-2 text-md">
            <WalletIcon className="fill-SvgColor dark:fill-SvgColor max-w-[1.5rem] h-auto"></WalletIcon>
            <p className="opacity-70">Total Balance:</p>
            <p className="font-medium">{`$${getTotalAmountInCurrency().toFixed(2)}`}</p>
            <p className="opacity-70">USD</p>
          </div>
          <DropdownMenu.Root
            modal={false}
            onOpenChange={() => {
              setLangOpen(false);
            }}
          >
            <DropdownMenu.Trigger asChild>
              <button className="p-0 outline-none">
                <SunIcon className="fill-SvgColor dark:fill-SvgColor max-w-[2rem] h-auto"></SunIcon>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="text-lg bg-PrimaryColorLight rounded-lg dark:bg-SecondaryColor mr-4 z-[999] text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight dark:shadow-BorderColorTwo"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  className={clsx(gearPopItem, "!justify-between", "rounded-t-lg")}
                  onSelect={(e: Event) => {
                    e.preventDefault();
                    setLangOpen(!langOpen);
                  }}
                >
                  <p>{t("language.word")}</p>
                  <ChevronIcon className={`fill-SvgColor dark:fill-SvgColor ${langOpen ? "" : "-rotate-90"}`} />
                </DropdownMenu.Item>
                {langOpen &&
                  langOpts.map((lOpt, k) => {
                    return (
                      <DropdownMenu.Item
                        key={k}
                        className={clsx(gearPopItem)}
                        onSelect={() => {
                          setLangOpen(false);
                          changeLanguage(lOpt.abrev);
                        }}
                      >
                        {lOpt.flag}
                        <p>{t(lOpt.name)}</p>
                      </DropdownMenu.Item>
                    );
                  })}
                <DropdownMenu.Item
                  className={clsx(gearPopItem, "!justify-between")}
                  onSelect={() => {
                    setThemeOpen(true);
                  }}
                >
                  <p>{t("themes")}</p>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className={clsx(gearPopItem, "!justify-between", "rounded-b-lg")}
                  onSelect={() => {
                    logout();
                  }}
                >
                  <p className="text-LockColor">{t("lock")}</p>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
      <Modal open={themeOpen} top="top-[35%]">
        <ThemeModal setOpen={setThemeOpen} />
      </Modal>
    </Fragment>
  );

  function handleReloadButton() {
    dispatch(setLoading(true));
    reloadBallance();
  }

  function changeLanguage(lang: string) {
    onLanguageChange(lang);
    i18n.changeLanguage(lang, () => {
      localStorage.setItem("language", lang);
    });
  }
};
export default TopBarComponent;

// Tailwind CSS constants
const flag = clsx("mr-1", "max-h-[1.5rem]");
const gearPopItem = clsx(
  "flex",
  "flex-row",
  "justify-start",
  "items-center",
  "py-2",
  "px-4",
  "bg-none",
  "w-full",
  "min-w-[13rem]",
  "cursor-pointer",
  "outline-none",
  "hover:bg-PopSelectColorLight",
  "dark:hover:bg-PopSelectColor",
);
