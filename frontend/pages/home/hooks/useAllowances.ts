import { useMemo, useState } from "react";
import { listAllowances } from "@/services/allowance";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@redux/Store";
import { ServerStateKeys, SortOrder } from "@/@types/common";
import { minutesToMilliseconds } from "@/utils/time";
import { AllowancesTableColumns } from "@/@types/allowance";
import { queryClient } from "@/config/query";

export default function useAllowances() {
  const [order, setOrder] = useState<SortOrder>(SortOrder.ASC);
  const [column, setColumn] = useState<AllowancesTableColumns>(AllowancesTableColumns.subAccount);

  const { selectedAsset } = useAppSelector((state) => state.asset);

  const setSorting = async (orderColumn: AllowancesTableColumns) => {
    if (orderColumn === column) {
      setOrder(order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC);
    }
    setColumn(orderColumn);
    await queryClient.refetchQueries({
      queryKey: [ServerStateKeys.allowances, selectedAsset?.tokenSymbol, order, column],
    });
  };

  const executeQuery = async () => {
    return await listAllowances(selectedAsset?.tokenSymbol, column, order);
  };

  const query = useQuery({
    queryKey: [ServerStateKeys.allowances, selectedAsset?.tokenSymbol, order, column],
    queryFn: executeQuery,
    staleTime: minutesToMilliseconds(10),
    enabled: Boolean(selectedAsset?.tokenSymbol && order && column),
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
    refetch,
    setSorting,
  };
}
