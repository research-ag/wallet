import { CustomButton } from "@components/button";
import { TabOption } from ".";
import { useAppSelector } from "@redux/Store";

interface TablesTabProps {
  toggle: () => void;
  allowanceTabAllowed: boolean;
  openTab: TabOption;
}

export default function TablesTab({ toggle, allowanceTabAllowed, openTab }: TablesTabProps) {
  const { transactions } = useAppSelector((state) => state.transaction.list);
  const { allowances } = useAppSelector((state) => state.allowance.list);

  const transactionsCount = transactions.length;
  const allowancesCount = allowances.length;

  return (
    <div className="flex items-center justify-start w-full">
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
          Transactions ({transactionsCount})
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
            Allowances ({allowancesCount})
          </p>
        </CustomButton>
      )}
    </div>
  );
}
