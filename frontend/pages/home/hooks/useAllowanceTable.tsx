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
        return (
          <div>
            <p>{info.getValue()?.name || "-"}</p>
            <p>{info.getValue()?.sub_account_id || "-"}</p>
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
            <p>{name || (principal ? principal : "-") || "-"}</p>
            {name || principal ? <p>{middleTruncation(principal, 3, 3) || "-"}</p> : null}
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
      cell: () => <ActionCard onDrawerOpen={onDrawerOpen} />,
      header: () => "Action",
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      enableGrouping: false,
    }),
  ];

  return { columns };
};
