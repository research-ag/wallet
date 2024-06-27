import { AllowancesTableColumns, TAllowance } from "@/@types/allowance";
import UpdateAllowanceDrawer from "@pages/allowances/components/UpdateAllowanceDrawer";
import DeleteAllowanceModal from "@pages/allowances/components/DeleteAllowanceModal";
import { useAppSelector } from "@redux/Store";
import { CustomCopy } from "@components/tooltip";
import { middleTruncation } from "@/common/utils/strings";
import { formatDateTime } from "@/common/utils/datetimeFormaters";
import { useTranslation } from "react-i18next";
import ActionCard from "./ActionCard";
import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";
import { getAssetIcon } from "@/common/utils/icons";
import { IconTypeEnum } from "@/common/const";
import clsx from "clsx";

interface AllowanceListProps {
  allowances: TAllowance[];
  handleSortChange: (column: AllowancesTableColumns) => Promise<void>;
}

const columns = ["subAccount", "spender", "amount", "expiration", "action"];

export default function AllowanceList({ allowances, handleSortChange }: AllowanceListProps) {
  const { t } = useTranslation();
  const { assets } = useAppSelector((state) => state.asset.list);
  const { contacts } = useAppSelector((state) => state.contacts);
  const { isAppDataFreshing } = useAppSelector((state) => state.common);

  return (
    <div className="w-full max-h-[calc(100vh-13rem)] scroll-y-light mt-4">
      <UpdateAllowanceDrawer />
      <DeleteAllowanceModal />
      <table className="relative w-full text-black-color dark:text-gray-color-9">
        <thead className={headerStyles}>
          <tr>
            {columns.map((currentColumn, index) => (
              <th key={currentColumn}>
                <div className={`flex items-center px-1 py-2 ${justifyCell(index)}`}>
                  <p>{t(currentColumn)}</p>
                  {currentColumn !== columns[columns.length - 1] && (
                    <SortIcon
                      className="w-3 h-3 ml-1 cursor-pointer dark:fill-gray-color-6 fill-black-color"
                      onClick={() =>
                        handleSortChange(
                          currentColumn === "subAccount"
                            ? ("subAccountId" as AllowancesTableColumns)
                            : (currentColumn as AllowancesTableColumns),
                        )
                      }
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={bodyStyles}>
          {allowances.map((allowance) => {
            // Sub account
            const subAccountId = allowance.subAccountId;
            const assetToken = allowance.asset.tokenSymbol;
            const asset = assets.find((asset) => asset.tokenSymbol === assetToken);
            const subAccount = asset?.subAccounts.find((subAccount) => subAccount.sub_account_id === subAccountId);
            const subAccountName = subAccount?.name;

            // Spender
            const principal = allowance.spender;
            const spenderName = contacts.find((contact) => contact.principal === principal)?.name;

            // Amount
            const hidden = !allowance?.expiration && allowance.amount === "0";
            const amount = isAppDataFreshing && !allowance?.amount ? "0" : allowance.amount;
            const assetSymbol = assets.find((asset) => asset.tokenSymbol === allowance.asset.tokenSymbol)?.symbol;

            // Expiration
            const userDate = allowance?.expiration ? formatDateTime(allowance.expiration) : t("no.expiration");

            return (
              <tr key={allowance.id}>
                <td className="flex flex-col items-start justify-start ">
                  <div className="flex items-center justify-center">
                    {getAssetIcon(IconTypeEnum.Enum.ALLOWANCE, asset?.tokenSymbol, asset?.logo)}
                    <div className="mt-2 ml-2">
                      {subAccountName && <p>{subAccountName || subAccountName}</p>}
                      {subAccountId && (
                        <p className="text-sm dark:text-gray-color-4 text-gray-color-5">{subAccountId}</p>
                      )}
                    </div>
                  </div>
                  <p className="ml-1 text-center text-md">{asset?.symbol || "-"}</p>
                </td>
                <td className="py-1">
                  {spenderName && <p>{spenderName}</p>}
                  {principal && (
                    <div className="flex">
                      <p className="mr-2 dark:text-gray-color-4 text-gray-color-5">
                        {middleTruncation(principal, 10, 10)}
                      </p>
                      <CustomCopy size={"xSmall"} copyText={principal} />
                    </div>
                  )}
                </td>
                <td className="py-1">
                  <p>
                    {hidden && "-"}
                    {!hidden && amount} {!hidden && assetSymbol}
                  </p>
                </td>
                <td className="py-1">
                  <p>{hidden ? "-" : userDate}</p>
                </td>
                <td className="flex justify-end mr-4">
                  <ActionCard allowance={allowance} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function justifyCell(index: number) {
  switch (index) {
    case 0:
      return "justify-start";
    case 1:
      return "justify-start";
    case 2:
      return "justify-start";
    case 3:
      return "justify-start";
    case 4:
      return "justify-end";
    default:
      return "";
  }
}

const headerStyles = clsx(
  "sticky top-0",
  "border-b dark:border-gray-color-1 border-gray-color-6",
  "font-bold text-left text-md text-black-color dark:text-gray-color-6 bg-white dark:bg-level-2-color",
);

const bodyStyles = clsx(
  "text-md text-left text-black-color dark:text-gray-color-6",
  "bg-white dark:bg-level-2-color dark:bg-level-2-color",
  "divide-y dark:divide-gray-color-1 divide-gray-color-6"
);
