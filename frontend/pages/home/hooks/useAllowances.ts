import { useMemo } from "react";
import { listAllowances } from "@/services/allowance";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@redux/Store";
import { ServerStateKeys } from "@/@types/common";
import { minutesToMilliseconds } from "@/utils/time";

export default function useAllowances() {
  const { selectedAsset } = useAppSelector((state) => state.asset);

  const executeQuery = async () => {
    return await listAllowances(selectedAsset?.tokenSymbol);
  };

  const query = useQuery({
    queryKey: [ServerStateKeys.allowances],
    queryFn: executeQuery,
    staleTime: minutesToMilliseconds(10),
    // enabled: Boolean(selectedAsset?.tokenSymbol),
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
  };
}
