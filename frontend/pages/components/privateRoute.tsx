import { Route, Redirect, RouteProps } from "react-router-dom";
import { HOME } from "../paths";
import { LazyExoticComponent } from "react";

interface MyRouteProps extends RouteProps {
  Component: LazyExoticComponent<() => JSX.Element>;
  authenticated: boolean;
  allowByRole: boolean;
  rest?: any;
}

const PrivateRoute = ({ Component, allowByRole, ...rest }: MyRouteProps) => {
  return (
    <Route
      {...rest}
      render={(props: any) => {
        if (allowByRole) {
          return <Component {...props} history={props.history}></Component>;
        } else {
          return <Redirect to={HOME} />;
        }
      }}
    />
  );
};

export default PrivateRoute;
