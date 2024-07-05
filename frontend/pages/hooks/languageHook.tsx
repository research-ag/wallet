// svgs
import { ReactComponent as FlagSpain } from "@/assets/svg/files/españa.svg";
import { ReactComponent as FlagUSA } from "@/assets/svg/files/usa.svg";
import { ReactComponent as FlagItaly } from "@/assets/svg/files/italia.svg";
import { ReactComponent as BrazilFlag } from "@/assets/svg/files/brazil.svg";
import { db } from "@/database/db";
//
import { useEffect, useState } from "react";
import i18n from "@/i18n";

export const LanguageHook = () => {
  const [languageMenu, setLanguageMenu] = useState<any>({
    code: db().getLanguage() || "en",
  });

  const changeLocalLanguage = (e: string) => {
    db().setLanguage(e);
  };

  const languageOptionTemplate = () => {
    return (
      <div className="">
        {languageMenu.code === "es" && <FlagSpain />}
        {languageMenu.code === "en" && <FlagUSA />}
        {languageMenu.code === "it" && <FlagItaly />}
        {languageMenu.code === "pt" && <BrazilFlag />}
      </div>
    );
  };

  const onLanguageChange = (value: string) => {
    setLanguageMenu({ code: value });
    i18n.changeLanguage(value, () => {
      changeLocalLanguage(value);
    });
  };

  useEffect(() => {
    i18n.changeLanguage(languageMenu.code, () => {
      changeLocalLanguage(languageMenu.code);
    });
  }, []);

  return { onLanguageChange, languageOptionTemplate, languageMenu };
};
