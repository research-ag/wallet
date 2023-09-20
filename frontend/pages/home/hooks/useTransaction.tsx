import { useAppDispatch, useAppSelector } from "@redux/Store";
import { useEffect } from "react";
import { getAllTransactionsICRC1, getAllTransactionsICP } from "@redux/assets/AssetActions";
import { Transaction } from "@redux/models/AccountModels";
import { setSelectedTransaction } from "@redux/assets/AssetReducer";
import { AssetSymbolEnum } from "@/const";
import { hexToUint8Array } from "@/utils";
import { Token } from "@redux/models/TokenModels";
export const UseTransaction = () => {
  const dispatch = useAppDispatch();

  const { tokens, selectedAsset, selectedAccount, selectedTransaction } = useAppSelector((state) => state.asset);

  const changeSelectedTransaction = (value: Transaction) => dispatch(setSelectedTransaction(value));

  useEffect(() => {
    if (selectedAsset?.tokenSymbol === AssetSymbolEnum.Enum.ICP) {
      const getICPTx = async () => {
        await getAllTransactionsICP(selectedAccount?.sub_account_id || "", true);
      };

      getICPTx();
    } else {
      const getICRCTx = async () => {
        const selectedToken = tokens.find((tk: Token) => tk.symbol === selectedAsset?.tokenSymbol);
        if (selectedToken) {
          getAllTransactionsICRC1(
            selectedToken?.index || "",
            hexToUint8Array(selectedAccount?.sub_account_id || "0x0"),
            true,
            selectedAsset?.tokenSymbol || "",
            selectedAsset?.symbol || "",
            selectedToken.address,
            selectedAccount?.sub_account_id,
          );
        }
      };

      getICRCTx();
    }
  }, [selectedAccount]);

  return { selectedAsset, selectedTransaction, changeSelectedTransaction };
};
