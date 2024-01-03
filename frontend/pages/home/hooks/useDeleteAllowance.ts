import { ServerStateKeys } from "@/@types/common";
import { queryClient } from "@/config/query";
import { removeAllowance } from "@/services/allowance";
import { useMutation } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useCallback } from "react";

export function useDeleteAllowance() {
  const onSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: [ServerStateKeys.allowances],
    });
    await queryClient.refetchQueries({
      queryKey: [ServerStateKeys.allowances],
    });
  };

  const mutationFn = useCallback(async (id: string) => removeAllowance(id), [removeAllowance]);

  const { mutate, isPending, isError, error, isSuccess } = useMutation({ mutationFn, onSuccess });

  return { deleteAllowance: debounce(mutate, 1000), isPending, isError, error, isSuccess };
}
