import { AllowancesTableColumns, AllowancesTableColumnsEnum } from "@/@types/allowance";
import { SortOrder, SortOrderEnum } from "@/@types/common";
import { useAppSelector } from "@redux/Store";
import { useMemo, useState } from "react";
import { filterByAsset } from "../helpers/allowanceSorters";

export default function useAllowances() {
  const { allowances: rawAllowances } = useAppSelector((state) => state.allowance);
  const [searchKey, setSearchKey] = useState("");
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
    const filtered = selectedAssets.length > 0
      ? filterByAsset(selectedAssets, rawAllowances)
      : rawAllowances;

    return filtered || [];

    // if (column === AllowancesTableColumnsEnum.Values.subAccountId) {
    //   return sortBySubAccount(sorting, filtered || []);
    // }

    // if (column === AllowancesTableColumnsEnum.Values.spender) {
    //   return filterBySpender(sorting, filtered || []);
    // }

    // if (column === AllowancesTableColumnsEnum.Values.expiration) {
    //   return sortByExpiration(sorting, filtered || []);
    // }

    // if (column === AllowancesTableColumnsEnum.Values.amount) {
    //   return filterByAmount(sorting, filtered || []);
    // }

    // return [];
  }, [rawAllowances, sorting, column, selectedAssets]);

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
