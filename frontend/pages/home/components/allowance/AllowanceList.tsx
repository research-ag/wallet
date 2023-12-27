import useAllowances from "@pages/home/hooks/useAllowances";
import LoadingLoader from "@components/Loader";
import EditAllowanceDrawer from "./EditAllowanceDrawer";
import clsx from "clsx";
import { useState } from "react";
import { useAllowanceTable } from "@pages/home/hooks/useAllowanceTable";
import { Table, TableBody, TableBodyCell, TableHead, TableHeaderCell, TableRow } from "@components/core/table";
import { ReactComponent as ArrowUp } from "@assets/svg/files/arrow-up.svg";
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel, SortingState } from "@tanstack/react-table";

export default function AllowanceList() {
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { allowances, isLoading, refetch } = useAllowances();
  const { columns } = useAllowanceTable({
    onDrawerOpen: () => setDrawerOpen(true),
    refetchAllowances: refetch,
  });

  const table = useReactTable({
    data: allowances,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return <LoadingLoader className="mt-10" />;
  }

  return (
    <>
      <EditAllowanceDrawer isDrawerOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
      <Table>
        <TableHeadGroup />
        <TableBodyGroup />
      </Table>
    </>
  );

  function TableHeadGroup() {
    return (
      <TableHead>
        {table.getHeaderGroups().map((headerGroup, indexTH) => (
          <TableRow key={`allowance-${indexTH}`}>
            {headerGroup.headers.map((header, indexTR) => {
              return (
                <TableHeaderCell key={`allowance-${indexTR}`} className={colStyle(indexTR)}>
                  <div
                    {...{
                      className: indexTR <= 1 && header.column.getCanSort() ? "cursor-pointer select-none" : "",
                      onClick: indexTR <= 1 ? header.column.getToggleSortingHandler() : undefined,
                    }}
                    className="flex"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {indexTR <= 4 && header.column.getCanSort() && (
                      <div className="relative flex top-1.5">
                        <ArrowUp className="relative w-3 h-3 left-1" />
                        <ArrowUp className="relative w-3 h-3 rotate-180" />
                      </div>
                    )}
                  </div>
                </TableHeaderCell>
              );
            })}
          </TableRow>
        ))}
      </TableHead>
    );
  }

  function TableBodyGroup() {
    return (
      <TableBody>
        {table.getRowModel().rows.map((row, idxTR) => {
          return (
            <TableRow key={`allowance-${idxTR}`}>
              {row.getVisibleCells().map((cell, idxTD) => {
                return (
                  <TableBodyCell key={`allowance-${idxTD}`} className={colStyle(idxTD)}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableBodyCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    );
  }
}

const colStyle = (idxTH: number) =>
  clsx(
    idxTH === 0 && "w-[25%] min-w-[25%] max-w-[25%]",
    idxTH === 1 && "w-[25%] min-w-[25%] max-w-[25%]",
    idxTH === 2 && "w-[25%] min-w-[25%] max-w-[25%]",
    idxTH === 3 && "w-[25%] min-w-[25%] max-w-[25%]",
  );
