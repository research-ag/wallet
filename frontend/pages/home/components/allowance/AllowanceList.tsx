import { useState } from "react";
import useAllowances from "@pages/home/hooks/useAllowances";
import { useAllowanceTable } from "@pages/home/hooks/useAllowanceTable";
import { Table, TableBody, TableBodyCell, TableHead, TableHeaderCell, TableRow } from "@components/table";
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel, SortingState } from "@tanstack/react-table";
import clsx from "clsx";

export default function AllowanceList() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { allowances } = useAllowances();
  const { columns } = useAllowanceTable();

  const table = useReactTable({
    data: allowances,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Table>
      <TableHeadGroup />
      <TableBodyGroup />
    </Table>
  );

  function TableHeadGroup() {
    return (
      <TableHead>
        {table.getHeaderGroups().map((headerGroup, indexTH) => (
          <TableRow key={`allowance-${indexTH}`}>
            {headerGroup.headers.map((header, indexTR) => {
              return (
                <TableHeaderCell key={`allowance-${indexTR}`} className={colStyle(indexTR)}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort() ? "cursor-pointer select-none w-full" : "w-full",
                        onClick: () => {
                          // header.column.getToggleSortingHandler()
                          console.log("perform sort");
                        },
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <span className="">Hola</span>,
                        desc: <span className="">Hola</span>,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
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
