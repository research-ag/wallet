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
import { db } from "@/database/db";

const Home = lazy(() => import("./home"));
const Contacts = lazy(() => import("./contacts"));

const SwitchRoute = () => {
  const { authLoading, superAdmin, authenticated } = useAppSelector((state) => state.auth);
  const { blur } = useAppSelector((state) => state.auth);
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

    // Default to LOCAL dbLocation if has not been set yet
    !db().getDbLocation() && db().setDbLocation("local");
  }, []);

  return authLoading ? (
    <Loader></Loader>
  ) : (
    <>
      {blur && <div className="fixed w-full h-full bg-black/50 z-[900]"></div>}
      <Router history={history}>
        {/* NORMAL USERS */}
        {!superAdmin && authenticated && (
          <LayoutComponent role={1} history={history} isLoginPage={false}>
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
          <LayoutComponent role={1} history={history} isLoginPage={true}>
            <Switch>
              <PrivateRoute exact path={LOGIN} authenticated={authenticated} allowByRole={true} Component={Login} />
              <Redirect to={LOGIN} />
            </Switch>
          </LayoutComponent>
        )}
      </Router>
    </>
  );
};

export default SwitchRoute;
