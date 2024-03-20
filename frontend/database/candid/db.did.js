export const idlFactory = ({ IDL }) => {
  const TokenDocument = IDL.Record({
    fee: IDL.Text,
    deleted: IDL.Bool,
    logo: IDL.Text,
    name: IDL.Text,
    tokenSymbol: IDL.Text,
    updatedAt: IDL.Nat32,
    supportedStandards: IDL.Vec(IDL.Text),
    address: IDL.Text,
    tokenName: IDL.Text,
    index: IDL.Text,
    shortDecimal: IDL.Text,
    decimal: IDL.Text,
    id_number: IDL.Nat32,
    subAccounts: IDL.Vec(
      IDL.Record({
        currency_amount: IDL.Text,
        name: IDL.Text,
        numb: IDL.Text,
        amount: IDL.Text,
      }),
    ),
    symbol: IDL.Text,
  });
  const ContactDocument = IDL.Record({
    principal: IDL.Text,
    deleted: IDL.Bool,
    name: IDL.Text,
    assets: IDL.Vec(
      IDL.Record({
        subaccounts: IDL.Vec(
          IDL.Record({
            name: IDL.Text,
            sub_account_id: IDL.Text,
            subaccount_index: IDL.Text,
            allowance: IDL.Opt(IDL.Record({ allowance: IDL.Text, expires_at: IDL.Text })),
          }),
        ),
        logo: IDL.Text,
        tokenSymbol: IDL.Text,
        supportedStandards: IDL.Vec(IDL.Text),
        address: IDL.Text,
        shortDecimal: IDL.Text,
        decimal: IDL.Text,
        symbol: IDL.Text,
      }),
    ),
    updatedAt: IDL.Nat32,
    accountIdentier: IDL.Text,
  });
  const WalletDatabase = IDL.Service({
    doesStorageExist: IDL.Func([], [IDL.Bool], ["query"]),
    dump: IDL.Func(
      [],
      [
        IDL.Vec(
          IDL.Tuple(IDL.Principal, IDL.Tuple(IDL.Vec(IDL.Opt(TokenDocument)), IDL.Vec(IDL.Opt(ContactDocument)))),
        ),
      ],
      ["query"],
    ),
    pullContacts: IDL.Func([IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat], [IDL.Vec(ContactDocument)], ["query"]),
    pullTokens: IDL.Func([IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat], [IDL.Vec(TokenDocument)], ["query"]),
    pushContacts: IDL.Func([IDL.Vec(ContactDocument)], [IDL.Vec(ContactDocument)], []),
    pushTokens: IDL.Func([IDL.Vec(TokenDocument)], [IDL.Vec(TokenDocument)], []),
  });
  return WalletDatabase;
};
export const init = ({ IDL }) => {
  return [];
};
