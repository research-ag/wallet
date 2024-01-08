import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/Store";
import { setTheme } from "@/redux/auth/AuthReducer";

export const ThemeHook = () => {
  const dispatch = useAppDispatch();
  const [themeOpen, setThemeOpen] = useState(false);

  const { theme } = useAppSelector((state) => state.auth);

  const changeTheme = (value: string) => dispatch(setTheme(value));

  useEffect(() => {
    if (theme === "light") document.body.classList.add("light");
    else document.body.classList.remove("light");
  }, [theme]);

  return { theme, changeTheme, themeOpen, setThemeOpen };
};
