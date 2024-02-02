//
import { useEffect, useState } from "react";

import BrazilFlag from "../../assets/svg/files/brazil.svg?react";
import FlagItaly from "../../assets/svg/files/italia.svg?react";
import FlagSpain from "../../assets/svg/files/españa.svg?react";
import FlagUSA from "../../assets/svg/files/usa.svg?react";
import i18n from "../../i18n";

export const LanguageHook = () => {
  const [languageMenu, setLanguageMenu] = useState<any>({
    code: localStorage.language ? localStorage.language : "en",
  });

  const changeLocalLanguage = (e: string) => {
    localStorage.setItem("language", e);
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
