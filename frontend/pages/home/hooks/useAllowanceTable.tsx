import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";
import { momentDateTime } from "@/utils/formatTime";
import { middleTruncation, toTitleCase } from "@/utils/strings";
import { createColumnHelper } from "@tanstack/react-table";
import { Allowance, AllowancesTableColumns } from "@/@types/allowance";
import ActionCard from "../components/allowance/ActionCard";
import { queryClient } from "@/config/query";
import { ServerStateKeys } from "@/@types/common";
import clsx from "clsx";

export const useAllowanceTable = () => {
  const columnHelper = createColumnHelper<Allowance>();

  const refetchAllowances = async () => {
    await queryClient.invalidateQueries({
      queryKey: [ServerStateKeys.allowances],
    });
    await queryClient.refetchQueries({
      queryKey: [ServerStateKeys.allowances],
    });
  };

  const columns = [
    columnHelper.accessor(AllowancesTableColumns.subAccount, {
      cell: (info) => {
        const name = info?.getValue()?.name;
        const subAccountId = info?.getValue()?.sub_account_id;
        return (
          <div>
            {name && <p className={getCellStyles()}>{name}</p>}
            {subAccountId && <p className={getCellStyles()}>{subAccountId}</p>}
          </div>
        );
      },
      header: ({ header }) => (
        <div className="flex items-center justify-center cursor-pointer">
          <p>{toTitleCase(header.id)}</p>{" "}
          <SortIcon className="w-3 h-3 ml-2 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor" />
        </div>
      ),
    }),
    columnHelper.accessor(AllowancesTableColumns.spender, {
      cell: (info) => {
        const name = info.getValue()?.name;
        const principal = info.getValue()?.principal;
        return (
          <div>
            {name && <p className={getCellStyles()}>{name}</p>}
            {principal && <p className={getCellStyles()}>{middleTruncation(principal, 3, 3)}</p>}
          </div>
        );
      },
      header: ({ header }) => (
        <div className="flex items-center justify-center cursor-pointer">
          <p>{toTitleCase(header.id)}</p>{" "}
          <SortIcon className="w-3 h-3 ml-2 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor" />
        </div>
      ),
    }),
    columnHelper.accessor(AllowancesTableColumns.amount, {
      cell: (info) => {
        const assetSymbol = info.row.original.asset.tokenSymbol;
        return (
          <p className={getCellStyles()}>
            {info.getValue()} {assetSymbol}
          </p>
        );
      },
      header: ({ header }) => (
        <div className="flex items-center justify-center cursor-pointer">
          <p>{toTitleCase(header.id)}</p>{" "}
          <SortIcon className="w-3 h-3 ml-2 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor" />
        </div>
      ),
    }),
    columnHelper.accessor(AllowancesTableColumns.expiration, {
      cell: (info) => (
        <p className={getCellStyles()}>{info.getValue() ? momentDateTime(info.getValue()) : "No expire"}</p>
      ),
      header: ({ header }) => (
        <div className="flex items-center justify-center cursor-pointer">
          <p>{toTitleCase(header.id)}</p>{" "}
          <SortIcon className="w-3 h-3 ml-2 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor" />
        </div>
      ),
    }),
    columnHelper.display({
      id: AllowancesTableColumns.action,
      cell: (info) => <ActionCard allowance={info.row.original} refetchAllowances={refetchAllowances} />,
      header: () => "Action",
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      enableGrouping: false,
    }),
  ];

  return { columns };
};

const getCellStyles = (isOpacity = false) =>
  clsx("text-PrimaryTextColorLight dark:text-PrimaryTextColor", isOpacity ? "opacity-50" : "");
