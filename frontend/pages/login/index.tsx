// svgs
import HplWalletIcon from "@/assets/svg/files/logo_ICRC-1-dark.svg";
import HplWalletLightIcon from "@/assets/svg/files/logo_ICRC-1.svg";
import { ReactComponent as LoginLogoIcon } from "@/assets/svg/files/login-logo.svg";
//
import { ThemeHook } from "@hooks/themeHook";
import { Fragment, useEffect } from "react";
import { ThemesEnum } from "@/common/const";
import AuthMethods from "./components/AuthMethods";
import { DB_LOCATION_AUTH } from "@pages/components/topbar/dbLocationModal";
import { db, DB_Type } from "@/database/db";
import { useAppDispatch } from "@redux/Store";
import { setDbLocation } from "@redux/auth/AuthReducer";

const Login = () => {
  const dispatch = useAppDispatch();
  const { theme } = ThemeHook();

  useEffect(() => {
    const lastUserSync = localStorage.getItem(DB_LOCATION_AUTH);
    const toStoreValue = lastUserSync === DB_Type.CANISTER ? DB_Type.CANISTER : DB_Type.LOCAL;
    db().setDbLocation(toStoreValue);
    dispatch(setDbLocation(toStoreValue));
  }, []);

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
