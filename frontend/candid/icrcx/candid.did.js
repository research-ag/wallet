export const idlFactory = ({ IDL }) => {
  const Token = IDL.Principal;
  const Amount = IDL.Nat;

  const TokenInfo = IDL.Record({
    minDeposit: Amount,
    minWithdrawal: Amount,
    depositFee: Amount,
    withdrawalFee: Amount,
  });

  const SubAccount = IDL.Vec(IDL.Nat8);

  const NotifyArg = IDL.Record({
    token: Token,
  });

  const NotifyResult = IDL.Record({
    depositInc: Amount,
    creditInc: Amount,
  });

  const NotifyResponse = IDL.Variant({
    Ok: NotifyResult,
    Err: IDL.Variant({
      CallLedgerError: IDL.Text,
      NotAvailable: IDL.Text,
    }),
  });

  const BalanceResponse = IDL.Variant({
    Ok: Amount,
    Err: IDL.Variant({
      NotAvailable: IDL.Text,
    }),
  });

  const WithdrawArgs = IDL.Record({
    toSubaccount: IDL.Opt(SubAccount),
    amount: Amount,
    token: Token,
  });

  const WithdrawResponse = IDL.Variant({
    Ok: IDL.Record({
      txid: IDL.Nat,
      amount: Amount,
    }),
    Err: IDL.Variant({
      CallLedgerError: IDL.Text,
      InsufficientCredit: IDL.Text,
      AmountBelowMinimum: Amount,
    }),
  });

  const DepositArgs = IDL.Record({
    token: Token,
    amount: Amount,
    subaccount: IDL.Opt(SubAccount),
  });

  const DepositResponse = IDL.Variant({
    Ok: IDL.Record({
      txid: IDL.Nat,
      creditInc: Amount,
    }),
    Err: IDL.Variant({
      AmountBelowMinimum: Amount,
      CallLedgerError: IDL.Text,
      TransferError: IDL.Text,
    }),
  });

  return IDL.Service({
    // helper function
    principalToSubaccount: IDL.Func(
      [IDL.Principal],
      [IDL.Opt(SubAccount)],
      ["query"]
    ),

    // public queries
    icrcXSupportedTokens: IDL.Func([], [IDL.Vec(Token)], ["query"]),
    icrcXTokenInfo: IDL.Func([Token], [TokenInfo], ["query"]),

    // privates queries
    icrcXCredit: IDL.Func([Token], [IDL.Int], ["query"]),
    icrcXAllCredits: IDL.Func(
      [],
      [IDL.Vec(IDL.Record({ token: Token }))],
      ["query"]
    ),
    icrcXTrackedDeposit: IDL.Func([Token], [BalanceResponse], ["query"]),

    // updated
    icrcXNotify: IDL.Func([NotifyArg], [NotifyResponse], ["update"]),
    icrcXDeposit: IDL.Func([DepositArgs], [DepositResponse], ["update"]),
    icrcXWithdraw: IDL.Func([WithdrawArgs], [WithdrawResponse], ["update"]),
  });
};
