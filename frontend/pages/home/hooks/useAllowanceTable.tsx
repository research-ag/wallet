import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";
import { formatDateTime } from "@/utils/formatTime";
import { middleTruncation, toTitleCase } from "@/utils/strings";
import { createColumnHelper } from "@tanstack/react-table";
import { TAllowance, AllowancesTableColumnsEnum } from "@/@types/allowance";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import ActionCard from "../components/ICRC/allowance/ActionCard";
import { useMemo } from "react";
import { useAppSelector } from "@redux/Store";
import { CustomCopy } from "@components/tooltip";

export default function useAllowanceTable() {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper<TAllowance>();
  const { contacts } = useAppSelector((state) => state.contacts);
  const { assets } = useAppSelector((state) => state.asset);

  const columns = [
    columnHelper.accessor(AllowancesTableColumnsEnum.Values.subAccountId, {
      cell: (info) => {
        const subAccountId = info?.getValue();
        const assetToken = info.row.original.asset.tokenSymbol;
        const asset = assets.find((asset) => asset.tokenSymbol === assetToken);
        const subAccount = asset?.subAccounts.find((subAccount) => subAccount.sub_account_id === subAccountId);
        const subAccountName = subAccount?.name;

        return (
          <div className="flex flex-col items-start justify-center cursor-pointer">
            {subAccountName && <p className={getCellStyles()}>{subAccountName || subAccountName}</p>}
            {subAccountId && <p className={getCellStyles(Boolean(subAccountId))}>{subAccountId}</p>}
          </div>
        );
      },
      header: () => (
        <div className="flex items-center justify-center cursor-pointer">
          <p className={titleHeaderStyles}>{t("subAccount")}</p> <SortIcon className={sortIconStyles} />
        </div>
      ),
    }),
    columnHelper.accessor(AllowancesTableColumnsEnum.Values.spender, {
      cell: (info) => {
        const principal = info.getValue();

        const spenderName = useMemo(() => {
          const contact = contacts.find((contact) => contact.principal === principal);
          return contact?.name ? contact.name : undefined;
        }, [contacts]);

        return (
          <div className="flex flex-col items-start justify-center cursor-pointer">
            {spenderName && <p className={getCellStyles()}>{spenderName}</p>}
            {principal && (
              <div className="flex">
                <p className={getCellStyles(Boolean(name))}>{middleTruncation(principal, 3, 3)}</p>
                <CustomCopy size={"xSmall"} className="p-0 ml-1" copyText={principal} />
              </div>
            )}
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
        const allowance = info.row.original;
        const hidden = !allowance?.expiration && allowance.amount === "0";
        const assetSymbol = info.row.original.asset.tokenSymbol;

        return (
          <p className={getCellStyles()}>
            {hidden && "-"}
            {(!hidden && info.getValue()) || "0"} {!hidden && assetSymbol}
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
        const allowance = info.row.original;
        const hidden = !allowance?.expiration && allowance.amount === "0";
        const userDate = info.getValue() ? formatDateTime(info.getValue() || "") : t("no.expiration");

        return <p className={getCellStyles()}>{hidden ? "-" : userDate}</p>;
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
