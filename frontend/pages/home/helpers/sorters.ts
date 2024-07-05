import { Transaction } from "@redux/models/AccountModels";
import { SortOrderEnum } from "@pages/home/components/ICRC/transaction/TransactionsScroll";
import dayjs from "dayjs";

export const sortByDate = (direction: SortOrderEnum, transactions: Transaction[] = []): Transaction[] => {
  const sorted = [...transactions].sort((a, b) => {
    const aDate = a.timestamp || "";
    const bDate = b.timestamp || "";
    const comparisonResult = dayjs(aDate).unix() - dayjs(bDate).unix();
    return direction === SortOrderEnum.ASC ? comparisonResult : -comparisonResult;
  });

  return [...sorted];
};
