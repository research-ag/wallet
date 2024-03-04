import { Token } from "@redux/models/TokenModels";
import { SupportedStandardEnum } from "./@types/icrc";

interface MapSnsToTokenProps {
  canister_ids: { ledger_canister_id: string; index_canister_id: string };
  meta: { name: string; logo: string };
  icrc1_metadata: any[];
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
    address: "2ouva-viaaa-aaaaq-aaamq-cai",
    symbol: "CHAT",
    name: "openChat",
    tokenSymbol: "CHAT",
    tokenName: "openChat",
    decimal: "8",
    shortDecimal: "8",
    fee: "100000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "2awyi-oyaaa-aaaaq-aaanq-cai",
    supportedStandards,
  },
  {
    id_number: 10004,
    address: "73mez-iiaaa-aaaaq-aaasq-cai",
    symbol: "KINIC",
    name: "Kinic",
    tokenSymbol: "KINIC",
    tokenName: "Kinic",
    decimal: "8",
    shortDecimal: "8",
    fee: "10000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "7vojr-tyaaa-aaaaq-aaatq-cai",
    supportedStandards,
  },
  {
    id_number: 10005,
    address: "zfcdd-tqaaa-aaaaq-aaaga-cai",
    symbol: "SNS1",
    name: "Draggins",
    tokenSymbol: "SNS1",
    tokenName: "Draggins",
    decimal: "8",
    shortDecimal: "8",
    fee: "1000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "zlaol-iaaaa-aaaaq-aaaha-cai",
    supportedStandards,
  },
  {
    id_number: 10007,
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
    id_number: 10008,
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
  {
    id_number: 10009,
    address: "6rdgd-kyaaa-aaaaq-aaavq-cai",
    symbol: "HOT",
    name: "Hot or Not",
    tokenSymbol: "HOT",
    tokenName: "Hot or Not",
    decimal: "8",
    shortDecimal: "8",
    fee: "100000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "6dfr2-giaaa-aaaaq-aaawq-cai",
    supportedStandards,
  },
  {
    id_number: 10010,
    address: "tyyy3-4aaaa-aaaaq-aab7a-cai",
    symbol: "GLDGov",
    name: "Gold Governance Token",
    tokenSymbol: "GLDGov",
    tokenName: "Gold Governance Token",
    decimal: "8",
    shortDecimal: "8",
    fee: "100000",
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    index: "efv5g-kqaaa-aaaaq-aacaa-cai",
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

export const mapSnsToToken = (sns: MapSnsToTokenProps): Token => {
  const {
    canister_ids: { ledger_canister_id: address, index_canister_id: index },
    meta: { name, logo },
    icrc1_metadata,
  } = sns;

  const metadata: any = icrc1_metadata
    .map((meta) => ({ [meta[0]]: meta[1].Text || meta[1].Nat[0] }))
    .reduce((prev, curr) => Object.assign(prev, curr), {});

  return {
    id_number: 0,
    address,
    index,
    name,
    logo,
    tokenName: name,
    tokenSymbol: metadata["icrc1:symbol"],
    symbol: metadata["icrc1:symbol"],
    decimal: metadata["icrc1:decimals"],
    shortDecimal: metadata["icrc1:decimals"],
    fee: metadata["icrc1:fee"],
    subAccounts: [{ numb: "0", name: "Default", amount: "0", currency_amount: "0" }],
    supportedStandards,
  };
};
