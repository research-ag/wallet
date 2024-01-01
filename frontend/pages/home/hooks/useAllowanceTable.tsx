import { momentDateTime } from "@/utils/formatTime";
import { middleTruncation, toTitleCase } from "@/utils/strings";
import { createColumnHelper } from "@tanstack/react-table";
import { Allowance, AllowancesTableColumns } from "@/@types/allowance";
import ActionCard from "../components/allowance/ActionCard";

interface IUseAllowanceTable {
  refetchAllowances: () => void;
}

export const useAllowanceTable = ({ refetchAllowances }: IUseAllowanceTable) => {
  const columnHelper = createColumnHelper<Allowance>();

  const columns = [
    columnHelper.accessor(AllowancesTableColumns.subAccount, {
      cell: (info) => {
        const name = info?.getValue()?.name;
        const subAccountId = info?.getValue()?.sub_account_id;
        return (
          <div>
            {name && <p className="text-md">{name}</p>}
            {subAccountId && <p className="text-md">{subAccountId}</p>}
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
            {name && <p className="text-md">{name}</p>}
            {principal && <p className="text-md">{middleTruncation(principal, 3, 3)}</p>}
          </div>
        );
      },
      header: ({ header }) => toTitleCase(header.id),
    }),
    columnHelper.accessor(AllowancesTableColumns.amount, {
      cell: (info) => {
        const assetSymbol = info.row.original.asset.tokenSymbol;
        return `${info.getValue()} ${assetSymbol}`;
      },
      header: ({ header }) => toTitleCase(header.id),
    }),
    columnHelper.accessor(AllowancesTableColumns.expiration, {
      cell: (info) => momentDateTime(info.getValue()),
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
