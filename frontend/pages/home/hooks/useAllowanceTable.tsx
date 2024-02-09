import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";
import { formatDateTime } from "@/utils/formatTime";
import { middleTruncation, toTitleCase } from "@/utils/strings";
import { createColumnHelper } from "@tanstack/react-table";
import { TAllowance, AllowancesTableColumnsEnum } from "@/@types/allowance";
import clsx from "clsx";
import { isDateExpired } from "@/utils/time";
import { useTranslation } from "react-i18next";
import ActionCard from "../components/ICRC/allowance/ActionCard";
import { useMemo } from "react";
import { useAppSelector } from "@redux/Store";

export default function useAllowanceTable() {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper<TAllowance>();
  const { contacts } = useAppSelector((state) => state.contacts);

  const columns = [
    columnHelper.accessor(AllowancesTableColumnsEnum.Values.subAccount, {
      cell: (info) => {
        const name = info?.getValue()?.name;
        const subAccountId = info?.getValue()?.sub_account_id;
        return (
          <div className="flex flex-col items-start justify-center cursor-pointer">
            {name && <p className={getCellStyles()}>{name}</p>}
            {subAccountId && <p className={getCellStyles(Boolean(name))}>{subAccountId}</p>}
          </div>
        );
      },
      header: ({ header }) => (
        <div className="flex items-center justify-center cursor-pointer">
          <p className={titleHeaderStyles}>{toTitleCase(header.id)}</p> <SortIcon className={sortIconStyles} />
        </div>
      ),
    }),
    columnHelper.accessor(AllowancesTableColumnsEnum.Values.spender, {
      cell: (info) => {
        const principal = info.getValue()?.principal;

        const spenderName = useMemo(() => {
          const contact = contacts.find((contact) => contact.principal === principal);
          return contact?.name ? contact.name : undefined;
        }, [contacts]);

        return (
          <div className="flex flex-col items-start justify-center cursor-pointer">
            {spenderName && <p className={getCellStyles()}>{spenderName}</p>}
            {principal && <p className={getCellStyles(Boolean(name))}>{middleTruncation(principal, 3, 3)}</p>}
          </div>
        );
      },
      header: ({ header }) => (
        <div className="flex items-center justify-center cursor-pointer">
          <p className={titleHeaderStyles}>{toTitleCase(header.id)}</p> <SortIcon className={sortIconStyles} />
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
          <p className={titleHeaderStyles}>{toTitleCase(header.id)}</p> <SortIcon className={sortIconStyles} />
        </div>
      ),
    }),
    columnHelper.accessor(AllowancesTableColumnsEnum.Values.expiration, {
      cell: (info) => {
        let isExpired = false;

        const userDate = info.getValue() ? formatDateTime(info.getValue() || "") : t("no.expiration");
        const allowance = info.row.original;

        if (!allowance.noExpire && allowance?.expiration) {
          isExpired = isDateExpired(allowance?.expiration);
        }

        return <p className={getCellStyles()}>{isExpired ? "-" : userDate}</p>;
      },
      header: ({ header }) => (
        <div className="flex items-center justify-center cursor-pointer">
          <p className={titleHeaderStyles}>{toTitleCase(header.id)}</p> <SortIcon className={sortIconStyles} />
        </div>
      ),
    }),
    columnHelper.display({
      id: AllowancesTableColumnsEnum.Values.action,
      cell: (info) => <ActionCard allowance={info.row.original} />,
      header: () => <p className={titleHeaderStyles}>{t("action")}</p>,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      enableGrouping: false,
    }),
  ];

  return { columns };
}

function getCellStyles(isOpacity = false) {
  return clsx(
    "text-md",
    isOpacity
      ? "text-PrimaryTextColorLight/50 dark:text-PrimaryTextColor/50"
      : "text-PrimaryTextColorLight dark:text-PrimaryTextColor",
  );
}

const sortIconStyles = "w-3 h-3 ml-2 fill-PrimaryTextColorLight/50 dark:fill-PrimaryTextColor/50";
const titleHeaderStyles = "text-md font-normal";
