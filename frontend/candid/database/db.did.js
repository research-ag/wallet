export const idlFactory = ({ IDL }) => {
  const AssetDocument = IDL.Record({
    deleted: IDL.Bool,
    logo: IDL.Text,
    name: IDL.Text,
    tokenSymbol: IDL.Text,
    updatedAt: IDL.Nat32,
    supportedStandards: IDL.Vec(IDL.Text),
    address: IDL.Text,
    tokenName: IDL.Text,
    index: IDL.Text,
    sortIndex: IDL.Nat32,
    shortDecimal: IDL.Text,
    decimal: IDL.Text,
    subAccounts: IDL.Vec(
      IDL.Record({
        transaction_fee: IDL.Text,
        currency_amount: IDL.Text,
        name: IDL.Text,
        sub_account_id: IDL.Text,
        address: IDL.Text,
        amount: IDL.Text,
        decimal: IDL.Nat32,
        symbol: IDL.Text,
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
  const AllowanceDocument = IDL.Record({
    id: IDL.Text,
    deleted: IDL.Bool,
    asset: IDL.Record({
      logo: IDL.Text,
      name: IDL.Text,
      tokenSymbol: IDL.Text,
      supportedStandards: IDL.Vec(IDL.Text),
      address: IDL.Text,
      tokenName: IDL.Text,
      decimal: IDL.Text,
      symbol: IDL.Text,
    }),
    updatedAt: IDL.Nat32,
    expiration: IDL.Text,
    amount: IDL.Text,
    subAccountId: IDL.Text,
    spender: IDL.Text,
  });
  const WalletDatabase = IDL.Service({
    doesStorageExist: IDL.Func([], [IDL.Bool], ["query"]),
    dump: IDL.Func(
      [],
      [
        IDL.Vec(
          IDL.Tuple(
            IDL.Principal,
            IDL.Tuple(
              IDL.Vec(IDL.Opt(AssetDocument)),
              IDL.Vec(IDL.Opt(ContactDocument)),
              IDL.Vec(IDL.Opt(AllowanceDocument)),
            ),
          ),
        ),
      ],
      ["query"],
    ),
    pullAllowances: IDL.Func([IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat], [IDL.Vec(AllowanceDocument)], ["query"]),
    pullAssets: IDL.Func([IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat], [IDL.Vec(AssetDocument)], ["query"]),
    pullContacts: IDL.Func([IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat], [IDL.Vec(ContactDocument)], ["query"]),
    pushAllowances: IDL.Func([IDL.Vec(AllowanceDocument)], [IDL.Vec(AllowanceDocument)], []),
    pushAssets: IDL.Func([IDL.Vec(AssetDocument)], [IDL.Vec(AssetDocument)], []),
    pushContacts: IDL.Func([IDL.Vec(ContactDocument)], [IDL.Vec(ContactDocument)], []),
  });
  return WalletDatabase;
};
export const init = ({ IDL }) => {
  return [];
};
