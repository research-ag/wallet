import { ServerStateKeys } from "@/@types/common";
import { queryClient } from "@/config/query";
import { removeAllowance } from "@/services/allowance";
import { useMutation } from "@tanstack/react-query";

export function useDeleteAllowance() {
  const onSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: [ServerStateKeys.allowances],
    });
    await queryClient.refetchQueries({
      queryKey: [ServerStateKeys.allowances],
    });
  };

  const mutationFn = async (id: string) => {
    try {
      await removeAllowance(id);
    } catch (e) {
      console.log(e);
    }
  };

  const { mutate: deleteAllowance, isPending, isError, error, isSuccess } = useMutation({ mutationFn, onSuccess });

  return { deleteAllowance, isPending, isError, error, isSuccess };
}
