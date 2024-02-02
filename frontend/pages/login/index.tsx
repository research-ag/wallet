import { AuthNetworkTypeEnum, ThemesEnum } from "@/const";
import { ChangeEvent, Fragment } from "react";
import { handleAuthenticated, handleSeedAuthenticated } from "@/redux/CheckAuth";

import { AuthNetwork } from "@redux/models/TokenModels";
import CheckIcon from "@assets/svg/files/edit-check.svg?react";
import ChevIcon from "@/assets/svg/files/chev-icon.svg?react";
import { CustomInput } from "@components/Input";
import FlagSelector from "./components/flagSelector";
// svgs
import HplWalletIcon from "@/assets/svg/files/logo_ICRC-1-dark.svg?react";
import HplWalletLightIcon from "@/assets/svg/files/logo_ICRC-1.svg?react";
//
import { LoginHook } from "./hooks/loginhook";
import LoginLogoIcon from "@/assets/svg/files/login-logo.svg?react";
import { ThemeHook } from "@hooks/themeHook";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const { handleOpenChange, loginOpts, open, seedOpen, setSeedOpen, seed, setSeed } = LoginHook();
  const { theme } = ThemeHook();
  return (
    <Fragment>
      <div className="flex flex-row w-full h-full bg-PrimaryColorLight dark:bg-PrimaryColor">
        <div className="flex flex-col h-full justify-center items-center px-[5%] bg-SecondaryColorLight dark:bg-SecondaryColor">
          {theme === ThemesEnum.enum.dark ? (
            <HplWalletIcon className="w-full  max-w-[25rem]" />
          ) : (
            <HplWalletLightIcon className="w-full  max-w-[25rem]" />
          )}

          <LoginLogoIcon className="w-full max-w-[25rem]" />
        </div>
        <div className="relative flex flex-col items-center justify-center w-full h-full">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-[2rem] font-bold text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              {t("login.title")}
            </h2>
            <div className="flex flex-col justify-start items-start w-[70%] mt-8">
              <p className="font-light text-left text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                {t("login.choose.msg")}
              </p>
              {loginOpts.map((opt, k) => {
                return (
                  <div className="flex flex-col items-start justify-start w-full" key={k}>
                    <div
                      className="flex flex-row justify-between items-center w-full mt-4 p-3 rounded-[5%] cursor-pointer bg-SecondaryColorLight dark:bg-SecondaryColor"
                      onClick={async () => {
                        handleLogin(opt);
                      }}
                    >
                      <h3 className="font-medium text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                        {opt.name} <span className="text-md opacity-60">{opt.extra ? `(${t(opt.extra)})` : ""}</span>
                      </h3>
                      {opt.icon}
                    </div>
                    {seedOpen && opt.type === AuthNetworkTypeEnum.Enum.NONE && (
                      <CustomInput
                        sizeInput={"medium"}
                        intent={"secondary"}
                        compOutClass=""
                        value={seed}
                        onChange={onSeedChange}
                        autoFocus
                        sufix={
                          <div className="flex flex-row items-center justify-start gap-2">
                            <CheckIcon
                              onClick={() => {
                                handleSeedAuthenticated(seed);
                              }}
                              className={`w-4 h-4 ${
                                seed.length > 0
                                  ? "stroke-BorderSuccessColor"
                                  : "stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
                              } opacity-50 cursor-pointer`}
                            />
                            <p className="text-sm text-PrimaryTextColorLight dark:text-PrimaryTextColor">Max 32</p>
                          </div>
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSeedAuthenticated(seed);
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center pt-14 pb-14">
            <p className="text-lg font-light text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              {t("login.bottom.msg")}
            </p>
            <p className="text-lg font-light text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              <span className="text-lg font-bold">{t("login.bottom.msg.terms")}</span> {t("and")}{" "}
              <span>{t("login.bottom.msg.policy")}</span>
            </p>
          </div>
          <div className="absolute flex flex-row items-center justify-center right-8 top-6 bg-none">
            <FlagSelector open={open} handleOpenChange={handleOpenChange}></FlagSelector>
            <div
              className={`p-1 cursor-pointer ${open ? "" : "rotate-90"}`}
              onClick={() => {
                handleOpenChange(!open);
              }}
            >
              <ChevIcon className="w-8 h-8 " />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );

  async function handleLogin(opt: AuthNetwork) {
    if (opt.type === AuthNetworkTypeEnum.Values.IC || opt.type === AuthNetworkTypeEnum.Values.NFID) {
      setSeedOpen(false);
      localStorage.setItem("network_type", JSON.stringify({ type: opt.type, network: opt.network, name: opt.name }));
      handleAuthenticated(opt);
    } else if (opt.type === AuthNetworkTypeEnum.Enum.NONE) {
      setSeedOpen((prev) => !prev);
      setSeed("");
    }
  }
  function onSeedChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length <= 32) setSeed(e.target.value);
  }
};

export default Login;
