// svgs
import XxxxIcon from "@/assets/svg/files/xxxx-logo.svg";
import icUrl from "@/assets/img/icp-logo.png";
import nfidUrl from "@/assets/img/nfid-logo.png";
import metamaskUrl from "@/assets/img/metamask-logo.png";
//
import { useState } from "react";
import { AuthNetworkNameEnum, AuthNetworkTypeEnum } from "@/const";
import { AuthNetwork } from "@redux/models/TokenModels";

export const LoginHook = () => {
  const loginOpts: AuthNetwork[] = [
    {
      name: AuthNetworkNameEnum.Values["Internet Identity"],
      icon: <img src={icUrl} alt="ic-logo" />,
      type: AuthNetworkTypeEnum.Values.IC,
      network: import.meta.env.VITE_AGGENT_HOST,
    },
    {
      name: AuthNetworkNameEnum.Values.NFID,
      icon: <img src={nfidUrl} alt="nfid-logo" />,
      type: AuthNetworkTypeEnum.Values.NFID,
      network: import.meta.env.VITE_AGGENT_NFID_HOST,
    },
    {
      name: AuthNetworkNameEnum.Values.Metamask,
      extra: "not.yet.available",
      icon: <img src={metamaskUrl} alt="metamask-logo" />,
      type: AuthNetworkTypeEnum.Values.MM,
      network: "",
    },
    {
      name: AuthNetworkNameEnum.Values.Seed,
      extra: "devs.only",
      icon: <img className={""} src={XxxxIcon} alt="" />,
      type: AuthNetworkTypeEnum.Values.S,
      network: "",
    },
    {
      name: AuthNetworkNameEnum.Values["Watch-Only"],
      icon: <img className={""} src={XxxxIcon} alt="" />,
      type: AuthNetworkTypeEnum.Values.WO,
      network: "",
    },
  ];
  const [open, setOpen] = useState(false);
  const [seedOpen, setSeedOpen] = useState(false);
  const [seed, setSeed] = useState("");
  const [watchOnlyOpen, setWatchOnlyOpen] = useState(false);
  const [principalAddress, setPrincipalAddress] = useState("");
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
  };

  return {
    handleOpenChange,
    loginOpts,
    open,
    seedOpen,
    setSeedOpen,
    seed,
    setSeed,
    watchOnlyOpen,
    setWatchOnlyOpen,
    principalAddress,
    setPrincipalAddress,
  };
};
