import { useEffect } from "react";
import { listAllowances } from "@/services/allowance";
import { useQuery } from "@tanstack/react-query";

export default function useAllowances() {
  const executeQuery = async () => {
    return await listAllowances();
  };

  const query = useQuery({
    queryKey: ["allowances"],
    queryFn: executeQuery,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const { data, isLoading, isError, error, isFetching, refetch } = query;

  useEffect(() => {
    if (isError) {
      // TODO: show feedback error
    }
  }, [isError]);

  return {
    allowances: data || [],
    isLoading: isLoading || isFetching,
    isError,
    error,
    refetch,
  };
}
