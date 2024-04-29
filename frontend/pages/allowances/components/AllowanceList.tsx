import { AllowancesTableColumns } from "@/@types/allowance";
import { isDateExpired } from "@/utils/time";
import { Table, TableBody, TableBodyCell, TableHead, TableHeaderCell, TableRow } from "@components/table";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { clsx } from "clsx";
import UpdateAllowanceDrawer from "@pages/allowances/components/UpdateAllowanceDrawer";
import DeleteAllowanceModal from "@pages/allowances/components/DeleteAllowanceModal";
import useAllowances from "@pages/allowances/hooks/useAllowances";
import useAllowanceTable from "@pages/allowances/hooks/useAllowanceTable";

export default function AllowanceList() {
  const { allowances, handleSortChange } = useAllowances();
  const { columns } = useAllowanceTable();

  const table = useReactTable({
    data: allowances,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <DeleteAllowanceModal />
      <UpdateAllowanceDrawer />
      <Table>
        <TableHeadGroup />
        <TableBodyGroup />
      </Table>
    </>
  );

  function TableHeadGroup() {
    const handleSorter = async (column: AllowancesTableColumns) => {
      handleSortChange(column);
    };

    return (
      <TableHead>
        {table.getHeaderGroups().map((headerGroup, indexTH) => (
          <TableRow key={`allowance-${indexTH}`}>
            {headerGroup.headers.map((header, indexTR) => {
              const column = header.column.id;
              return (
                <TableHeaderCell key={`allowance-${indexTR}`} className={colStyle(indexTR)}>
                  <div
                    {...{
                      className: indexTR <= 3 && header.column.getCanSort() ? "cursor-pointer select-none" : "",
                      onClick: indexTR <= 3 ? () => handleSorter(column as AllowancesTableColumns) : undefined,
                    }}
                    className="flex text-md text-PrimaryTextColorLight/50 dark:text-PrimaryTextColor/50"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
      <TableBody className="divide-y dark:divide-slate-200/5">
        {table.getRowModel().rows.map((row, idxTR) => {
          return (
            <TableRow key={`allowance-${idxTR}`}>
              {row.getVisibleCells().map((cell, idxTD) => {
                let isExpired = false;
                const allowance = table.getRowModel().rows[idxTR].original;

                if (allowance?.expiration && idxTD <= 3) {
                  isExpired = isDateExpired(allowance?.expiration);
                }

                return (
                  <TableBodyCell key={`allowance-${idxTD}`} disabled={isExpired} className={colStyle(idxTD)}>
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
