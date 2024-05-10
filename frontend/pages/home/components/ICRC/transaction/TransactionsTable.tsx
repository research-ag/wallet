import { TransactionDrawer } from "@/@types/transactions";
import { useTransactionsTable } from "@pages/home/hooks/useTransactionsTable";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { setTransactionDrawerAction } from "@redux/transaction/TransactionActions";
import { setSelectedTransaction } from "@redux/transaction/TransactionReducer";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { clsx } from "clsx";

export default function ICRCTransactionsTable() {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((state) => state.transaction.list);
  const { selectedTransaction } = useAppSelector((state) => state.transaction);
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
}

// Tailwind CSS
const colStyle = (idxTH: number) =>
  clsx({
    ["realtive"]: true,
    ["w-[5rem] min-w-[5rem] max-w-[5rem]"]: idxTH === 0,
    ["w-[calc(55%-5rem)] min-w-[calc(55%-5rem)] max-w-[calc(55%-5rem)]"]: idxTH === 1,
    ["w-[20%] min-w-[20%] max-w-[20%]"]: idxTH === 2,
    ["w-[25%] min-w-[25%] max-w-[25%]"]: idxTH === 3,
  });
