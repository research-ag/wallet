import { Token } from "@redux/models/TokenModels";
import { SupportedStandardEnum } from "./@types/icrc";
import { getMetadataInfo } from "./utils";
import { IcrcLedgerCanister } from "@dfinity/ledger";
import { HttpAgent } from "@dfinity/agent";

interface SnsMetadata {
  canister_ids: { ledger_canister_id: string; index_canister_id: string };
}

const supportedStandards = [SupportedStandardEnum.Values["ICRC-1"], SupportedStandardEnum.Values["ICRC-2"]];

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
    shortDecimal: "8",
    fee: "10000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    supportedStandards,
  },
  {
    id_number: 10001,
    symbol: "ckBTC",
    name: "ckBTC",
    tokenSymbol: "ckBTC",
    tokenName: "ckBTC",
    address: "mxzaz-hqaaa-aaaar-qaada-cai",
    decimal: "8",
    shortDecimal: "8",
    fee: "10",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "n5wcd-faaaa-aaaar-qaaea-cai",
    supportedStandards,
  },
  {
    id_number: 10002,
    symbol: "ckETH",
    name: "ckETH",
    tokenName: "ckETH",
    tokenSymbol: "ckETH",
    address: "ss2fx-dyaaa-aaaar-qacoq-cai",
    decimal: "18",
    shortDecimal: "18",
    fee: "2000000000000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "s3zol-vqaaa-aaaar-qacpa-cai",
    supportedStandards,
  },
  {
    id_number: 10003,
    address: "oh54a-baaaa-aaaap-abryq-cai",
    symbol: "GLDT",
    name: "Gold token",
    tokenSymbol: "GLDT",
    tokenName: "Gold token",
    decimal: "8",
    shortDecimal: "8",
    fee: "10000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "oo6x4-xiaaa-aaaap-abrza-cai",
    supportedStandards,
  },
  {
    id_number: 10004,
    address: "jwcfb-hyaaa-aaaaj-aac4q-cai",
    symbol: "OGY",
    name: "Origyn",
    tokenSymbol: "OGY",
    tokenName: "Origyn",
    decimal: "8",
    shortDecimal: "8",
    fee: "200000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "",
    supportedStandards,
  },
];

//
export const defaultTokens: Token[] = [
  {
    id_number: 0,
    symbol: "ICP",
    name: "Internet Computer",
    tokenSymbol: "ICP",
    tokenName: "Internet Computer",
    address: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    decimal: "8",
    shortDecimal: "8",
    fee: "10000",
    subAccounts: [
      {
        name: "Default",
        numb: "0x0",
        amount: "0",
        currency_amount: "0",
      },
    ],
    supportedStandards,
  },
  {
    id_number: 1,
    symbol: "ckBTC",
    name: "ckBTC",
    tokenSymbol: "ckBTC",
    tokenName: "ckBTC",
    address: "mxzaz-hqaaa-aaaar-qaada-cai",
    decimal: "8",
    shortDecimal: "8",
    fee: "10",
    index: "n5wcd-faaaa-aaaar-qaaea-cai",
    subAccounts: [
      {
        name: "Default",
        numb: "0x0",
        amount: "0",
        currency_amount: "0",
      },
    ],
    supportedStandards,
  },
  {
    id_number: 2,
    symbol: "ckETH",
    name: "ckETH",
    tokenSymbol: "ckETH",
    tokenName: "ckETH",
    address: "ss2fx-dyaaa-aaaar-qacoq-cai",
    decimal: "18",
    shortDecimal: "18",
    fee: "2000000000000",
    index: "s3zol-vqaaa-aaaar-qacpa-cai",
    subAccounts: [
      {
        name: "Default",
        numb: "0x0",
        amount: "0",
        currency_amount: "0",
      },
    ],
    supportedStandards,
  },
];

export const mapSnsToToken = async (sns: SnsMetadata, id: number, myAgent: HttpAgent): Promise<Token> => {
  const {
    canister_ids: { ledger_canister_id: address, index_canister_id: index },
  } = sns;

  const { metadata } = IcrcLedgerCanister.create({ agent: myAgent, canisterId: address as any });

  const currentMetadata = await metadata({ certified: false });

  const { name, symbol, decimals, logo, fee } = getMetadataInfo(currentMetadata);

  return {
    id_number: id + 10005,
    address,
    index: index || "",
    name,
    symbol,
    logo: logo || "",
    fee,
    tokenName: name,
    tokenSymbol: symbol,
    decimal: decimals.toString(),
    shortDecimal: decimals.toString(),
    subAccounts: [{ numb: "0x0", name: "Default", amount: "0", currency_amount: "0" }],
    supportedStandards,
  };
};
