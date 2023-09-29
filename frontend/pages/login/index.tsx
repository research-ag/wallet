// svgs
import HplWalletIcon from "@/assets/svg/files/logo_ICRC-1-dark.svg";
import HplWalletLightIcon from "@/assets/svg/files/logo_ICRC-1.svg";
import { ReactComponent as LoginLogoIcon } from "@/assets/svg/files/login-logo.svg";
import { ReactComponent as ChevIcon } from "@/assets/svg/files/chev-icon.svg";
//
import { LoginHook } from "./hooks/loginhook";
import FlagSelector from "./components/flagSelector";
import { useTranslation } from "react-i18next";
import { ThemeHook } from "@hooks/themeHook";
import { Fragment } from "react";
import { handleAuthenticated } from "@/redux/CheckAuth";
import { AuthNetworkTypeEnum, ThemesEnum } from "@/const";
import { AuthNetwork } from "@redux/models/TokenModels";

const Login = () => {
  const { t } = useTranslation();
  const { handleOpenChange, loginOpts, open } = LoginHook();
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
