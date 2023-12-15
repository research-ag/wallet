// svg
import IcIcon from "@/assets/img/icp.png";
import EthereumIcon from "@/assets/svg/files/ethereum-icon.svg";
import BitcoinIcon from "@/assets/svg/files/bitcoin-icon.svg";
import ckBtcIcon from "@/assets/svg/files/ckbtc.svg";
import ckEthIcon from "@/assets/svg/files/ckETH.svg";
import OpenChatIcon from "@/assets/svg/files/openchat.svg";
import KinicIcon from "@/assets/svg/files/kinic.svg";
import HotOrNotIcon from "@/assets/svg/files/hot-or-not.svg";
import GoldTokenIcon from "@/assets/svg/files/gldt_icon.svg";
import OrigynIcon from "@/assets/svg/files/ogy_icon.svg";
import DragginzIcon from "@/assets/svg/files/dragginz.svg";
import { z } from "zod";
import { Token } from "@redux/models/TokenModels";

// Enums
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

export const AuthNetworkNameEnum = z.enum(["Internet Identity", "NFID", "Metamask", "Seed", "NONE"]);
export type AuthNetworkName = z.infer<typeof AuthNetworkNameEnum>;

export const AuthNetworkTypeEnum = z.enum(["IC", "NFID", "MM", "NONE"]);
export type AuthNetworkType = z.infer<typeof AuthNetworkTypeEnum>;

export const DeleteContactTypeEnum = z.enum(["CONTACT", "ASSET", "SUB"]);
export type DeleteContactTypeEnum = z.infer<typeof DeleteContactTypeEnum>;

export const TimerActionTypeEnum = z.enum(["TRANSACTIONS", "ASSETS"]);
export type TimerActionType = z.infer<typeof TimerActionTypeEnum>;

//
export const ICRC1systemAssets: Array<Token> = [
  {
    id_number: 10000,
    symbol: "ICP",
    name: "Internet Computer",
    tokenSymbol: "ICP",
    tokenName: "Internet Computer",
    address: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    decimal: "8",
    fee: "10000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
  },
  {
    id_number: 10001,
    symbol: "ckBTC",
    name: "ckBTC",
    tokenSymbol: "ckBTC",
    tokenName: "ckBTC",
    address: "mxzaz-hqaaa-aaaar-qaada-cai",
    decimal: "8",
    fee: "10",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "n5wcd-faaaa-aaaar-qaaea-cai",
  },
  {
    id_number: 10002,
    symbol: "ckETH",
    name: "ckETH",
    tokenName: "ckETH",
    tokenSymbol: "ckETH",
    address: "ss2fx-dyaaa-aaaar-qacoq-cai",
    decimal: "18",
    fee: "2000000000000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "s3zol-vqaaa-aaaar-qacpa-cai",
  },
  {
    id_number: 10003,
    address: "2ouva-viaaa-aaaaq-aaamq-cai",
    symbol: "CHAT",
    name: "openChat",
    tokenSymbol: "CHAT",
    tokenName: "openChat",
    decimal: "8",
    fee: "100000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "2awyi-oyaaa-aaaaq-aaanq-cai",
  },
  {
    id_number: 10004,
    address: "73mez-iiaaa-aaaaq-aaasq-cai",
    symbol: "KINIC",
    name: "Kinic",
    tokenSymbol: "KINIC",
    tokenName: "Kinic",
    decimal: "8",
    fee: "10000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "7vojr-tyaaa-aaaaq-aaatq-cai",
  },
  {
    id_number: 10005,
    address: "zfcdd-tqaaa-aaaaq-aaaga-cai",
    symbol: "SNS1",
    name: "Draggins",
    tokenSymbol: "SNS1",
    tokenName: "Draggins",
    decimal: "8",
    fee: "1000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "zlaol-iaaaa-aaaaq-aaaha-cai",
  },
  {
    id_number: 10007,
    address: "oh54a-baaaa-aaaap-abryq-cai",
    symbol: "GLDT",
    name: "Gold token",
    tokenSymbol: "GLDT",
    tokenName: "Gold token",
    decimal: "8",
    fee: "10000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "oo6x4-xiaaa-aaaap-abrza-cai",
  },
  {
    id_number: 10008,
    address: "jwcfb-hyaaa-aaaaj-aac4q-cai",
    symbol: "OGY",
    name: "Origyn",
    tokenSymbol: "OGY",
    tokenName: "Origyn",
    decimal: "8",
    fee: "200000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "",
  },
  {
    id_number: 10009,
    address: "6rdgd-kyaaa-aaaaq-aaavq-cai",
    symbol: "HOT",
    name: "Hot or Not",
    tokenSymbol: "HOT",
    tokenName: "Hot or Not",
    decimal: "8",
    fee: "100000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "6dfr2-giaaa-aaaaq-aaawq-cai",
  },
];

export const DIP20systemAssets: Array<Token> = [];
export const EXTsystemAssets: Array<Token> = [];
export const systemAssets: { [key: string]: Array<Token> } = {
  "ICRC-1": ICRC1systemAssets,
};

export const symbolIconDict: { [key: string]: string } = {
  BTC: BitcoinIcon,
  ICP: IcIcon,
  ETH: EthereumIcon,
  ckBTC: ckBtcIcon,
  ckETH: ckEthIcon,
  CHAT: OpenChatIcon,
  KINIC: KinicIcon,
  SNS1: DragginzIcon,
  HOT: HotOrNotIcon,
  GLDT: GoldTokenIcon,
  OGY: OrigynIcon,
};

export const defaultTokens: Token[] = [
  {
    id_number: 0,
    symbol: "ICP",
    name: "Internet Computer",
    tokenSymbol: "ICP",
    tokenName: "Internet Computer",
    address: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    decimal: "8",
    fee: "10000",
    subAccounts: [
      {
        name: AccountDefaultEnum.Values.Default,
        numb: "0x0",
        amount: "0",
        currency_amount: "0",
      },
    ],
  },
  {
    id_number: 1,
    symbol: "ckBTC",
    name: "ckBTC",
    tokenSymbol: "ckBTC",
    tokenName: "ckBTC",
    address: "mxzaz-hqaaa-aaaar-qaada-cai",
    decimal: "8",
    fee: "10",
    index: "n5wcd-faaaa-aaaar-qaaea-cai",
    subAccounts: [
      {
        name: AccountDefaultEnum.Values.Default,
        numb: "0x0",
        amount: "0",
        currency_amount: "0",
      },
    ],
  },
  {
    id_number: 2,
    symbol: "ckETH",
    name: "ckETH",
    tokenSymbol: "ckETH",
    tokenName: "ckETH",
    address: "ss2fx-dyaaa-aaaar-qacoq-cai",
    decimal: "18",
    fee: "2000000000000",
    index: "s3zol-vqaaa-aaaar-qacpa-cai",
    subAccounts: [
      {
        name: AccountDefaultEnum.Values.Default,
        numb: "0x0",
        amount: "0",
        currency_amount: "0",
      },
    ],
  },
];

// Allowances & Transactions

export enum DetailsTabs {
  allowances = "allowances",
  transactions = "transactions",
}
