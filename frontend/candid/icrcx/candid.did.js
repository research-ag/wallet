export const idlFactory = ({ IDL }) => {
  const Account = IDL.Record({
    "owner" : IDL.Principal,
    "subaccount" : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const DepositArgs = IDL.Record({
    "token" : IDL.Principal,
    "from" : Account,
    "amount" : IDL.Nat,
  });
  const DepositResponse = IDL.Variant({
    "Ok" : IDL.Record({
      "credit_inc" : IDL.Nat,
      "txid" : IDL.Nat,
      "credit" : IDL.Int,
    }),
    "Err" : IDL.Variant({
      "TransferError" : IDL.Record({ "message" : IDL.Text }),
      "AmountBelowMinimum" : IDL.Record({}),
      "CallLedgerError" : IDL.Record({ "message" : IDL.Text }),
    }),
  });
  const NotifyResult = IDL.Variant({
    "Ok" : IDL.Record({
      "credit_inc" : IDL.Nat,
      "credit" : IDL.Int,
      "deposit_inc" : IDL.Nat,
    }),
    "Err" : IDL.Variant({
      "NotAvailable" : IDL.Record({ "message" : IDL.Text }),
      "CallLedgerError" : IDL.Record({ "message" : IDL.Text }),
    }),
  });
  const TokenInfo = IDL.Record({
    "min_deposit" : IDL.Nat,
    "min_withdrawal" : IDL.Nat,
    "withdrawal_fee" : IDL.Nat,
    "deposit_fee" : IDL.Nat,
  });
  const WithdrawResult = IDL.Variant({
    "Ok" : IDL.Record({ "txid" : IDL.Nat, "amount" : IDL.Nat }),
    "Err" : IDL.Variant({
      "AmountBelowMinimum" : IDL.Record({}),
      "InsufficientCredit" : IDL.Record({}),
      "CallLedgerError" : IDL.Record({ "message" : IDL.Text }),
    }),
  });
  return IDL.Service({
    "icrc84_all_credits" : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Int))],
        ["query"],
      ),
    "icrc84_credit" : IDL.Func([IDL.Principal], [IDL.Int], ["query"]),
    "icrc84_deposit" : IDL.Func([DepositArgs], [DepositResponse], []),
    "icrc84_notify" : IDL.Func(
        [IDL.Record({ "token" : IDL.Principal })],
        [NotifyResult],
        [],
      ),
    "icrc84_supported_tokens" : IDL.Func(
        [],
        [IDL.Vec(IDL.Principal)],
        ["query"],
      ),
    "icrc84_token_info" : IDL.Func([IDL.Principal], [TokenInfo], ["query"]),
    "icrc84_trackedDeposit" : IDL.Func(
        [IDL.Principal],
        [
          IDL.Variant({
            "Ok" : IDL.Nat,
            "Err" : IDL.Variant({
              "NotAvailable" : IDL.Record({ "message" : IDL.Text }),
            }),
          }),
        ],
        ["query"],
      ),
    "icrc84_withdraw" : IDL.Func(
        [
          IDL.Record({
            "to" : Account,
            "token" : IDL.Principal,
            "amount" : IDL.Nat,
          }),
        ],
        [WithdrawResult],
        [],
      ),
    "init" : IDL.Func([], [], []),
    "principalToSubaccount" : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        ["query"],
      ),
    "registerAsset" : IDL.Func(
        [IDL.Principal],
        [
          IDL.Variant({
            "Ok" : IDL.Nat,
            "Err" : IDL.Variant({ "AlreadyRegistered" : IDL.Nat }),
          }),
        ],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };