// svgs
import HplWalletIcon from "@/assets/svg/files/logo_ICRC-1-dark.svg";
import HplWalletLightIcon from "@/assets/svg/files/logo_ICRC-1.svg";
import { ReactComponent as LoginLogoIcon } from "@/assets/svg/files/login-logo.svg";
//
import { ThemeHook } from "@hooks/themeHook";
import { Fragment } from "react";
import { ThemesEnum } from "@/common/const";
import AuthMethods from "./components/AuthMethods";

const Login = () => {
  const { theme } = ThemeHook();

  return (
    <Fragment>
      <div className="flex flex-row w-full h-full bg-PrimaryColorLight dark:bg-PrimaryColor">
        <div className="flex flex-col h-full justify-center items-center px-[5%] bg-SecondaryColorLight dark:bg-SecondaryColor">
          <img
            src={theme === ThemesEnum.enum.dark ? HplWalletIcon : HplWalletLightIcon}
            alt=""
            className="w-full max-w-[25rem]"
          />
          <LoginLogoIcon className="w-full max-w-[25rem]" />
        </div>
        <AuthMethods />
      </div>
    </Fragment>
  );
};

export default Login;
