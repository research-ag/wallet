import TransactionsTable from "./TransactionsTable";
import { useAppSelector } from "@redux/Store";
import { deChunkTransactions } from "@pages/home/helpers/mappers";
import { useEffect, useRef, useState } from "react";
import { Asset, SubAccount, Transaction } from "@redux/models/AccountModels";
import { sortByDate } from "@pages/home/helpers/sorters";

export enum SortOrderEnum {
  ASC = "asc",
  DESC = "desc",
}

export default function TransactionsWrapper() {
  const { transactions: transactionChunks } = useAppSelector((state) => state.transaction.list);
  const { selectedAccount, selectedAsset } = useAppSelector((state) => state.asset.helper);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chunkNumber, setChunkNumber] = useState(1);
  //
  const isInitialLoadRef = useRef(true);
  const isAtBottomRef = useRef(false);
  const lastSelectedAccountRef = useRef<SubAccount | undefined>(selectedAccount);
  const lastSelectedAssetRef = useRef<Asset | undefined>(selectedAsset);
  const sortDirectionRef = useRef<SortOrderEnum>(SortOrderEnum.DESC);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const isScrolledToBottom = element.scrollHeight - element.clientHeight <= element.scrollTop;

    if (isScrolledToBottom && !isAtBottomRef.current) {
      if (transactionChunks.length <= chunkNumber) return;
      setChunkNumber((prev) => prev + 1);
    }

    if (!isScrolledToBottom) {
      if (isAtBottomRef.current) isAtBottomRef.current = false;
    }
  };

  const onSort = () => {
    const sorted = sortByDate(sortDirectionRef.current, transactions);
    setTransactions(sorted);

    if (sortDirectionRef.current === SortOrderEnum.DESC) {
      sortDirectionRef.current = SortOrderEnum.ASC;
    } else {
      sortDirectionRef.current = SortOrderEnum.DESC;
    }
  };

  useEffect(() => {
    const isSameSubAccount = lastSelectedAccountRef.current?.sub_account_id === selectedAccount?.sub_account_id;
    const isSameTokenSymbol = lastSelectedAssetRef.current?.tokenSymbol === selectedAsset?.tokenSymbol;
    if (isSameSubAccount && isSameTokenSymbol) return;

    lastSelectedAccountRef.current = selectedAccount;
    lastSelectedAssetRef.current = selectedAsset;

    setTransactions([]);
    setChunkNumber(1);
  }, [selectedAccount, selectedAsset]);

  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      const data = deChunkTransactions({
        transactions: transactionChunks,
        chunkNumber: 2,
        from: 1,
      });

      setTransactions(data);
      setChunkNumber(2);
      return;
    }

    const data = deChunkTransactions({
      transactions: transactionChunks,
      chunkNumber,
      from: 1,
    });

    setTransactions(data);
  }, [chunkNumber, transactionChunks]);

  return <TransactionsTable onScroll={onScroll} transactions={transactions} onSort={onSort} />;
}
