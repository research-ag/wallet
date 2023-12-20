import { useAppDispatch, useAppSelector } from "@redux/Store";
import { useEffect } from "react";
import { getAllTransactionsICRC1, getAllTransactionsICP } from "@redux/assets/AssetActions";
import { Asset, SubAccount, Transaction } from "@redux/models/AccountModels";
import { addTxWorker, setSelectedTransaction, setTransactions } from "@redux/assets/AssetReducer";
import { AssetSymbolEnum } from "@/const";
import { hexToUint8Array } from "@/utils";
import { Token } from "@redux/models/TokenModels";
export const UseTransaction = () => {
  const dispatch = useAppDispatch();

  const { tokens, selectedAsset, selectedAccount, selectedTransaction, txWorker } = useAppSelector(
    (state) => state.asset,
  );

  const changeSelectedTransaction = (value: Transaction) => dispatch(setSelectedTransaction(value));

  const getSelectedSubaccountICRCTx = async (founded: boolean) => {
    const selectedToken = tokens.find((tk: Token) => tk.symbol === selectedAsset?.symbol);
    if (selectedToken) {
      const auxTx: Transaction[] = await getAllTransactionsICRC1(
        selectedToken?.index || "",
        hexToUint8Array(selectedAccount?.sub_account_id || "0x0"),
        true,
        selectedAsset?.tokenSymbol || "",
        selectedToken.address,
        selectedAccount?.sub_account_id,
      );

      !founded && addNewTxsToList(auxTx, selectedAsset, selectedAccount);
    }
  };

  const getSelectedSubaccountICPTx = async (founded: boolean) => {
    const auxTx: Transaction[] = await getAllTransactionsICP(
      selectedAccount?.sub_account_id || "",
      true,
      selectedAccount?.symbol === AssetSymbolEnum.Enum.OGY,
    );

    !founded && addNewTxsToList(auxTx, selectedAsset, selectedAccount);
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

  useEffect(() => {
    if (selectedAsset) {
      const founded = txWorker.find((tx) => {
        return selectedAccount?.symbol === tx.tokenSymbol && selectedAccount.sub_account_id === tx.subaccount;
      });

      if (founded) dispatch(setTransactions(founded.tx));

      if (
        selectedAsset?.tokenSymbol === AssetSymbolEnum.Enum.ICP ||
        selectedAsset?.tokenSymbol === AssetSymbolEnum.Enum.OGY
      ) {
        const getICPTx = async () => {
          await getSelectedSubaccountICPTx(founded ? true : false);
        };

        getICPTx();
      } else {
        const getICRCTx = async () => {
          await getSelectedSubaccountICRCTx(founded ? true : false);
        };

        getICRCTx();
      }
    }
  }, [selectedAccount]);

  return {
    selectedAsset,
    selectedTransaction,
    changeSelectedTransaction,
    getSelectedSubaccountICRCTx,
    getSelectedSubaccountICPTx,
  };
};
