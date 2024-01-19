import { AllowancesTableColumns, AllowancesTableColumnsEnum } from "@/@types/allowance";
import { SortOrder, SortOrderEnum } from "@/@types/common";
import { useAppSelector } from "@redux/Store";
import { useMemo, useState } from "react";
import {
  filterByAmount,
  filterByAsset,
  filterBySpender,
  sortByExpiration,
  sortBySubAccount,
} from "@/utils/allowanceSorters";

export default function useAllowances() {
  const { allowances: rawAllowances } = useAppSelector((state) => state.allowance);
  const [sorting, setSorting] = useState<SortOrder>(SortOrderEnum.Values.ASC);
  const [column, setColumn] = useState<AllowancesTableColumns>(AllowancesTableColumnsEnum.Values.subAccount);

  const { selectedAsset } = useAppSelector((state) => state.asset);

  const onSort = async (orderColumn: AllowancesTableColumns) => {
    if (orderColumn === column) {
      setSorting(sorting === SortOrderEnum.Values.ASC ? SortOrderEnum.Values.DESC : SortOrderEnum.Values.ASC);
    }

    if (orderColumn !== column) {
      setColumn(orderColumn);
      setSorting(SortOrderEnum.Values.ASC);
    }
  };

  const allowances = useMemo(() => {
    const filtered = selectedAsset?.tokenSymbol
      ? filterByAsset(selectedAsset?.tokenSymbol, rawAllowances)
      : rawAllowances;

    if (column === AllowancesTableColumnsEnum.Values.subAccount) {
      return sortBySubAccount(sorting, filtered || []);
    }

    if (column === AllowancesTableColumnsEnum.Values.spender) {
      return filterBySpender(sorting, filtered || []);
    }

    if (column === AllowancesTableColumnsEnum.Values.expiration) {
      return sortByExpiration(sorting, filtered || []);
    }

    if (column === AllowancesTableColumnsEnum.Values.amount) {
      return filterByAmount(sorting, filtered || []);
    }


    return [];
  }, [rawAllowances, sorting, column]);

  return {
    allowances,
    sorting,
    column,
    setSorting,
    handleSortChange: onSort,
  };
}
