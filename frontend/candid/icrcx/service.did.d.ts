import { ActorMethod } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";

export type Token = Principal;
export type Amount = bigint;

export interface TokenInfo {
  minDeposit: Amount;
  minWithdraw: Amount;
  depositFee: Amount;
  withdrawFee: Amount;
}

export type Subaccount = Uint8Array[];

export interface NotifyArg {
  token: Token;
};

export interface NotifyResult {
  depositInc: Amount;
  creditInc: Amount;
};

export interface NotifyResponse {
  Ok: NotifyResult;
  Err: {
    CallLedgerError: string;
    NotAvailable: string;
  },
};

export interface BalanceResponse {
  Ok: Amount;
  Err: {
    NotAvailable: string;
  },
};

export interface WithdrawArgs {
  toSubaccount?: Subaccount;
  amount: Amount;
  token: Token;
};

export interface WithdrawResponse {
  Ok: {
    // TODO: confirm the type
    txid: bigint;
    amount: Amount;
  };
  Err: {
    CallLedgerError: string;
    InsufficientBalance: string;
    AmountBelowMinimum: Amount;
  };
};

export interface DepositArgs {
  token: Token;
  amount: Amount;
  subaccount?: Subaccount;
};


export interface DepositResponse {
  Ok: {
    txid: bigint;
    creditInc: Amount;
  };
  Err: {
    AmountBelowMinimum: Amount;
    CallLedgerError: string;
    TransferError: string;
  };
};


export interface _SERVICE {
  principalToSubaccount: ActorMethod<[Principal], Subaccount | undefined>;

  // public queries
  icrcXSupportedTokens: ActorMethod<[], Token[]>;
  icrcXTokenInfo: ActorMethod<[Token], TokenInfo>;

  // privates queries
  icrcXCredit: ActorMethod<[Token], bigint>; 
  icrcXAllCredits: ActorMethod<[], [Token, bigint][]>;
  icrcXTrackedDeposit: ActorMethod<[Token], BalanceResponse>;

  // update methods
  icrcXNotify: ActorMethod<[NotifyArg], NotifyResponse>;
  icrcXDeposit: ActorMethod<[DepositArgs], DepositResponse>;
  icrcXWithdraw: ActorMethod<[WithdrawArgs], WithdrawResponse>;
};
