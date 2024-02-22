import { Suspense } from "react";
import { RouteProps } from "react-router-dom";
import "./style.scss";
import TopBarComponent from "./topbar";

interface LayoutProps extends RouteProps {
  role: any;
  children: any;
  history: any;
  isLoginPage: boolean;
}

const LayoutComponent = ({ children, isLoginPage }: LayoutProps) => {
  return (
    <div className="w-full bg-PrimaryColorLight dark:bg-PrimaryColor">
      <div className={"flex flex-col w-full h-screen"}>
        <TopBarComponent isLoginPage={isLoginPage}></TopBarComponent>
        <Suspense>
          <div className="flex flex-col justify-between relative w-full h-screen">{children}</div>
        </Suspense>
      </div>
    </div>
  );
};

export default LayoutComponent;
