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
      header: ({ header }) => toTitleCase(header.id),
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
      header: ({ header }) => toTitleCase(header.id),
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
      header: ({ header }) => toTitleCase(header.id),
    }),
    columnHelper.accessor(AllowancesTableColumns.expiration, {
      cell: (info) => (
        <p className={getCellStyles()}>{info.getValue() ? momentDateTime(info.getValue()) : "No expire"}</p>
      ),
      header: ({ header }) => toTitleCase(header.id),
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
