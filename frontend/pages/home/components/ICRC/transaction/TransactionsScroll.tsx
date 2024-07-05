import TransactionsTable from "@/pages/home/components/ICRC/transaction/TransactionsTable";
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

  const [tableData, setTableData] = useState<{
    transactions: Transaction[];
    chunkNumber: number;
  }>({
    transactions: [],
    chunkNumber: 1,
  });

  const { transactions, chunkNumber } = tableData;

  const isInitialLoadRef = useRef(true);
  const isAtBottomRef = useRef(false);
  const lastSelectedAccountRef = useRef<SubAccount | undefined>(selectedAccount);
  const lastSelectedAssetRef = useRef<Asset | undefined>(selectedAsset);
  const sortDirectionRef = useRef<SortOrderEnum>(SortOrderEnum.DESC);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const scrollFull = element.scrollHeight - element.clientHeight - 10;
    const isScrolledToBottom = scrollFull <= element.scrollTop;

    if (isScrolledToBottom && !isAtBottomRef.current) {
      if (transactionChunks.length <= chunkNumber) return;

      setTableData((prev) => ({
        ...prev,
        chunkNumber: prev.chunkNumber + 1,
      }));
    }

    if (!isScrolledToBottom) {
      if (isAtBottomRef.current) isAtBottomRef.current = false;
    }
  };

  const onSort = () => {
    const sorted = sortByDate(sortDirectionRef.current, transactions);

    setTableData((prev) => ({
      ...prev,
      transactions: sorted,
    }));

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

    setTableData({
      transactions: [],
      chunkNumber: 1,
    });
  }, [selectedAccount, selectedAsset]);

  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      const data = deChunkTransactions({
        transactions: transactionChunks,
        chunkNumber: 2,
        from: 1,
      });
      setTableData({
        transactions: data,
        chunkNumber: 2,
      });
      return;
    }

    const data = deChunkTransactions({
      transactions: transactionChunks,
      chunkNumber,
      from: 1,
    });

    setTableData((prev) => ({
      ...prev,
      transactions: data,
    }));
  }, [chunkNumber, transactionChunks]);

  return <TransactionsTable onScroll={onScroll} transactions={transactions} onSort={onSort} />;
}
