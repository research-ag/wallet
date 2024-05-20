import { lazy } from "react";
import { Redirect, Router, Switch } from "react-router-dom";

import { ALLOWANCES, CONTACTS, HOME, LOGIN, SERVICES } from "./paths";
import LayoutComponent from "./components/LayoutComponent";
import history from "./history";
import PrivateRoute from "./components/privateRoute";
import { useAppSelector } from "@redux/Store";
import Loader from "./components/Loader";
import WorkersWrapper from "@/wrappers/WorkersWrapper";

const Login = lazy(() => import("@/pages/login"));
const Home = lazy(() => import("@/pages/home"));
const Contacts = lazy(() => import("@/pages/contacts"));
const Allowances = lazy(() => import("@/pages/allowances"));
const Services = lazy(() => import("@/pages/services"));

const SwitchRoute = () => {
  const { authLoading, superAdmin, authenticated, blur } = useAppSelector((state) => state.auth);

  if (authLoading) return <Loader />;

  return (
    <>
      {blur && <div className="fixed w-full h-full bg-black/50 z-[900]"></div>}
      <Router history={history}>
        {/* NORMAL USERS */}
        {!superAdmin && authenticated && (
          <WorkersWrapper>
            {/* eslint-disable-next-line jsx-a11y/aria-role */}
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
                <PrivateRoute
                  exact
                  path={ALLOWANCES}
                  authenticated={authenticated}
                  allowByRole={true}
                  Component={Allowances}
                />
                <PrivateRoute
                  exact
                  path={SERVICES}
                  authenticated={authenticated}
                  allowByRole={true}
                  Component={Services}
                />
                <Redirect to={HOME} />
              </Switch>
            </LayoutComponent>
          </WorkersWrapper>
        )}

        {/*  LOGINS NO AUTH */}
        {!superAdmin && !authenticated && (
          // eslint-disable-next-line jsx-a11y/aria-role
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
