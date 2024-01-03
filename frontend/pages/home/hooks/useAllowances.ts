import { useMemo, useState } from "react";
import { listAllowances } from "@/services/allowance";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@redux/Store";
import { ServerStateKeys, SortOrder } from "@/@types/common";
import { minutesToMilliseconds } from "@/utils/time";
import { AllowancesTableColumns } from "@/@types/allowance";
import { queryClient } from "@/config/query";
import { throttle } from "lodash";

export default function useAllowances() {
  const [sorting, setSorting] = useState<SortOrder>(SortOrder.ASC);
  const [column, setColumn] = useState<AllowancesTableColumns>(AllowancesTableColumns.subAccount);

  const { selectedAsset } = useAppSelector((state) => state.asset);

  const onSort = async (orderColumn: AllowancesTableColumns) => {
    if (orderColumn === column) {
      setSorting(sorting === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC);
    }

    if (orderColumn !== column) {
      setColumn(orderColumn);
      setSorting(SortOrder.ASC);
    }

    await queryClient.refetchQueries({
      queryKey: [ServerStateKeys.allowances],
    });
  };

  const executeQuery = async () => {
    return await listAllowances(selectedAsset?.tokenSymbol, column, sorting);
  };

  const query = useQuery({
    queryKey: [ServerStateKeys.allowances, selectedAsset?.tokenSymbol, column, sorting],
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
    handleSortChange: throttle(onSort, 1000),
  };
}
