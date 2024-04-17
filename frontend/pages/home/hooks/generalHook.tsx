// svg
//
import { Asset, SubAccount, Transaction } from "@redux/models/AccountModels";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import {
  setAccounts,
  setAssets,
  setSelectedAccount,
  setSelectedAsset,
} from "@redux/assets/AssetReducer";
import { setSelectedTransaction, setTransactions } from "@redux/transaction/TransactionReducer";

export const GeneralHook = () => {
  const dispatch = useAppDispatch();
  const { transactions, selectedTransaction } = useAppSelector((state) => state.transaction);

  const { ICPSubaccounts, assets, accounts, selectedAsset, selectedAccount } = useAppSelector(
    (state) => state.asset,
  );

  const { userAgent, userPrincipal } = useAppSelector((state) => state.auth);
  const changeAssets = (value: Array<Asset>) => dispatch(setAssets(value));
  const changeAccounts = (value: Array<SubAccount>) => dispatch(setAccounts(value));
  const changeTransactions = (value: Array<Transaction>) => dispatch(setTransactions(value));
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

  const asciiHex = [
    "Backspace",
    "Enter",
    "Control",
    "End",
    "Home",
    "ArrowLeft",
    "ArrowRight",
    "Delete",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "V",
    "X",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "v",
    "x",
  ];

  return {
    userAgent,
    userPrincipal,
    ICPSubaccounts,
    assets,
    accounts,
    transactions,
    selectedAsset,
    selectedAccount,
    selectedTransaction,
    changeAssets,
    changeAccounts,
    changeTransactions,
    changeSelectedAsset,
    changeSelectedAccount,
    changeSelectedTransaction,
    asciiHex,
    //
    getTotalAsset,
    checkAssetAdded,
  };
};
