import { ReactComponent as PlusIcon } from "@assets/svg/files/plus-icon.svg";
import { DetailsTabs } from "@/const";
import AddAllowanceDrawer from "./allowance/AddAllowanceDrawer";
import { useAppSelector } from "@redux/Store";
import { IconButton } from "@components/buttons";
import { CreateActionType, setCreateAllowanceDrawerState } from "@redux/allowances/AllowanceActions";
import clsx from "clsx";
import { useMemo } from "react";
import useAllowances from "../hooks/useAllowances";

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

  return (
    <div className="flex items-center justify-between w-full">
      <AddAllowanceDrawer
        isDrawerOpen={isCreateAllowance}
        onClose={() => setCreateAllowanceDrawerState(CreateActionType.closeDrawer)}
      />

      <div className="flex items-center justify-between columns-2">
        <button onClick={() => setActiveTab(DetailsTabs.transactions)}>
          <p className={getTabStyles(activeTab, DetailsTabs.transactions)}>Transactions ({transactionsCount})</p>
        </button>

        <button onClick={() => setActiveTab(DetailsTabs.allowances)}>
          <p className={getTabStyles(activeTab, DetailsTabs.allowances)}>Allowances ({allowancesCount})</p>
        </button>
      </div>
      <div className="flex items-center justify-between columns-2">
        {DetailsTabs.allowances === activeTab && (
          <>
            <p className="mx-2 text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">Add allowance</p>
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
