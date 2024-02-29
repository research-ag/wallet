// svgs
import XxxxIcon from "@/assets/svg/files/xxxx-logo.svg";
import icUrl from "@/assets/img/icp-logo.png";
import nfidUrl from "@/assets/img/nfid-logo.png";
import ethereumUrl from "@/assets/svg/files/ethereum-icon.svg";
//
import { useState } from "react";
import { AuthNetworkNameEnum, AuthNetworkType, AuthNetworkTypeEnum } from "@/const";
import { AuthNetwork } from "@redux/models/TokenModels";

export const LoginHook = () => {
  const [seedOpen, setSeedOpen] = useState(false);
  const [watchOnlyOpen, setWatchOnlyOpen] = useState(false);
  const [mnemonicOpen, setMnemonicOpen] = useState(false);
  const [ethereumOpen, setEthereumOpen] = useState(false);

  const [seed, setSeed] = useState("");
  const [principalAddress, setPrincipalAddress] = useState("");
  const [phrase, setPhrase] = useState("");

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
      name: AuthNetworkNameEnum.Values.Ethereum,
      icon: <img src={ethereumUrl} alt="ethereum-logo" />,
      type: AuthNetworkTypeEnum.Values.ETH,
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
    {
      name: AuthNetworkNameEnum.Values.Mnemonic,
      icon: <img className={""} src={XxxxIcon} alt="" />,
      type: AuthNetworkTypeEnum.Values.MNEMONIC,
      network: "",
    },
  ];

  function clearLoginInputs() {
    if (seed.length > 0) setSeed("");
    if (principalAddress.length > 0) setPrincipalAddress("");
    if (phrase.length > 0) setPhrase("");
  }

  function closeLoginInputs() {
    if (seedOpen) setSeedOpen(false);
    if (watchOnlyOpen) setWatchOnlyOpen(false);
    if (mnemonicOpen) setMnemonicOpen(false);
    if (ethereumOpen) setEthereumOpen(false);
  }

  function resetMethods() {
    clearLoginInputs();
    closeLoginInputs();
  }

  function handleMethodChange(method: AuthNetworkType) {
    resetMethods();

    if (method === AuthNetworkTypeEnum.Enum.S) {
      setSeedOpen((prev) => !prev);
    }

    if (method === AuthNetworkTypeEnum.Enum.WO) {
      setWatchOnlyOpen((prev) => !prev);
    }

    if (method === AuthNetworkTypeEnum.Enum.MNEMONIC) {
      setMnemonicOpen((prev) => !prev);
    }

    if (method === AuthNetworkTypeEnum.Enum.ETH) {
      setEthereumOpen((prev) => !prev);
    }
  }

  return {
    loginOpts,
    seedOpen,
    seed,
    setSeed,
    ethereumOpen,
    watchOnlyOpen,
    mnemonicOpen,
    principalAddress,
    setPrincipalAddress,
    phrase,
    setPhrase,

    handleMethodChange,
    resetMethods,
  };
};
