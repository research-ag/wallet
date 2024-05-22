export const idlFactory = ({ IDL }) => {
  const Token = IDL.Principal;
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Amount = IDL.Nat;
  const DepositArgs = IDL.Record({
    "token" : Token,
    "subaccount" : IDL.Opt(Subaccount),
    "amount" : Amount,
  });
  const DepositResponse = IDL.Variant({
    "Ok" : IDL.Record({ "credit_inc" : Amount, "txid" : IDL.Nat }),
    "Err" : IDL.Variant({
      "TransferError" : IDL.Text,
      "AmountBelowMinimum" : IDL.Null,
      "CallLedgerError" : IDL.Text,
    }),
  });
  const NotifyArg = IDL.Record({ "token" : Token });
  const NotifyResult = IDL.Record({
    "credit_inc" : Amount,
    "deposit_inc" : Amount,
  });
  const NotifyResponse = IDL.Variant({
    "Ok" : NotifyResult,
    "Err" : IDL.Variant({
      "NotAvailable" : IDL.Text,
      "CallLedgerError" : IDL.Text,
    }),
  });
  const TokenInfo = IDL.Record({
    "min_deposit" : Amount,
    "min_withdrawal" : Amount,
    "withdrawal_fee" : Amount,
    "deposit_fee" : Amount,
  });
  const BalanceResponse = IDL.Variant({
    "Ok" : Amount,
    "Err" : IDL.Variant({ "NotAvailable" : IDL.Text }),
  });
  const WithdrawArgs = IDL.Record({
    "token" : Token,
    "to_subaccount" : IDL.Opt(Subaccount),
    "amount" : Amount,
  });
  const WithdrawResponse = IDL.Variant({
    "Ok" : IDL.Record({ "txid" : IDL.Nat, "amount" : Amount }),
    "Err" : IDL.Variant({
      "AmountBelowMinimum" : IDL.Null,
      "InsufficientCredit" : IDL.Null,
      "CallLedgerError" : IDL.Text,
    }),
  });
  return IDL.Service({
    "icrcX_all_credits" : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(Token, IDL.Int))],
        ["query"],
      ),
    "icrcX_credit" : IDL.Func([Token], [IDL.Int], ["query"]),
    "icrcX_deposit" : IDL.Func([DepositArgs], [DepositResponse], []),
    "icrcX_notify" : IDL.Func([NotifyArg], [NotifyResponse], []),
    "icrcX_supported_tokens" : IDL.Func([], [IDL.Vec(Token)], ["query"]),
    "icrcX_token_info" : IDL.Func([Token], [TokenInfo], ["query"]),
    "icrcX_trackedDeposit" : IDL.Func([Token], [BalanceResponse], ["query"]),
    "icrcX_withdraw" : IDL.Func([WithdrawArgs], [WithdrawResponse], []),
    "principalToSubaccount" : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        ["query"],
      ),
  });
};
export const init = ({ IDL }) => { return []; };