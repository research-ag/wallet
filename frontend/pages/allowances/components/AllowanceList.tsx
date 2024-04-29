import { AllowancesTableColumns, TAllowance } from "@/@types/allowance";
import UpdateAllowanceDrawer from "@pages/allowances/components/UpdateAllowanceDrawer";
import DeleteAllowanceModal from "@pages/allowances/components/DeleteAllowanceModal";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useAppSelector } from "@redux/Store";
import { CustomCopy } from "@components/tooltip";
import { middleTruncation } from "@/utils/strings";
import { formatDateTime } from "@/utils/formatTime";
import { useTranslation } from "react-i18next";
import ActionCard from "./ActionCard";
import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";

interface AllowanceListProps {
  allowances: TAllowance[];
  handleSortChange: (column: AllowancesTableColumns) => Promise<void>;
  searchKey: string;
  setSearchKey: Dispatch<SetStateAction<string>>;
  selectedAssets: string[];
  setSelectedAssets: Dispatch<SetStateAction<string[]>>;
};

const columns = [
  "Sub-account",
  "Spender",
  "Amount",
  "Expiration",
  "Action"
];

export default function AllowanceList({ allowances, handleSortChange }: AllowanceListProps) {
  const { t } = useTranslation();
  const { assets } = useAppSelector((state) => state.asset);
  const { contacts } = useAppSelector((state) => state.contacts);

  return (
    <>
      <DeleteAllowanceModal />
      <UpdateAllowanceDrawer />
      <div className="dark:text-gray-color-6 text-black-color">

        <div className="flex border-b-2 dark:border-gray-color-1 border-gray-color-6">
          {columns.map((currentColumn, index) => (
            <div key={currentColumn} className={`flex items-center p-2 ${getCellWidth(index)}`}>
              <p className="text-left">{currentColumn}</p>
              <SortIcon className="w-3 h-3 ml-1 cursor-pointer dark:fill-gray-color-6 fill-black-color" onClick={() => handleSortChange(currentColumn as AllowancesTableColumns)} />
            </div>
          ))}
        </div>

        <div className="flex flex-col max-h-[calc(100vh-14rem)] scroll-y-light text-left ">
          {allowances.map((allowance) => {

            // Sub account
            const subAccountId = allowance.subAccountId;
            const assetToken = allowance.asset.tokenSymbol;
            const asset = assets.find((asset) => asset.tokenSymbol === assetToken);
            const subAccount = asset?.subAccounts.find((subAccount) => subAccount.sub_account_id === subAccountId);
            const subAccountName = subAccount?.name;

            // Spender
            const principal = allowance.spender;

            const spenderName = useMemo(() => {
              const contact = contacts.find((contact) => contact.principal === principal);
              return contact?.name ? contact.name : undefined;
            }, [contacts]);

            // Amount
            const hidden = !allowance?.expiration && allowance.amount === "0";
            const assetSymbol = assets.find((asset) => asset.tokenSymbol === allowance.asset.tokenSymbol)?.symbol;

            // Expiration
            const userDate = allowance?.expiration ? formatDateTime(allowance.expiration) : t("no.expiration");

            return (
              <div key={allowance.id} className="flex p-1 border-b dark:border-gray-color-1 border-gray-color-6">
                <div className={getCellWidth(0)}>
                  {subAccountName && <p className="text-md">{subAccountName || subAccountName}</p>}
                  {subAccountId && <p className="text-md">{subAccountId}</p>}
                </div>
                <div className={getCellWidth(1)}>
                  {spenderName && <p >{spenderName}</p>}
                  {principal && (
                    <div className="flex">
                      <p className="text-md">{middleTruncation(principal, 10, 10)}</p>
                      <CustomCopy size={"xSmall"} className="p-0 ml-1" copyText={principal} />
                    </div>
                  )}
                </div>
                <div className={getCellWidth(2)}>
                  <p className="text-md">
                    {hidden && "-"}
                    {!hidden && allowance.amount} {!hidden && assetSymbol}
                  </p>
                </div>
                <div className={getCellWidth(3)}>
                  <p className="text-md">{hidden ? "-" : userDate}</p>
                </div>
                <div className="flex items-center justify-center w-56">
                  <ActionCard allowance={allowance} />
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </>
  );
}

function getCellWidth(index: number) {
  switch (index) {
    case 0:
      return "w-full";
    case 1:
      return "w-full";
    case 2:
      return "w-full";
    case 3:
      return "w-full";
    case 4:
      return "";
    default:
      return "";
  }
};
