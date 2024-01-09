import { lazy, useEffect } from "react";
import { Redirect, Router, Switch } from "react-router-dom";
import Login from "./login";

import { CONTACTS, HOME, LOGIN } from "./paths";
import LayoutComponent from "./components/LayoutComponent";
import history from "./history";
import PrivateRoute from "./components/privateRoute";
import { useAppSelector } from "@redux/Store";
import { ThemeHook } from "./hooks/themeHook";
import Loader from "./components/Loader";
import { ThemesEnum } from "@/const";
const Home = lazy(() => import("./home"));
const Contacts = lazy(() => import("./contacts"));

const SwitchRoute = () => {
  const { authLoading, superAdmin, authenticated } = useAppSelector((state) => state.auth);
  const { blur } = useAppSelector((state) => state.auth);
  const { changeTheme } = ThemeHook();
  useEffect(() => {
    if (
      localStorage.theme === ThemesEnum.enum.dark ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add(ThemesEnum.enum.dark);
      localStorage.theme = ThemesEnum.enum.dark;
      changeTheme(ThemesEnum.enum.dark);
    } else {
      document.documentElement.classList.remove(ThemesEnum.enum.dark);
      localStorage.theme = ThemesEnum.enum.light;
      changeTheme(ThemesEnum.enum.light);
    }
  }, []);

  return authLoading ? (
    <Loader></Loader>
  ) : (
    <>
      {blur && <div className="fixed w-full h-full bg-black/50 z-[900]"></div>}
      <Router history={history}>
        {/* NORMAL USERS */}
        {!superAdmin && authenticated && (
          <LayoutComponent role={1} history={history}>
            <Switch>
              <PrivateRoute exact path={HOME} authenticated={authenticated} allowByRole={true} Component={Home} />
              <PrivateRoute
                exact
                path={CONTACTS}
                authenticated={authenticated}
                allowByRole={true}
                Component={Contacts}
              />
              <Redirect to={HOME} />
            </Switch>
          </LayoutComponent>
        )}

        {/*  LOGINS NO AUTH */}
        {!superAdmin && !authenticated && (
          <Switch>
            <PrivateRoute exact path={LOGIN} authenticated={authenticated} allowByRole={true} Component={Login} />
            <Redirect to={LOGIN} />
          </Switch>
        )}
      </Router>
    </>
  );
};

export default SwitchRoute;
