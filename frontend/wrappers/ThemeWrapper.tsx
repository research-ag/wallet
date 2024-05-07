import { ThemesEnum } from "@/common/const";
import { db } from "@/database/db";
import { ThemeHook } from "@pages/hooks/themeHook";
import { useEffect } from "react";

export default function ThemeWrapper({ children }: { children: JSX.Element }) {
  const { changeTheme } = ThemeHook();

  useEffect(() => {
    const theme = db().getTheme();
    if (
      theme === ThemesEnum.enum.dark ||
      (theme === null && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add(ThemesEnum.enum.dark);
      db().setTheme(ThemesEnum.enum.dark);
      changeTheme(ThemesEnum.enum.dark);
    } else {
      document.documentElement.classList.remove(ThemesEnum.enum.dark);
      db().setTheme(ThemesEnum.enum.light);
      changeTheme(ThemesEnum.enum.light);
    }
  }, []);

  return <>{children}</>;
}
