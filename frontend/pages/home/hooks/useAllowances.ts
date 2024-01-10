import { AllowancesTableColumns, AllowancesTableColumnsEnum } from "@/@types/allowance";
import { ServerStateKeysEnum, SortOrder, SortOrderEnum } from "@/@types/common";
import { queryClient } from "@/config/query";
import { listAllowances } from "@/services/allowance";
import { minutesToMilliseconds } from "@/utils/time";
import { useAppSelector } from "@redux/Store";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export default function useAllowances() {
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

    await queryClient.refetchQueries({
      queryKey: [ServerStateKeysEnum.Values.allowances],
    });
  };

  const executeQuery = async () => {
    return await listAllowances(selectedAsset?.tokenSymbol, column, sorting);
  };

  const query = useQuery({
    queryKey: [ServerStateKeysEnum.Values.allowances, selectedAsset?.tokenSymbol, column, sorting],
    queryFn: executeQuery,
    staleTime: minutesToMilliseconds(10),
    enabled: Boolean(selectedAsset?.tokenSymbol && sorting && column),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const { data, isLoading, isError, error, isFetching, refetch } = query;
  const allowances = useMemo(() => data || [], [data]);

  return {
    allowances,
    isLoading: isLoading || isFetching,
    isError,
    error,
    sorting,
    column,
    refetch,
    setSorting,
    handleSortChange: onSort,
  };
}
