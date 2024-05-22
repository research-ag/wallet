import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export type Amount = bigint;
export type BalanceResponse = { Ok: Amount } | { Err: { NotAvailable: string } };
export interface DepositArgs {
  token: Token;
  subaccount: [] | [Subaccount];
  amount: Amount;
}
export type DepositResponse =
  | {
      Ok: { credit_inc: Amount; txid: bigint };
    }
  | {
      Err: { TransferError: string } | { AmountBelowMinimum: null } | { CallLedgerError: string };
    };
export interface NotifyArg {
  token: Token;
}
export type NotifyResponse = { Ok: NotifyResult } | { Err: { NotAvailable: string } | { CallLedgerError: string } };
export interface NotifyResult {
  credit_inc: Amount;
  deposit_inc: Amount;
}
export type Subaccount = Uint8Array | number[];
export type Token = Principal;
export interface TokenInfo {
  min_deposit: Amount;
  min_withdrawal: Amount;
  withdrawal_fee: Amount;
  deposit_fee: Amount;
}
export interface WithdrawArgs {
  token: Token;
  to_subaccount: [] | [Subaccount];
  amount: Amount;
}
export type WithdrawResponse =
  | {
      Ok: { txid: bigint; amount: Amount };
    }
  | {
      Err: { AmountBelowMinimum: null } | { InsufficientCredit: null } | { CallLedgerError: string };
    };
export interface _SERVICE {
  icrcX_all_credits: ActorMethod<[], Array<[Token, bigint]>>;
  icrcX_credit: ActorMethod<[Token], bigint>;
  icrcX_deposit: ActorMethod<[DepositArgs], DepositResponse>;
  icrcX_notify: ActorMethod<[NotifyArg], NotifyResponse>;
  icrcX_supported_tokens: ActorMethod<[], Array<Token>>;
  icrcX_token_info: ActorMethod<[Token], TokenInfo>;
  icrcX_trackedDeposit: ActorMethod<[Token], BalanceResponse>;
  icrcX_withdraw: ActorMethod<[WithdrawArgs], WithdrawResponse>;
  principalToSubaccount: ActorMethod<[Principal], [] | [Uint8Array | number[]]>;
}
