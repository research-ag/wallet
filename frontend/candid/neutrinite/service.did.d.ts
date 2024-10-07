import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export type AdminCommand =
  | { token_collect: TokenId }
  | { pair_add: PairConfig }
  | { pair_del: PairId }
  | { pair_set: [PairId, PairConfig] }
  | { token_add: TokenConfig }
  | { token_del: TokenId }
  | { token_set: [TokenId, TokenConfig] };
export interface Asset {
  class: AssetClass;
  symbol: string;
}
export type AssetClass = { Cryptocurrency: null } | { FiatCurrency: null };
export type DepthAsk50 = Array<number>;
export type DepthBid50 = Array<number>;
export type ErrorCode =
  | { canister_error: null }
  | { call_error: { err_code: number } }
  | { system_transient: null }
  | { future: number }
  | { canister_reject: null }
  | { destination_invalid: null }
  | { system_fatal: null };
export type ErrorLine = [Time, string, ErrorCode, string];
export type Frame = { t1d: null } | { t1h: null } | { t5m: null };
export type GetError = { invalid_frame: null };
export type GetPairsResult =
  | {
      ok: {
        first: Time;
        data: Array<TickShared>;
        last: Time;
        updated: Time;
      };
    }
  | { err: GetError };
export type GetTokensResult =
  | {
      ok: {
        first: Time;
        data: Array<TokenTickShared>;
        last: Time;
        updated: Time;
      };
    }
  | { err: GetError };
export type High = number;
export type LastAsk = number;
export type LastBid = number;
export interface LatestExtendedRate {
  to_token: TokenId;
  rate: number;
  volume: number;
  depth50: number;
  depth2: number;
  depth8: number;
  symbol: string;
}
export interface LatestExtendedToken {
  id: TokenId;
  last: [] | [LatestExtendedTokenTickItem];
  config: TokenConfig;
  rates: Array<LatestExtendedRate>;
}
export interface LatestExtendedTokenTickItem {
  fee: bigint;
  dissolving_30d: bigint;
  circulating_supply: bigint;
  other_treasuries: Array<[TokenId, bigint]>;
  total_locked: bigint;
  dissolving_1d: bigint;
  dissolving_1y: bigint;
  total_supply: bigint;
  treasury: bigint;
}
export type LatestTokenRow = [[TokenId, TokenId], string, number];
export interface LatestWalletTokenTicks {
  t6h: Array<number>;
  to_id: TokenId;
  from_id: TokenId;
}
export interface LatestWalletTokens {
  ticks: Array<LatestWalletTokenTicks>;
  latest: Array<LatestExtendedToken>;
}
export interface LockingTick {
  not_dissolving: Array<bigint>;
  other_treasuries: Array<[TokenId, bigint]>;
  total_locked: bigint;
  dissolving: Array<bigint>;
  treasury: bigint;
}
export type Low = number;
export interface NodeInfoShared {
  bad: bigint;
  principal: Principal;
  good: bigint;
  last: Time;
  name: string;
}
export type OraclePushError = { not_in_validator_set: null } | { too_early: null };
export interface PairConfig {
  deleted: boolean;
  tokens: [TokenId, TokenId];
  config:
    | { xrc: { quote_asset: Asset; base_asset: Asset } }
    | { oracle: { id: string } }
    | { icpswap: { canister: Principal } }
    | { sonic: { id: string } }
    | { icdex: { canister: Principal } };
}
export type PairId = bigint;
export type Result = { ok: Time } | { err: OraclePushError };
export type Result_1 = { ok: null } | { err: string };
export interface SnsConfig {
  root: Principal;
  swap: Principal;
  ledger: Principal;
  other_treasuries: Array<{
    token_id: TokenId;
    owner: Principal;
    subaccount: Uint8Array | number[];
  }>;
  index: Principal;
  governance: Principal;
  treasury_subaccount: Uint8Array | number[];
}
export type TickItem = [High, Low, LastBid, LastAsk, Volume24, DepthBid50, DepthAsk50];
export type TickShared = Array<[] | [TickItem]>;
export type Time = bigint;
export interface TokenConfig {
  decimals: bigint;
  deleted: boolean;
  locking: TokenLocking;
  name: string;
  ledger: { none: null } | { icrc1: { ledger: Principal } } | { dip20: { ledger: Principal } };
  details: Array<TokenDetail>;
  symbol: string;
}
export type TokenDetail =
  | { link: { href: string; name: string } }
  | {
      sns_sale: { end: Time; sold_tokens: bigint; price_usd: number };
    };
export type TokenId = bigint;
export type TokenLocking = { ogy: null } | { sns: SnsConfig } | { none: null };
export interface TokenTickItem {
  fee: bigint;
  locking: [] | [LockingTick];
  circulating_supply: bigint;
  total_supply: bigint;
}
export type TokenTickShared = Array<[] | [TokenTickItem]>;
export type Volume24 = number;
export interface _SERVICE {
  admin: ActorMethod<[Array<AdminCommand>], undefined>;
  controller_export_pair: ActorMethod<[Frame, Time, bigint, bigint], Array<[] | [TickItem]>>;
  controller_import_pair: ActorMethod<
    [Frame, Time, bigint, Array<[] | [TickItem]>, { add: null } | { overwrite: null }],
    undefined
  >;
  controller_oracle_add: ActorMethod<[string, Principal], Result_1>;
  controller_oracle_rem: ActorMethod<[Principal], Result_1>;
  get_config: ActorMethod<[], { tokens: Array<TokenConfig>; pairs: Array<PairConfig> }>;
  get_latest: ActorMethod<[], Array<LatestTokenRow>>;
  get_latest_extended: ActorMethod<[], Array<LatestExtendedToken>>;
  get_latest_wallet_tokens: ActorMethod<[], LatestWalletTokens>;
  get_pairs: ActorMethod<[Frame, Array<bigint>, [] | [Time], [] | [Time]], GetPairsResult>;
  get_tokens: ActorMethod<[Array<bigint>, [] | [Time], [] | [Time]], GetTokensResult>;
  log_show: ActorMethod<[], Array<[] | [ErrorLine]>>;
  oracle_push: ActorMethod<[{ data: Array<[string, number]> }], Result>;
  oracles_get: ActorMethod<[], Array<NodeInfoShared>>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
