import { CustomButton, IconButton } from "@components/button";
import { TabOption } from ".";
import { useAppSelector } from "@redux/Store";
import { PlusIcon } from "@radix-ui/react-icons";
import useAllowanceDrawer from "@pages/allowances/hooks/useAllowanceDrawer";
import AddAllowanceDrawer from "@pages/allowances/components/AddAllowanceDrawer";
import { useTranslation } from "react-i18next";

interface TablesTabProps {
  toggle: () => void;
  allowanceTabAllowed: boolean;
  openTab: TabOption;
}

export default function TablesTab({ toggle, allowanceTabAllowed, openTab }: TablesTabProps) {
  const { t } = useTranslation();
  const { watchOnlyMode } = useAppSelector((state) => state.auth);
  const { onOpenCreateAllowanceDrawer } = useAllowanceDrawer();
  const { transactions } = useAppSelector((state) => state.transaction.list);
  const { allowances } = useAppSelector((state) => state.allowance.list);
  const { selectedAccount, selectedAsset } = useAppSelector((state) => state.asset.helper);

  const transactionsCount = transactions.reduce((acc, curr) => acc + curr.length, 0);
  const allowancesCount = allowances.filter(
    (allowance) =>
      allowance.subAccountId === selectedAccount?.sub_account_id &&
      allowance.asset.tokenSymbol === selectedAsset?.tokenSymbol,
  ).length;

  return (
    <div className="flex items-center justify-between w-full">
      <AddAllowanceDrawer />
      <div className="flex items-center justify-start">
        <CustomButton
          size={"small"}
          intent={"noBG"}
          border={"underline"}
          className="flex items-center justify-start mt-2"
          onClick={toggle}
        >
          <p
            className={`!font-normal  mr-2 ${
              openTab !== TabOption.TRANSACTIONS
                ? " text-PrimaryTextColorLight/60 dark:text-PrimaryTextColor/60"
                : "border-b border-SelectRowColor"
            }`}
          >
            {t("transaction.transactions")} ({transactionsCount})
          </p>
        </CustomButton>
        {allowanceTabAllowed && (
          <CustomButton
            size={"small"}
            intent={"noBG"}
            border={"underline"}
            className="flex items-center justify-start mt-2"
            onClick={toggle}
          >
            <p
              className={`!font-normal  mr-2 ${
                openTab !== TabOption.ALLOWANCES
                  ? " text-PrimaryTextColorLight/60 dark:text-PrimaryTextColor/60"
                  : "border-b border-SelectRowColor"
              }`}
            >
              {t("allowance.allowances")} ({allowancesCount})
            </p>
          </CustomButton>
        )}
      </div>

      {!watchOnlyMode && openTab !== TabOption.TRANSACTIONS && (
        <IconButton
          icon={<PlusIcon className="w-6 h-6" />}
          size="small"
          className="ml-2"
          onClick={onOpenCreateAllowanceDrawer}
        />
      )}
    </div>
  );
}
