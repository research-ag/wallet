// svg
import IcIcon from "@/assets/img/icp.png";
import ckETHIcon from "@/assets/svg/files/ckETH.svg";
import ckBTCIcon from "@/assets/svg/files/ckbtc.svg";
import EthereumIcon from "@/assets/svg/files/ethereum-icon.svg";
import BitcoinIcon from "@/assets/svg/files/bitcoin-icon.svg";
import GoldTokenIcon from "@/assets/svg/files/gldt_icon.svg";
import OrigynIcon from "@/assets/svg/files/ogy_icon.svg";
import { z } from "zod";
import { ICRC1systemAssets } from "./defaultTokens";
import { Asset } from "@redux/models/AccountModels";
import { SupportedStandardEnum } from "./@types/icrc";

// Enums

export const ProtocolTypeEnum = z.enum(["ICRC1", "HPL"]);
export type ProtocolType = z.infer<typeof ProtocolTypeEnum>;

export const TransactionTypeEnum = z.enum(["RECEIVE", "SEND", "NONE"]);
export type TransactionType = z.infer<typeof TransactionTypeEnum>;

export const OperationStatusEnum = z.enum(["COMPLETED", "REVERTED", "PENDING"]);
export type OperationStatus = z.infer<typeof OperationStatusEnum>;

export const OperationTypeEnum = z.enum(["TRANSACTION", "FEE"]);
export type OperationType = z.infer<typeof OperationTypeEnum>;

export const DrawerOptionEnum = z.enum(["SEND", "RECEIVE", "WRAP"]);
export type DrawerOption = z.infer<typeof DrawerOptionEnum>;

export const IconTypeEnum = z.enum(["ASSET", "HEADER", "FILTER"]);
export type IconType = z.infer<typeof IconTypeEnum>;

export const AssetSymbolEnum = z.enum(["ICP", "ckBTC", "CHAT", "KINIC", "SNS1", "HOT", "OGY"]);
export type AssetSymbol = z.infer<typeof AssetSymbolEnum>;

export const ThemesEnum = z.enum(["dark", "light"]);
export type Themes = z.infer<typeof ThemesEnum>;

export const SendingStatusEnum = z.enum(["sending", "done", "error", "none"]);
export type SendingStatus = z.infer<typeof SendingStatusEnum>;

export const AddingAssetsEnum = z.enum(["adding", "done", "error", "none"]);
export type AddingAssets = z.infer<typeof AddingAssetsEnum>;

export const TokenNetworkEnum = z.enum(["ICRC-1"]);
export type TokenNetwork = z.infer<typeof TokenNetworkEnum>;

export const AccountDefaultEnum = z.enum(["Default"]);
export type AccountDefault = z.infer<typeof AccountDefaultEnum>;

export const WorkerTaskEnum = z.enum(["TRANSACTIONS", "ASSETS"]);
export type WorkerTask = z.infer<typeof WorkerTaskEnum>;

export const AuthNetworkNameEnum = z.enum([
  "Internet Identity",
  "NFID",
  "Ethereum",
  "Seed",
  "Watch-Only",
  "Mnemonic",
  "NONE",
]);
export type AuthNetworkName = z.infer<typeof AuthNetworkNameEnum>;

export const AuthNetworkTypeEnum = z.enum(["IC", "NFID", "ETH", "S", "WO", "MNEMONIC", "NONE"]);
export type AuthNetworkType = z.infer<typeof AuthNetworkTypeEnum>;

export const DeleteContactTypeEnum = z.enum(["CONTACT", "ASSET", "SUB"]);
export type DeleteContactTypeEnum = z.infer<typeof DeleteContactTypeEnum>;

export const TimerActionTypeEnum = z.enum(["TRANSACTIONS", "ASSETS"]);
export type TimerActionType = z.infer<typeof TimerActionTypeEnum>;

export const ICRCSubaccountInfoEnum = z.enum(["TRANSACTIONS", "ALLOWANCES"]);
export type ICRCSubaccountInfo = z.infer<typeof ICRCSubaccountInfoEnum>;

export const SpecialTxTypeEnum = z.enum(["mint", "burn"]);
export type SpecialTxType = z.infer<typeof SpecialTxTypeEnum>;

export const DIP20systemAssets: Array<Asset> = [];
export const EXTsystemAssets: Array<Asset> = [];
export const systemAssets: { [key: string]: Array<Asset> } = {
  [SupportedStandardEnum.Values["ICRC-1"]]: ICRC1systemAssets,
};

export const symbolIconDict: { [key: string]: string } = {
  BTC: BitcoinIcon,
  ICP: IcIcon,
  ckBTC: ckBTCIcon,
  ckETH: ckETHIcon,
  ETH: EthereumIcon,
  GLDT: GoldTokenIcon,
  OGY: OrigynIcon,
};
