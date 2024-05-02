// svgs
import XxxxIcon from "@/assets/svg/files/xxxx-logo.svg";
import icUrl from "@/assets/img/icp-logo.png";
import nfidUrl from "@/assets/img/nfid-logo.png";
import ethereumUrl from "@/assets/svg/files/ethereum-icon.svg";
//
import { AuthNetworkNameEnum, AuthNetworkTypeEnum } from "@/const";
import { AuthNetwork } from "@redux/models/TokenModels";

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

export default loginOpts;
