import { AllowancesTableColumns, AllowancesTableColumnsEnum } from "@/@types/allowance";
import { SortOrder, SortOrderEnum } from "@/@types/common";
import { useAppSelector } from "@redux/Store";
import { useMemo, useState } from "react";
import { filterByAsset, filterBySpenderAndSubAccount } from "../helpers/filters";
import { sortByAmount, sortByExpiration, sortBySpender, sortBySubAccount } from "../helpers/sorters";
import { RoutingPathEnum } from "@common/const";

export default function useAllowances() {
  const { route } = useAppSelector((state) => state.auth);
  const { allowances: rawAllowances } = useAppSelector((state) => state.allowance.list);
  const { selectedAccount, selectedAsset } = useAppSelector((state) => state.asset.helper);
  const [searchKey, setSearchKey] = useState<string>("");
  const [assetFilters, setAssetFilters] = useState<string[]>([]);
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
    const isHomeInPath = route === RoutingPathEnum.Enum.HOME;

    const finalAssetFilter = isHomeInPath ? [selectedAsset?.tokenSymbol || ""] : assetFilters || [];
    const filteredByAssets =
      finalAssetFilter.length > 0 ? filterByAsset(finalAssetFilter, rawAllowances) : rawAllowances;

    const subAccountFilter = isHomeInPath ? selectedAccount?.sub_account_id || "" : searchKey;
    const filteredBySpender = filterBySpenderAndSubAccount(subAccountFilter, filteredByAssets);

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
  }, [assetFilters, searchKey, sorting, column, rawAllowances, selectedAccount, selectedAsset]);

  return {
    allowances,
    sorting,
    column,
    setSorting,
    handleSortChange: onSort,
    searchKey,
    setSearchKey,
    assetFilters,
    setAssetFilters,
  };
}
