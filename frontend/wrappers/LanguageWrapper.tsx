import { db } from "@/database/db";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const language = db().getLanguage();
    if (language !== undefined && language !== null && language !== "" && language !== "null") {
      i18n.changeLanguage(language);
    }
  }, [i18n]);

  return <>{children}</>;
}
