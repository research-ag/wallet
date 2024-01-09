import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";
import { formatDateTime } from "@/utils/formatTime";
import { middleTruncation, toTitleCase } from "@/utils/strings";
import { createColumnHelper } from "@tanstack/react-table";
import { TAllowance, AllowancesTableColumnsEnum } from "@/@types/allowance";
import ActionCard from "../components/allowance/ActionCard";
import { queryClient } from "@/config/query";
import { ServerStateKeysEnum } from "@/@types/common";
import clsx from "clsx";
import { isDateExpired } from "@/utils/time";
import { useTranslation } from "react-i18next";

export const useAllowanceTable = () => {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper<TAllowance>();

  const refetchAllowances = async () => {
    await queryClient.invalidateQueries({
      queryKey: [ServerStateKeysEnum.Values.allowances],
    });
    await queryClient.refetchQueries({
      queryKey: [ServerStateKeysEnum.Values.allowances],
    });
  };

  const columns = [
    columnHelper.accessor(AllowancesTableColumnsEnum.Values.subAccount, {
      cell: (info) => {
        const name = info?.getValue()?.name;
        const subAccountId = info?.getValue()?.sub_account_id;
        return (
          <div>
            {name && <p className={getCellStyles()}>{name}</p>}
            {subAccountId && <p className={getCellStyles(Boolean(name))}>{subAccountId}</p>}
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
    columnHelper.accessor(AllowancesTableColumnsEnum.Values.spender, {
      cell: (info) => {
        const name = info.getValue()?.name;
        const principal = info.getValue()?.principal;
        return (
          <div>
            {name && <p className={getCellStyles()}>{name}</p>}
            {principal && <p className={getCellStyles(Boolean(name))}>{middleTruncation(principal, 3, 3)}</p>}
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
    columnHelper.accessor(AllowancesTableColumnsEnum.Values.amount, {
      cell: (info) => {
        let isExpired = false;
        const allowance = info.row.original;

        if (!allowance.noExpire && allowance?.expiration) {
          isExpired = isDateExpired(allowance?.expiration);
        }

        const assetSymbol = info.row.original.asset.tokenSymbol;

        return (
          <p className={getCellStyles()}>
            {isExpired && "-"}
            {!isExpired && info.getValue()} {!isExpired && assetSymbol}
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
    columnHelper.accessor(AllowancesTableColumnsEnum.Values.expiration, {
      cell: (info) => {
        let isExpired = false;

        const userDate = info.getValue() ? formatDateTime(info.getValue() || "") : "No expiration";
        const allowance = info.row.original;

        if (!allowance.noExpire && allowance?.expiration) {
          isExpired = isDateExpired(allowance?.expiration);
        }

        return <p className={getCellStyles()}>{isExpired ? "-" : userDate}</p>;
      },
      header: ({ header }) => (
        <div className="flex items-center justify-center cursor-pointer">
          <p>{toTitleCase(header.id)}</p>{" "}
          <SortIcon className="w-3 h-3 ml-2 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor" />
        </div>
      ),
    }),
    columnHelper.display({
      id: AllowancesTableColumnsEnum.Values.action,
      cell: (info) => <ActionCard allowance={info.row.original} refetchAllowances={refetchAllowances} />,
      header: () => t("action"),
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      enableGrouping: false,
    }),
  ];

  return { columns };
};

const getCellStyles = (isOpacity = false) =>
  clsx("text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md", isOpacity ? "opacity-50" : "");
