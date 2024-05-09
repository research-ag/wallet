// svg
//
import { Asset, SubAccount, Transaction } from "@redux/models/AccountModels";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { setAccounts, setAssets, setSelectedAccount, setSelectedAsset } from "@redux/assets/AssetReducer";
import { setSelectedTransaction } from "@redux/transaction/TransactionReducer";

export const GeneralHook = () => {
  const dispatch = useAppDispatch();

  const { assets } = useAppSelector((state) => state.asset.list);
  const { ICPSubaccounts, accounts } = useAppSelector((state) => state.asset);
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset.helper);

  const { userAgent, userPrincipal } = useAppSelector((state) => state.auth);
  const changeAssets = (value: Array<Asset>) => dispatch(setAssets(value));
  const changeAccounts = (value: Array<SubAccount>) => dispatch(setAccounts(value));
  const changeSelectedAsset = (value: Asset) => dispatch(setSelectedAsset(value));
  const changeSelectedAccount = (value: SubAccount | undefined) => dispatch(setSelectedAccount(value));
  const changeSelectedTransaction = (value: Transaction | undefined) => dispatch(setSelectedTransaction(value));
  const getTotalAsset = (asset: Asset) => {
    let total = 0;
    let total_currency = 0;
    asset.subAccounts.map((sa) => {
      total = total + Number(sa.amount);
      total_currency = total_currency + Number(sa.currency_amount);
    });
    return { total: total.toString(), total_currency: total_currency.toString() };
  };

  const checkAssetAdded = (address: string) => {
    return assets.find((asst: Asset) => asst.address === address) ? true : false;
  };

  return {
    userAgent,
    userPrincipal,
    ICPSubaccounts,
    assets,
    accounts,
    selectedAsset,
    selectedAccount,
    changeAssets,
    changeAccounts,
    changeSelectedAsset,
    changeSelectedAccount,
    changeSelectedTransaction,
    //
    getTotalAsset,
    checkAssetAdded,
  };
};
