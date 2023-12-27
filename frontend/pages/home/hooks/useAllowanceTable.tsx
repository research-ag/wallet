import { momentDateTime } from "@/utils/formatTime";
import { middleTruncation, toTitleCase } from "@/utils/strings";
import { createColumnHelper } from "@tanstack/react-table";
import { Allowance } from "@/@types/allowance";
import ActionCard from "../components/allowance/ActionCard";

type TOnDrawerOpen = () => void;

export const useAllowanceTable = (onDrawerOpen: TOnDrawerOpen) => {
  const columnHelper = createColumnHelper<Allowance>();

  const columns = [
    columnHelper.accessor("subAccount", {
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
    columnHelper.accessor("spender", {
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
    columnHelper.accessor("amount", {
      cell: (info) => {
        const assetSymbol = info.row.original.asset.tokenSymbol;
        return `${info.getValue()} ${assetSymbol}`;
      },
      header: ({ header }) => toTitleCase(header.id),
    }),
    columnHelper.accessor("expiration", {
      cell: (info) => momentDateTime(info.getValue()),
      header: ({ header }) => toTitleCase(header.id),
    }),
    columnHelper.display({
      id: "action",
      cell: (info) => <ActionCard onDrawerOpen={onDrawerOpen} allowance={info.row.original} />,
      header: () => "Action",
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      enableGrouping: false,
    }),
  ];

  return { columns };
};
