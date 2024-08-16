import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export interface Account {
  owner: Principal;
  subaccount: [] | [Subaccount];
}
export type Amount = bigint;
export type BalanceResponse = { Ok: Amount } | { Err: { NotAvailable: { message: string } } };
export type CancelOrderResponse = { Ok: null } | { Err: { UnknownOrder: null } | { UnknownPrincipal: null } };
export type CancellationArg = { all: [] | [Array<Token>] } | { orders: Array<{ ask: OrderId } | { bid: OrderId }> };
export interface DepositArgs {
  token: Token;
  from: Account;
  amount: Amount;
  expected_fee: [] | [bigint];
}
export type DepositResponse =
  | { Ok: DepositResult }
  | {
      Err:
        | { TransferError: { message: string } }
        | { AmountBelowMinimum: any }
        | { CallLedgerError: { message: string } }
        | { BadFee: { expected_fee: bigint } };
    };
export interface DepositResult {
  credit_inc: Amount;
  txid: bigint;
  credit: bigint;
}
export interface IndicativeStats {
  clearingPrice: number;
  totalAskVolume: bigint;
  clearingVolume: bigint;
  totalBidVolume: bigint;
}
export type ManageOrdersResponse =
  | { Ok: Array<OrderId> }
  | {
      Err:
        | {
            placement: {
              error:
                | {
                    ConflictingOrder: [{ ask: null } | { bid: null }, [] | [OrderId]];
                  }
                | { UnknownAsset: null }
                | { NoCredit: null }
                | { VolumeStepViolated: { baseVolumeStep: bigint } }
                | { TooLowOrder: null };
              index: bigint;
            };
          }
        | { UnknownPrincipal: null }
        | {
            cancellation: {
              error: { UnknownAsset: null } | { UnknownOrder: null };
              index: bigint;
            };
          };
    };
export interface NotifyArg {
  token: Token;
}
export type NotifyResponse =
  | { Ok: NotifyResult }
  | {
      Err: { NotAvailable: { message: string } } | { CallLedgerError: { message: string } };
    };
export interface NotifyResult {
  credit_inc: Amount;
  credit: bigint;
  deposit_inc: Amount;
}
export interface Order {
  icrc1Ledger: Token;
  volume: bigint;
  price: number;
}
export type OrderId = bigint;
export type PlaceArg = Array<{ ask: [Token, bigint, number] } | { bid: [Token, bigint, number] }>;
export type PlaceOrderResponse =
  | { Ok: OrderId }
  | {
      Err:
        | {
            ConflictingOrder: [{ ask: null } | { bid: null }, [] | [OrderId]];
          }
        | { UnknownAsset: null }
        | { NoCredit: null }
        | { UnknownPrincipal: null }
        | { VolumeStepViolated: { baseVolumeStep: bigint } }
        | { TooLowOrder: null };
    };
export type ReplaceOrderResponse =
  | { Ok: OrderId }
  | {
      Err:
        | {
            ConflictingOrder: [{ ask: null } | { bid: null }, [] | [OrderId]];
          }
        | { UnknownAsset: null }
        | { UnknownOrder: null }
        | { NoCredit: null }
        | { UnknownPrincipal: null }
        | { VolumeStepViolated: { baseVolumeStep: bigint } }
        | { TooLowOrder: null };
    };
export type Subaccount = Uint8Array | number[];
export type Token = Principal;
export interface TokenInfo {
  allowance_fee: Amount;
  withdrawal_fee: Amount;
  deposit_fee: Amount;
}
export interface WithdrawArgs {
  to: Account;
  token: Token;
  amount: Amount;
  expected_fee: [] | [bigint];
}
export type WithdrawResponse =
  | {
      Ok: { txid: bigint; amount: Amount };
    }
  | {
      Err:
        | { AmountBelowMinimum: any }
        | { InsufficientCredit: any }
        | { CallLedgerError: { message: string } }
        | { BadFee: { expected_fee: bigint } };
    };
export interface _SERVICE {
  addAdmin: ActorMethod<[Principal], undefined>;
  cancelAsks: ActorMethod<[Array<OrderId>], Array<CancelOrderResponse>>;
  cancelBids: ActorMethod<[Array<OrderId>], Array<CancelOrderResponse>>;
  getQuoteLedger: ActorMethod<[], Principal>;
  icrc84_all_credits: ActorMethod<[], Array<[Token, bigint]>>;
  icrc84_credit: ActorMethod<[Token], bigint>;
  icrc84_deposit: ActorMethod<[DepositArgs], DepositResponse>;
  icrc84_notify: ActorMethod<[NotifyArg], NotifyResponse>;
  icrc84_supported_tokens: ActorMethod<[], Array<Token>>;
  icrc84_token_info: ActorMethod<[Token], TokenInfo>;
  icrc84_trackedDeposit: ActorMethod<[Token], BalanceResponse>;
  icrc84_withdraw: ActorMethod<[WithdrawArgs], WithdrawResponse>;
  indicativeStats: ActorMethod<[Principal], IndicativeStats>;
  listAdmins: ActorMethod<[], Array<Principal>>;
  manageOrders: ActorMethod<[[] | [CancellationArg], PlaceArg], ManageOrdersResponse>;
  placeAsks: ActorMethod<[Array<[Token, bigint, number]>], Array<PlaceOrderResponse>>;
  placeBids: ActorMethod<[Array<[Token, bigint, number]>], Array<PlaceOrderResponse>>;
  principalToSubaccount: ActorMethod<[Principal], [] | [Uint8Array | number[]]>;
  queryAsks: ActorMethod<[], Array<[OrderId, Order]>>;
  queryBids: ActorMethod<[], Array<[OrderId, Order]>>;
  queryCredits: ActorMethod<[], Array<[Principal, { total: bigint; locked: bigint; available: bigint }]>>;
  queryPriceHistory: ActorMethod<[[] | [Token], bigint, bigint], Array<[bigint, bigint, Token, bigint, number]>>;
  queryTokenAsks: ActorMethod<[Token], Array<[OrderId, Order]>>;
  queryTokenBids: ActorMethod<[Token], Array<[OrderId, Order]>>;
  queryTransactionHistory: ActorMethod<
    [[] | [Token], bigint, bigint],
    Array<[bigint, bigint, { ask: null } | { bid: null }, Token, bigint, number]>
  >;
  registerAsset: ActorMethod<[Principal, bigint], { Ok: bigint } | { Err: { AlreadyRegistered: bigint } }>;
  removeAdmin: ActorMethod<[Principal], undefined>;
  replaceAsk: ActorMethod<[OrderId, bigint, number], ReplaceOrderResponse>;
  replaceBid: ActorMethod<[OrderId, bigint, number], ReplaceOrderResponse>;
  sessionRemainingTime: ActorMethod<[], bigint>;
  sessionsCounter: ActorMethod<[], bigint>;
  settings: ActorMethod<[], { orderQuoteVolumeMinimum: bigint; orderQuoteVolumeStep: bigint }>;
}
