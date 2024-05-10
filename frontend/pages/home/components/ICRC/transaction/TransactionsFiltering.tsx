import { chunkTransactions } from "@pages/home/helpers/mappers";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { useEffect, useRef } from "react";
import { setTransactions, updateTxWorkerSubAccount } from "@redux/transaction/TransactionReducer";
import { AssetSymbolEnum } from "@common/const";
import { getAllTransactionsICP, getAllTransactionsICRC1 } from "@pages/home/helpers/requests";
import { Asset, SubAccount, Transaction } from "@redux/models/AccountModels";
import { hexToUint8Array } from "@common/utils/hexadecimal";

export default function TransactionsFiltering({ children }: { children: JSX.Element }) {
  const dispatch = useAppDispatch();
  const { txWorker } = useAppSelector((state) => state.transaction.list);
  const { selectedAccount, selectedAsset } = useAppSelector((state) => state.asset.helper);
  const { assets } = useAppSelector((state) => state.asset.list);
  const lastSelectedAccountRef = useRef<SubAccount | undefined>(selectedAccount);

  const refreshICRCTransactions = async () => {
    const currentAsset = assets.find((asset: Asset) => asset.address === selectedAsset?.address);
    const isAssetFull = currentAsset?.index && selectedAccount?.sub_account_id && selectedAsset?.tokenSymbol;
    const isSubAccountSelected = selectedAccount?.sub_account_id;

    if (currentAsset && isAssetFull && isSubAccountSelected) {
      const canisterId = currentAsset.index || "";
      const assetSymbol = currentAsset.tokenSymbol;
      const canister = currentAsset.address;

      const subaccount_index = hexToUint8Array(selectedAccount?.sub_account_id || "0x0");
      const subNumber = selectedAccount?.sub_account_id;

      const transactions: Transaction[] = await getAllTransactionsICRC1({
        canisterId,
        subaccount_index,
        assetSymbol,
        canister,
        subNumber,
      });

      const chunks = chunkTransactions({
        transactions,
        chunkSize: 20,
      });

      const isAssetSelected = assetSymbol === selectedAsset?.tokenSymbol;
      if (isAssetSelected) dispatch(setTransactions(chunks));

      dispatch(
        updateTxWorkerSubAccount({
          symbol: assetSymbol,
          tokenSymbol: assetSymbol,
          subaccount: subNumber,
          tx: transactions,
        }),
      );
    }
  };

  const refreshICPTransactions = async () => {
    console.log("render icp");

    const isNotSelectedAsset =
      !selectedAccount?.symbol || !selectedAsset?.tokenSymbol || !selectedAccount?.sub_account_id;

    if (isNotSelectedAsset) return;

    const subaccount_index = selectedAccount?.sub_account_id || "";
    const isOGY = selectedAccount?.symbol === AssetSymbolEnum.Enum.OGY;

    const transactions: Transaction[] = await getAllTransactionsICP({
      subaccount_index,
      isOGY,
    });

    const chunks = chunkTransactions({
      transactions,
      chunkSize: 20,
    });

    dispatch(setTransactions(chunks));

    dispatch(
      updateTxWorkerSubAccount({
        symbol: selectedAsset?.symbol,
        tokenSymbol: selectedAsset?.tokenSymbol,
        subaccount: selectedAccount?.sub_account_id,
        tx: transactions,
      }),
    );
  };

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

    const isSelectedICP = selectedAsset?.tokenSymbol === AssetSymbolEnum.Enum.ICP;
    const isSelectedOGY = selectedAsset?.tokenSymbol === AssetSymbolEnum.Enum.OGY;

    if (isSelectedICP || isSelectedOGY) {
      await refreshICPTransactions();
    } else {
      await refreshICRCTransactions();
    }
  }

  useEffect(() => {
    const isSameSubAccount = lastSelectedAccountRef.current?.sub_account_id === selectedAccount?.sub_account_id;
    const isSameTokenSymbol = lastSelectedAccountRef.current?.symbol === selectedAccount?.symbol;
    if (isSameSubAccount && isSameTokenSymbol) return;

    filterTransactions();
  }, [selectedAccount]);

  return children;
}
