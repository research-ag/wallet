import useAllowances from "@pages/home/hooks/useAllowances";
import EditAllowanceDrawer from "./EditAllowanceDrawer";
import clsx from "clsx";
import { useAllowanceTable } from "@pages/home/hooks/useAllowanceTable";
import { Table, TableBody, TableBodyCell, TableHead, TableHeaderCell, TableRow } from "@components/table";
import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel } from "@tanstack/react-table";
import { useAppSelector } from "@redux/Store";
import { EditActionType, setEditAllowanceDrawerState } from "@redux/allowances/AllowanceActions";
import { AllowancesTableColumns } from "@/@types/allowance";

export default function AllowanceList() {
  const { isUpdateAllowance } = useAppSelector((state) => state.allowance);
  const { allowances, setSorting } = useAllowances();
  const { columns } = useAllowanceTable();

  const table = useReactTable({
    data: allowances,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <EditAllowanceDrawer
        isDrawerOpen={isUpdateAllowance}
        onClose={() => setEditAllowanceDrawerState(EditActionType.closeDrawer)}
      />
      <Table>
        <TableHeadGroup />
        <TableBodyGroup />
      </Table>
    </>
  );

  function TableHeadGroup() {
    const handleFilter = async (column: AllowancesTableColumns) => {
      setSorting(column);
    };

    return (
      <TableHead>
        {table.getHeaderGroups().map((headerGroup, indexTH) => (
          <TableRow key={`allowance-${indexTH}`} className="border-b border-opacity-50 border-BorderColor">
            {headerGroup.headers.map((header, indexTR) => {
              const column = header.column.id;
              return (
                <TableHeaderCell key={`allowance-${indexTR}`} className={colStyle(indexTR)}>
                  <div
                    {...{
                      className: indexTR <= 4 && header.column.getCanSort() ? "cursor-pointer select-none" : "",
                      onClick: indexTR <= 4 ? () => handleFilter(column as AllowancesTableColumns) : undefined,
                    }}
                    className="flex opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {indexTR <= 4 && header.column.getCanSort() && (
                      <div className="relative flex top-1.5 cursor-pointer">
                        <SortIcon className="w-3 h-3 ml-2 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor" />
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
