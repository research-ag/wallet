import { AllowancesTableColumns, AllowancesTableColumnsEnum } from "@/@types/allowance";
import { SortOrder, SortOrderEnum } from "@/@types/common";
import { useAppSelector } from "@redux/Store";
import { useMemo, useState } from "react";
import { filterByAsset, filterBySpenderAndSubAccount } from "../helpers/filters";
import { sortByAmount, sortByExpiration, sortBySpender, sortBySubAccount } from "../helpers/sorters";

export default function useAllowances() {
  const { allowances: rawAllowances } = useAppSelector((state) => state.allowance.list);
  const [searchKey, setSearchKey] = useState<string>("");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortOrder>(SortOrderEnum.Values.ASC);
  const [column, setColumn] = useState<AllowancesTableColumns>(AllowancesTableColumnsEnum.Values.subAccountId);

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
    const filteredByAssets = selectedAssets.length > 0 ? filterByAsset(selectedAssets, rawAllowances) : rawAllowances;

    const filteredBySpender = filterBySpenderAndSubAccount(searchKey, filteredByAssets);
    const filtered = filteredBySpender;

    if (column === AllowancesTableColumnsEnum.Values.subAccountId) {
      return sortBySubAccount(sorting, filtered || []);
    }

    if (column === AllowancesTableColumnsEnum.Values.spender) {
      return sortBySpender(sorting, filtered || []);
    }

    if (column === AllowancesTableColumnsEnum.Values.amount) {
      return sortByAmount(sorting, filtered || []);
    }

    if (column === AllowancesTableColumnsEnum.Values.expiration) {
      return sortByExpiration(sorting, filtered || []);
    }

    return filtered;
  }, [selectedAssets, searchKey, sorting, column, rawAllowances]);

  return {
    allowances,
    sorting,
    column,
    setSorting,
    handleSortChange: onSort,
    searchKey,
    setSearchKey,
    selectedAssets,
    setSelectedAssets,
  };
}
