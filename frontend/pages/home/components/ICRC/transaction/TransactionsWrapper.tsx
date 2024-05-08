interface TransactionsWrapperProps {
  children: JSX.Element;
}

export default function TransactionsWrapper({ children }: TransactionsWrapperProps) {
  // const dispatch = useAppDispatch();
  // const { txWorker } = useAppSelector((state) => state.transaction);
  // const { selectedAccount, selectedAsset } = useAppSelector((state) => state.asset.helper);
  // const { assets } = useAppSelector((state) => state.asset);

  // const getSelectedSubaccountICRCTx = async (founded: boolean) => {
  //   const selectedToken = assets.find((tk: Asset) => tk.symbol === selectedAsset?.symbol);

  //   if (selectedToken) {
  //     const auxTx: Transaction[] = await getAllTransactionsICRC1(
  //       selectedToken?.index || "",
  //       hexToUint8Array(selectedAccount?.sub_account_id || "0x0"),
  //       true,
  //       selectedAsset?.tokenSymbol || "",
  //       selectedToken.address,
  //       selectedAccount?.sub_account_id,
  //     );

  //     !founded && addNewTxsToList(auxTx, selectedAsset, selectedAccount);
  //   }
  // };

  // const getSelectedSubaccountICPTx = async (founded: boolean) => {
  //   const auxTx: Transaction[] = await getAllTransactionsICP({
  //     subaccount_index: selectedAccount?.sub_account_id || "",
  //     loading: true,
  //     isOGY: selectedAccount?.symbol === AssetSymbolEnum.Enum.OGY,
  //   });

  //   !founded && addNewTxsToList(auxTx, selectedAsset, selectedAccount);
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

  // async function filterTransactions() {
  //   const transactionsByAccount = txWorker.find((tx) => {
  //     return selectedAccount?.symbol === tx.tokenSymbol && selectedAccount?.sub_account_id === tx.subaccount;
  //   });

  //   if (transactionsByAccount) dispatch(setTransactions(transactionsByAccount.tx));
  //   else dispatch(setTransactions([]));

  //   const isSelectedICP = selectedAsset?.tokenSymbol === AssetSymbolEnum.Enum.ICP;
  //   const isSelectedOGY = selectedAsset?.tokenSymbol === AssetSymbolEnum.Enum.OGY;

  //   if (isSelectedICP || isSelectedOGY) {
  //     await getSelectedSubaccountICPTx(!!transactionsByAccount);
  //   } else {
  //     await getSelectedSubaccountICRCTx(!!transactionsByAccount);
  //   }
  // }

  // useEffect(() => {
  //   filterTransactions();
  // }, [selectedAccount, selectedAsset, txWorker]);
  return children;
}
