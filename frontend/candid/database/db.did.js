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
    updatedAt: IDL.Nat32,
    accounts: IDL.Vec(
      IDL.Record({
        subaccountId: IDL.Text,
        name: IDL.Text,
        subaccount: IDL.Text,
        tokenSymbol: IDL.Text,
      }),
    ),
    accountIdentifier: IDL.Text,
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
    subAccountId: IDL.Text,
    spender: IDL.Text,
  });
  const ServiceDocument = IDL.Record({
    principal: IDL.Text,
    deleted: IDL.Bool,
    name: IDL.Text,
    assets: IDL.Vec(
      IDL.Record({
        principal: IDL.Text,
        logo: IDL.Text,
        tokenSymbol: IDL.Text,
        tokenName: IDL.Text,
        shortDecimal: IDL.Text,
        decimal: IDL.Text,
      }),
    ),
    updatedAt: IDL.Nat32,
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
    pullServices: IDL.Func([IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat], [IDL.Vec(ServiceDocument)], ["query"]),
    pushAllowances: IDL.Func([IDL.Vec(AllowanceDocument)], [IDL.Vec(AllowanceDocument)], []),
    pushAssets: IDL.Func([IDL.Vec(AssetDocument)], [IDL.Vec(AssetDocument)], []),
    pushContacts: IDL.Func([IDL.Vec(ContactDocument)], [IDL.Vec(ContactDocument)], []),
    pushServices: IDL.Func([IDL.Vec(ServiceDocument)], [IDL.Vec(ServiceDocument)], []),
  });
  return WalletDatabase;
};
export const init = ({ IDL }) => {
  return [];
};
