// svgs
import ArrowBottomLeftIcon from "@assets/svg/files/arrow-bottom-left-icon.svg";
import ArrowTopRightIcon from "@assets/svg/files/arrow-top-right-icon.svg";
import WrapIcon from "@assets/svg/files/wrap-icon.svg";
//
import { Fragment } from "react";
import DrawerSend from "./DrawerSend";
import DrawerWrap from "./DrawerWrap";
import DrawerReceive from "./DrawerReceive";
import DrawerAction from "./DrawerAction";
import { getCoreRowModel, useReactTable, flexRender, getSortedRowModel } from "@tanstack/react-table";
import { t } from "i18next";
import DrawerTransaction from "./Transaction";
import { GeneralHook } from "../hooks/generalHook";
import { DrawerHook } from "../hooks/drawerHook";
import { TableHook } from "@pages/hooks/tableHook";
import { UseTransaction } from "../hooks/useTransaction";
import { DrawerOption, DrawerOptionEnum, IconTypeEnum } from "@/const";
import { toFullDecimal } from "@/utils";
import clsx from "clsx";

const DetailList = () => {
  const { transactions, getAssetIcon, selectedAsset, selectedAccount } = GeneralHook();
  const { drawerOption, setDrawerOption, drawerOpen, setDrawerOpen } = DrawerHook();

  const { columns, sorting, setSorting } = TableHook();
  const { selectedTransaction, changeSelectedTransaction } = UseTransaction();
  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Fragment>
      <div
        className={
          "relative flex flex-col justify-start items-center bg-SecondaryColorLight dark:bg-SecondaryColor w-full pt-6 pr-9 pl-7 gap-2 h-fit min-h-full"
        }
      >
        <div className="flex flex-row justify-between items-center w-full h-[4.75rem] bg-TransactionHeaderColorLight dark:bg-TransactionHeaderColor rounded-md">
          <div className="flex flex-col justify-center items-start bg-[#33b2ef] w-[17rem] h-full rounded-l-md p-4 text-[#ffff]">
            <div className="flex flex-row justify-between items-center gap-1 w-full">
              {getAssetIcon(IconTypeEnum.Enum.HEADER, selectedAsset?.tokenSymbol, selectedAsset?.logo)}
              <div className="flex flex-col justify-center items-end">
                <p className="font-semibold text-[1.15rem] text-right">{`${toFullDecimal(
                  selectedAccount?.amount || "0",
                  selectedAccount?.decimal || "8",
                )} ${selectedAsset?.symbol}`}</p>
                <p className="font-semibold text-md">{`$${selectedAccount?.currency_amount}`}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-around items-center h-full w-[calc(100%-17rem)] text-ThirdTextColorLight dark:text-ThirdTextColor">
            <div className="flex flex-col justify-center items-center w-1/3 gap-1">
              <div
                className="flex flex-row justify-center items-center w-7 h-7 bg-[#33b2ef] rounded-md cursor-pointer"
                onClick={() => {
                  setDrawer(DrawerOptionEnum.Enum.SEND);
                }}
              >
                <img src={ArrowTopRightIcon} className="w-3 h-3" alt="send-icon" />
              </div>
              <p className="text-md">{t("send")}</p>
            </div>
            <div className="flex flex-col justify-center items-center w-1/3 gap-1">
              <div
                className="flex flex-row justify-center items-center w-7 h-7 bg-[#33b2ef] rounded-md cursor-pointer"
                onClick={() => {
                  setDrawer(DrawerOptionEnum.Enum.RECEIVE);
                }}
              >
                <img src={ArrowBottomLeftIcon} className="w-3 h-3" alt="receive-icon" />
              </div>
              <p className="text-md">{t("receive")}</p>
            </div>
          </div>
        </div>

        <div className="w-full max-h-[calc(100vh-11.25rem)] scroll-y-light">
          <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
            <thead className="border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SecondaryColorLight dark:bg-SecondaryColor sticky top-0 z-[1]">
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
                    changeSelectedTransaction(row.original);
                    setDrawerOpen(true);
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
      </div>
      <div
        id="right-drower"
        className={`h-[calc(100%-4.5rem)] fixed z-[999] top-4.5rem w-[28rem] overflow-x-hidden transition-{right} duration-500 ${
          drawerOpen ? "!right-0" : "right-[-30rem]"
        }`}
      >
        {selectedTransaction ? (
          <DrawerTransaction setDrawerOpen={setDrawerOpen} />
        ) : (
          <div className="flex flex-col justify-start items-center bg-PrimaryColorLight dark:bg-PrimaryColor gap-5 w-full h-full pt-8 px-6">
            <DrawerAction drawerOption={drawerOption} setDrawerOption={setDrawerOption} setDrawerOpen={setDrawerOpen}>
              {drawerOption === DrawerOptionEnum.Enum.SEND && (
                <DrawerSend drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
              )}
              {drawerOption === DrawerOptionEnum.Enum.RECEIVE && <DrawerReceive />}
              {drawerOption === DrawerOptionEnum.Enum.WRAP && <DrawerWrap />}
            </DrawerAction>
          </div>
        )}
      </div>
    </Fragment>
  );

  function setDrawer(drawer: DrawerOption) {
    setDrawerOption(drawer);
    setTimeout(() => {
      setDrawerOpen(true);
    }, 150);
  }
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

export default DetailList;
