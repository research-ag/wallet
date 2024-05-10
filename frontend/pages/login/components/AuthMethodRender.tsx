import { useTranslation } from "react-i18next";
import { AuthNetwork } from "@redux/models/TokenModels";
import { AuthNetworkType, AuthNetworkTypeEnum } from "@/common/const";
import { handleAuthenticated } from "@redux/CheckAuth";
import SeedInput from "./SeedInput";
import WatchOnlyInput from "./WatchOnlyInput";
import MnemonicInput from "./MnemonicInput";
import { db } from "@/database/db";
import EthereumSignIn from "./EthereumSignIn";
import { useState } from "react";
import loginOpts from "./loginOptions";

export default function AuthMethodRender() {
  const { t } = useTranslation();
  const [currentMethod, setCurrentMethod] = useState<AuthNetworkType>(AuthNetworkTypeEnum.Values.NONE);

  return (
    <div className="flex flex-col justify-start items-start w-[70%] mt-8">
      <p className="font-light text-left text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {t("login.choose.msg")}
      </p>

      {loginOpts.map((option, index) => (
        <div className="flex flex-col items-start justify-start w-full" key={`login-option-${option.type}-${index}`}>
          <div
            className="flex flex-row justify-between items-center w-full mt-4 p-3 rounded-[5%] cursor-pointer bg-SecondaryColorLight dark:bg-SecondaryColor"
            onClick={() => handleClickSwitch(option)}
          >
            <h3 className="font-medium text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              {option.name} <span className="text-md opacity-60">{option.extra ? `(${t(option.extra)})` : ""}</span>
            </h3>
            {option.icon}
          </div>

          {currentMethod === AuthNetworkTypeEnum.Values.ETH && AuthNetworkTypeEnum.Values.ETH === option.type && (
            <EthereumSignIn />
          )}

          {currentMethod === AuthNetworkTypeEnum.Values.S && AuthNetworkTypeEnum.Values.S === option.type && (
            <SeedInput />
          )}

          {currentMethod === AuthNetworkTypeEnum.Values.WO && AuthNetworkTypeEnum.Values.WO === option.type && (
            <WatchOnlyInput />
          )}

          {currentMethod === AuthNetworkTypeEnum.Values.MNEMONIC &&
            AuthNetworkTypeEnum.Values.MNEMONIC === option.type && <MnemonicInput />}
        </div>
      ))}
    </div>
  );

  function handleClickSwitch(option: AuthNetwork) {
    if (!option) return;
    db().setNetworkType(option);
    setCurrentMethod(option.type);

    if (option.type === AuthNetworkTypeEnum.Values.IC || option.type === AuthNetworkTypeEnum.Values.NFID) {
      handleAuthenticated(option);
      return;
    }
  }
}
