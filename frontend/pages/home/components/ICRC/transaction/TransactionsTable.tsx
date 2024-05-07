import { TransactionDrawer } from "@/@types/transactions";
import { AssetSymbolEnum } from "@/common/const";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import { useTransactionsTable } from "@pages/home/hooks/useTransactionsTable";
import { getAllTransactionsICP, getAllTransactionsICRC1 } from "@redux/assets/AssetActions";
import { Asset, SubAccount, Transaction } from "@redux/models/AccountModels";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { setTransactionDrawerAction } from "@redux/transaction/TransactionActions";
import { addTxWorker, setSelectedTransaction, setTransactions } from "@redux/transaction/TransactionReducer";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { clsx } from "clsx";
import { useEffect } from "react";

const ICRCTransactionsTable = () => {
  const dispatch = useAppDispatch();
  const { transactions, selectedTransaction } = useAppSelector((state) => state.transaction);
  const { columns, sorting, setSorting } = useTransactionsTable();

  const table = useReactTable({
    data: transactions || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full max-h-[calc(100vh-13rem)] scroll-y-light mt-4">
      <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
        <thead className="sticky top-0 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SecondaryColorLight dark:bg-SecondaryColor">
          {table.getHeaderGroups().map((headerGroup, idxTR) => (
            <tr key={`tr-transac-${idxTR}`}>
              {headerGroup.headers.map((header, idxTH) => (
                <th key={`th-transac-${idxTH}`} className={colStyle(idxTH)}>
                  <div
                    {...{
                      className: idxTH === 2 && header.column.getCanSort() ? "cursor-pointer select-none" : "",
                      onClick: idxTH === 2 ? header.column.getToggleSortingHandler() : undefined,
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, idxTR) => (
            <tr
              className={`border-b border-b-BorderColorTwoLight dark:border-b-BorderColorTwo cursor-pointer ${
                (selectedTransaction?.hash && selectedTransaction?.hash === row.original.hash) ||
                (selectedTransaction?.idx && selectedTransaction?.idx === row.original.idx)
                  ? "bg-SelectRowColor/10"
                  : ""
              }`}
              key={`tr-transac-${idxTR}`}
              onClick={() => {
                dispatch(setSelectedTransaction(row.original));
                setTransactionDrawerAction(TransactionDrawer.INSPECT);
              }}
            >
              {row.getVisibleCells().map((cell, idxTD) => (
                <td key={`tr-transac-${idxTD}`} className={colStyle(idxTD)}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Tailwind CSS
const colStyle = (idxTH: number) =>
  clsx({
    ["realtive"]: true,
    ["w-[5rem] min-w-[5rem] max-w-[5rem]"]: idxTH === 0,
    ["w-[calc(55%-5rem)] min-w-[calc(55%-5rem)] max-w-[calc(55%-5rem)]"]: idxTH === 1,
    ["w-[20%] min-w-[20%] max-w-[20%]"]: idxTH === 2,
    ["w-[25%] min-w-[25%] max-w-[25%]"]: idxTH === 3,
  });

export default function TransactionsTableWrapper() {
  const dispatch = useAppDispatch();
  const { txWorker } = useAppSelector((state) => state.transaction);
  const { selectedAccount, selectedAsset } = useAppSelector((state) => state.asset.helper);
  const { assets } = useAppSelector((state) => state.asset);

  const getSelectedSubaccountICRCTx = async (founded: boolean) => {
    const selectedToken = assets.find((tk: Asset) => tk.symbol === selectedAsset?.symbol);

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
    const auxTx: Transaction[] = await getAllTransactionsICP({
      subaccount_index: selectedAccount?.sub_account_id || "",
      loading: true,
      isOGY: selectedAccount?.symbol === AssetSymbolEnum.Enum.OGY,
    });

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

  async function filterTransactions() {
    const transactionsByAccount = txWorker.find((tx) => {
      return selectedAccount?.symbol === tx.tokenSymbol && selectedAccount?.sub_account_id === tx.subaccount;
    });

    if (transactionsByAccount) dispatch(setTransactions(transactionsByAccount.tx));
    else dispatch(setTransactions([]));

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
  }, [selectedAccount, selectedAsset, txWorker]);

  return <ICRCTransactionsTable />;
}
