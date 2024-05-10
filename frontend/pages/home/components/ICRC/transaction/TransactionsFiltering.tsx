import { chunkTransactions } from "@pages/home/helpers/mappers";
// import { AssetSymbolEnum } from "@common/const";
// import { getAllTransactionsICP } from "@pages/home/helpers/requests";
// import { Asset, Transaction } from "@redux/models/AccountModels";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { useEffect } from "react";
import { setTransactions } from "@redux/transaction/TransactionReducer";

export default function TransactionsFiltering({ children }: { children: JSX.Element }) {
  const dispatch = useAppDispatch();
  const { txWorker } = useAppSelector((state) => state.transaction.list);
  const { selectedAccount } = useAppSelector((state) => state.asset.helper);
  // const { assets } = useAppSelector((state) => state.asset.list);

  // const getSelectedSubaccountICRCTx = async (founded: boolean) => {
  //   const selectedToken = assets.find((asset: Asset) => asset.address === selectedAsset?.address);
  // if (selectedToken) {
  //   const canisterId = selectedToken?.index || "";
  //   const subaccount_index = hexToUint8Array(selectedAccount?.sub_account_id || "0x0");
  //   const assetSymbol = selectedAsset?.tokenSymbol || "";
  //   const canister = selectedToken.address;
  //   const subNumber = selectedAccount?.sub_account_id;
  //   const transactions: Transaction[] = await getAllTransactionsICRC1({
  //     canisterId,
  //     subaccount_index,
  //     assetSymbol,
  //     canister,
  //     subNumber,
  //   });
  //   const isAssetSelected = assetSymbol === store.getState().asset.helper.selectedAsset?.tokenSymbol;
  //   if (isAssetSelected) store.dispatch(setTransactions(transactions));

  // !founded && addNewTxsToList(transactions, selectedAsset, selectedAccount);
  // }
  // };

  // const getSelectedSubaccountICPTx = async (founded: boolean) => {
  //   const subaccount_index = selectedAccount?.sub_account_id || "";
  //   const isOGY = selectedAccount?.symbol === AssetSymbolEnum.Enum.OGY;

  //   const transactions: Transaction[] = await getAllTransactionsICP({
  //     subaccount_index,
  //     isOGY,
  //   });

  // store.dispatch(setTransactions(transactions));
  // !founded && addNewTxsToList(transactions, selectedAsset, selectedAccount);
  // };

  // const addNewTxsToList = (txs: Transaction[], asset?: Asset, subacc?: SubAccount) => {
  //   if (asset && subacc) {
  //     dispatch(
  //       addTxWorker({
  //         symbol: asset.symbol,
  //         tokenSymbol: asset.tokenSymbol,
  //         subaccount: subacc.sub_account_id,
  //         tx: txs,
  //       }),
  //     );
  //   }
  // };

  async function filterTransactions() {
    const selectedSubAccountId = selectedAccount?.sub_account_id;

    const transactionsByAccount = txWorker.find((tx) => {
      return selectedAccount?.symbol === tx.tokenSymbol && selectedSubAccountId === tx.subaccount;
    });

    const handledTransactions = transactionsByAccount?.tx || [];

    const transactionsChunks = chunkTransactions({
      transactions: handledTransactions,
      chunkSize: 20,
    });

    dispatch(setTransactions(transactionsChunks));
    // dispatch(setTransactions([]));

    // TODO: refresh transactions based on the selected asset and sub account
    // const isSelectedICP = selectedAsset?.tokenSymbol === AssetSymbolEnum.Enum.ICP;
    // const isSelectedOGY = selectedAsset?.tokenSymbol === AssetSymbolEnum.Enum.OGY;

    // if (isSelectedICP || isSelectedOGY) {
    //   await getSelectedSubaccountICPTx(!!transactionsByAccount);
    // } else {
    //   await getSelectedSubaccountICRCTx(!!transactionsByAccount);
    // }
  }

  useEffect(() => {
    filterTransactions();
  }, [selectedAccount]);

  return children;
}
