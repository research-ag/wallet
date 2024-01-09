import { ReactComponent as PlusIcon } from "@assets/svg/files/plus-icon.svg";
import AddAllowanceDrawer from "./allowance/AddAllowanceDrawer";
import { useAppSelector } from "@redux/Store";
import { IconButton } from "@components/buttons";
import { CreateActionType, setCreateAllowanceDrawerState } from "@redux/allowances/AllowanceActions";
import clsx from "clsx";
import { useMemo } from "react";
import useAllowances from "../hooks/useAllowances";
import { DetailsTabs, DetailsTabsEnum } from "@/@types/common";
import { useTranslation } from "react-i18next";

interface Props {
  activeTab: DetailsTabs;
  setActiveTab: (tab: DetailsTabs) => void;
}

export default function DetailTab({ activeTab, setActiveTab }: Props) {
  const { isCreateAllowance } = useAppSelector((state) => state.allowance);
  const { transactions } = useAppSelector((state) => state.asset);
  const { allowances } = useAllowances();
  const transactionsCount = useMemo(() => transactions.length, [transactions]);
  const allowancesCount = useMemo(() => allowances.length, [allowances]);
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between w-full">
      <AddAllowanceDrawer
        isDrawerOpen={isCreateAllowance}
        onClose={() => setCreateAllowanceDrawerState(CreateActionType.closeDrawer)}
      />

      <div className="flex items-center justify-between columns-2">
        <button onClick={() => setActiveTab(DetailsTabsEnum.Values.TRANSACTIONS)}>
          <p className={getTabStyles(activeTab, DetailsTabsEnum.Values.TRANSACTIONS)}>
            {t("transaction.transactions")} ({transactionsCount})
          </p>
        </button>

        <button onClick={() => setActiveTab(DetailsTabsEnum.Values.ALLOWANCES)}>
          <p className={getTabStyles(activeTab, DetailsTabsEnum.Values.ALLOWANCES)}>
            {t("allowance.allowances")} ({allowancesCount})
          </p>
        </button>
      </div>
      <div className="flex items-center justify-between columns-2">
        {DetailsTabsEnum.Values.ALLOWANCES === activeTab && (
          <>
            <p className="mx-2 text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              {t("allowance.add.allowance")}
            </p>
            <IconButton
              icon={<PlusIcon />}
              onClick={() => setCreateAllowanceDrawerState(CreateActionType.openDrawer)}
            />
          </>
        )}
      </div>
    </div>
  );
}

const getTabStyles = (activeTab: DetailsTabs, validatorTab: DetailsTabs) =>
  clsx(
    "text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor",
    activeTab === validatorTab && "border-b-2 border-acceptButtonColor font-semibold text-RadioCheckColor",
  );
