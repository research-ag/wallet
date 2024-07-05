import { lazy } from "react";
import { Redirect, Router, Switch } from "react-router-dom";

import LayoutComponent from "./components/LayoutComponent";
import history from "./history";
import PrivateRoute from "./components/privateRoute";
import { useAppSelector } from "@redux/Store";
import Loader from "./components/Loader";
import WorkersWrapper from "@/wrappers/WorkersWrapper";
import { RoutingPathEnum } from "@common/const";
import TransferProvider from "./home/contexts/TransferProvider";

const Login = lazy(() => import("@/pages/login"));
const Home = lazy(() => import("@/pages/home"));
const Contacts = lazy(() => import("@/pages/contacts"));
const Allowances = lazy(() => import("@/pages/allowances"));
const Services = lazy(() => import("@/pages/services"));

const SwitchRoute = () => {
  const { authLoading, superAdmin, authenticated, blur, route } = useAppSelector((state) => state.auth);

  if (authLoading) return <Loader />;

  return (
    <>
      {blur && <div className="fixed w-full h-full bg-black/50 z-[900]"></div>}
      <Router history={history}>
        {/* NORMAL USERS */}
        {!superAdmin && authenticated && (
          <WorkersWrapper>
            <TransferProvider>
              {/* eslint-disable-next-line jsx-a11y/aria-role */}
              <LayoutComponent role={1} history={history} isLoginPage={false}>
                <Switch>
                  <PrivateRoute
                    exact
                    path="/"
                    authenticated={authenticated}
                    allowByRole={true}
                    Component={getComponentAuth()}
                  />
                  <Redirect to={"/"} />
                </Switch>
              </LayoutComponent>
            </TransferProvider>
          </WorkersWrapper>
        )}

        {/*  LOGINS NO AUTH */}
        {!superAdmin && !authenticated && (
          // eslint-disable-next-line jsx-a11y/aria-role
          <LayoutComponent role={1} history={history} isLoginPage={true}>
            <Switch>
              <PrivateRoute exact path={"/"} authenticated={authenticated} allowByRole={true} Component={Login} />
              <Redirect to={"/"} />
            </Switch>
          </LayoutComponent>
        )}
      </Router>
    </>
  );
  function getComponentAuth() {
    switch (route) {
      case RoutingPathEnum.Enum.CONTACTS:
        return Contacts;
      case RoutingPathEnum.Enum.HOME:
        return Home;
      case RoutingPathEnum.Enum.ALLOWANCES:
        return Allowances;
      case RoutingPathEnum.Enum.SERVICES:
        return Services;
      default:
        return Home;
    }
  }
};

export default SwitchRoute;
