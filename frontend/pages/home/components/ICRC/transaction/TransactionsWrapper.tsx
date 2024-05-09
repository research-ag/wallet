import { AssetSymbolEnum } from "@common/const";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import { getAllTransactionsICP, getAllTransactionsICRC1 } from "@pages/home/helpers/requests";
import { Asset, SubAccount, Transaction } from "@redux/models/AccountModels";
import store, { useAppDispatch, useAppSelector } from "@redux/Store";
import { addTxWorker, setTransactions } from "@redux/transaction/TransactionReducer";
import { useEffect } from "react";

interface TransactionsWrapperProps {
  children: JSX.Element;
}

export default function TransactionsWrapper({ children }: TransactionsWrapperProps) {
  const dispatch = useAppDispatch();
  const { txWorker } = useAppSelector((state) => state.transaction.list);
  const { selectedAccount, selectedAsset } = useAppSelector((state) => state.asset.helper);
  const { assets } = useAppSelector((state) => state.asset.list);

  const getSelectedSubaccountICRCTx = async (founded: boolean) => {
    const selectedToken = assets.find((tk: Asset) => tk.symbol === selectedAsset?.symbol);

    if (selectedToken) {
      const canisterId = selectedToken?.index || "";
      const subaccount_index = hexToUint8Array(selectedAccount?.sub_account_id || "0x0");
      const assetSymbol = selectedAsset?.tokenSymbol || "";
      const canister = selectedToken.address;
      const subNumber = selectedAccount?.sub_account_id;

      const transactions: Transaction[] = await getAllTransactionsICRC1({
        canisterId,
        subaccount_index,
        assetSymbol,
        canister,
        subNumber,
      });

      const isSelectedSubAccount =
        store.getState().asset.helper.selectedAccount?.sub_account_id === selectedAccount?.sub_account_id;
      const isAssetSelected = assetSymbol === store.getState().asset.helper.selectedAsset?.tokenSymbol;
      if (isSelectedSubAccount && isAssetSelected) store.dispatch(setTransactions(transactions));
      !founded && addNewTxsToList(transactions, selectedAsset, selectedAccount);
    }
  };

  const getSelectedSubaccountICPTx = async (founded: boolean) => {
    const subaccount_index = selectedAccount?.sub_account_id || "";
    const isOGY = selectedAccount?.symbol === AssetSymbolEnum.Enum.OGY;

    const transactions: Transaction[] = await getAllTransactionsICP({
      subaccount_index,
      isOGY,
    });

    store.dispatch(setTransactions(transactions));
    !founded && addNewTxsToList(transactions, selectedAsset, selectedAccount);
  };

  const addNewTxsToList = (txs: Transaction[], asset?: Asset, subacc?: SubAccount) => {
    if (asset && subacc) {
      dispatch(
        addTxWorker({
          symbol: asset.symbol,
          tokenSymbol: asset.tokenSymbol,
          subaccount: subacc.sub_account_id,
          tx: txs,
        }),
      );
    }
  };

  async function filterTransactions() {
    const selectedSubAccountId = selectedAccount?.sub_account_id;

    const transactionsByAccount = txWorker.find((tx) => {
      return selectedAccount?.symbol === tx.tokenSymbol && selectedSubAccountId === tx.subaccount;
    });

    if (transactionsByAccount) {
      dispatch(setTransactions(transactionsByAccount.tx));
    } else dispatch(setTransactions([]));

    const isSelectedICP = selectedAsset?.tokenSymbol === AssetSymbolEnum.Enum.ICP;
    const isSelectedOGY = selectedAsset?.tokenSymbol === AssetSymbolEnum.Enum.OGY;

    if (isSelectedICP || isSelectedOGY) {
      await getSelectedSubaccountICPTx(!!transactionsByAccount);
    } else {
      await getSelectedSubaccountICRCTx(!!transactionsByAccount);
    }
  }

  useEffect(() => {
    filterTransactions();
  }, [selectedAccount]);

  return children;
}
