import { z } from "zod";
import { AuthNetworkNameEnum, AuthNetworkTypeEnum } from "@/const";

const TokenSubAccount = z.object({
  numb: z.string(),
  name: z.string(),
  amount: z.string(),
  currency_amount: z.string(),
});

export type TokenSubAccount = z.infer<typeof TokenSubAccount>;

const Token = z.object({
  id_number: z.number(),
  address: z.string(),
  symbol: z.string(),
  name: z.string(),
  tokenName: z.string(),
  tokenSymbol: z.string(),
  decimal: z.string(),
  shortDecimal: z.string(),
  subAccounts: z.array(TokenSubAccount),
  fee: z.string(),
  index: z.string().optional(),
  logo: z.string().optional(),
});

export type Token = z.infer<typeof Token>;

const UserInfo = z.object({
  from: z.string(),
  tokens: z.array(Token),
});

export type UserInfo = z.infer<typeof UserInfo>;

const TokenMarketInfo = z.object({
  id: z.number(),
  name: z.string(),
  symbol: z.string(),
  price: z.number(),
  marketcap: z.number(),
  volume24: z.number(),
  circulating: z.number(),
  total: z.number(),
  liquidity: z.number(),
  unreleased: z.number(),
});

export type TokenMarketInfo = z.infer<typeof TokenMarketInfo>;

const AuthNetwork = z.object({
  name: AuthNetworkNameEnum,
  extra: z.string().optional(),
  icon: z.any(),
  type: AuthNetworkTypeEnum,
  network: z.any(),
});

export type AuthNetwork = z.infer<typeof AuthNetwork>;
