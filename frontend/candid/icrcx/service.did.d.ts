/* eslint-disable @typescript-eslint/ban-types */
import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface Account {
  owner: Principal;
  subaccount: [] | [Uint8Array | number[]];
}
export interface DepositArgs {
  token: Principal;
  from: Account;
  amount: bigint;
}
export type DepositResponse =
  | {
      Ok: { credit_inc: bigint; txid: bigint; credit: bigint };
    }
  | {
      Err:
        | { TransferError: { message: string } }
        | { AmountBelowMinimum: {} }
        | { CallLedgerError: { message: string } };
    };
export type NotifyResult =
  | {
      Ok: { credit_inc: bigint; credit: bigint; deposit_inc: bigint };
    }
  | {
      Err: { NotAvailable: { message: string } } | { CallLedgerError: { message: string } };
    };
export interface TokenInfo {
  min_deposit: bigint;
  min_withdrawal: bigint;
  withdrawal_fee: bigint;
  deposit_fee: bigint;
}
export type WithdrawResult =
  | { Ok: { txid: bigint; amount: bigint } }
  | {
      Err: { AmountBelowMinimum: {} } | { InsufficientCredit: {} } | { CallLedgerError: { message: string } };
    };
export interface _SERVICE {
  icrc84_all_credits: ActorMethod<[], Array<[Principal, bigint]>>;
  icrc84_credit: ActorMethod<[Principal], bigint>;
  icrc84_deposit: ActorMethod<[DepositArgs], DepositResponse>;
  icrc84_notify: ActorMethod<[{ token: Principal }], NotifyResult>;
  icrc84_supported_tokens: ActorMethod<[], Array<Principal>>;
  icrc84_token_info: ActorMethod<[Principal], TokenInfo>;
  icrc84_trackedDeposit: ActorMethod<[Principal], { Ok: bigint } | { Err: { NotAvailable: { message: string } } }>;
  icrc84_withdraw: ActorMethod<[{ to: Account; token: Principal; amount: bigint }], WithdrawResult>;
  init: ActorMethod<[], undefined>;
  principalToSubaccount: ActorMethod<[Principal], [] | [Uint8Array | number[]]>;
  registerAsset: ActorMethod<[Principal], { Ok: bigint } | { Err: { AlreadyRegistered: bigint } }>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
