// svgs
import HplWalletIcon from "@/assets/svg/files/logo_ICRC-1-dark.svg";
import HplWalletLightIcon from "@/assets/svg/files/logo_ICRC-1.svg";
import { ReactComponent as LoginLogoIcon } from "@/assets/svg/files/login-logo.svg";
//
import { ThemeHook } from "@hooks/themeHook";
<<<<<<< HEAD
import { Fragment, useEffect } from "react";
import { ThemesEnum } from "@/common/const";
import AuthMethods from "@/pages/login/components/AuthMethods";
import { DB_LOCATION_AUTH } from "@pages/components/topbar/dbLocationModal";
import { db, DB_Type } from "@/database/db";
import { useAppDispatch } from "@redux/Store";
import { setDbLocation } from "@redux/auth/AuthReducer";
=======
import { Fragment } from "react";
import { handleAuthenticated } from "@/redux/CheckAuth";
import { AuthNetworkTypeEnum, ThemesEnum } from "@/const";
import { AuthNetwork } from "@redux/models/TokenModels";
>>>>>>> 131bad97 (fix on clic functions in line)

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
<<<<<<< HEAD
        <AuthMethods />
=======
        <div className="relative flex flex-col justify-center items-center w-full h-full">
          <div className="flex flex-col justify-center items-center w-full h-full">
            <h2 className="text-[2rem] font-bold text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              {t("login.title")}
            </h2>
            <div className="flex flex-col justify-start items-start w-[70%] mt-8">
              <p className="font-light text-PrimaryTextColorLight dark:text-PrimaryTextColor text-left">
                {t("login.choose.msg")}
              </p>
              {loginOpts.map((opt, k) => {
                return (
                  <div
                    className="flex flex-row justify-between items-center w-full mt-4 p-3 rounded-[5%] cursor-pointer bg-SecondaryColorLight dark:bg-SecondaryColor"
                    key={k}
                    onClick={async () => {
                      handleLogin(opt);
                    }}
                  >
                    <h3 className="font-medium text-PrimaryTextColorLight dark:text-PrimaryTextColor">{opt.name}</h3>
                    {opt.icon}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center text-center pt-14 pb-14">
            <p className="font-light text-lg text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              {t("login.bottom.msg")}
            </p>
            <p className="font-light text-lg text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              <span className="font-bold text-lg">{t("login.bottom.msg.terms")}</span> {t("and")}{" "}
              <span>{t("login.bottom.msg.policy")}</span>
            </p>
          </div>
          <div className="absolute right-8 top-6 bg-none flex flex-row justify-center items-center">
            <FlagSelector open={open} handleOpenChange={handleOpenChange}></FlagSelector>
            <div
              className={`p-1 cursor-pointer ${open ? "" : "rotate-90"}`}
              onClick={() => {
                handleOpenChange(!open);
              }}
            >
              <ChevIcon className=" w-8 h-8" />
            </div>
          </div>
        </div>
>>>>>>> 131bad97 (fix on clic functions in line)
      </div>
    </Fragment>
  );

  async function handleLogin(opt: AuthNetwork) {
    if (opt.type === AuthNetworkTypeEnum.Values.IC || opt.type === AuthNetworkTypeEnum.Values.NFID) {
      localStorage.setItem("network_type", JSON.stringify({ type: opt.type, network: opt.network, name: opt.name }));
      handleAuthenticated(opt);
    }
  }
};

export default Login;
