import { removeAllowance } from "@/services/allowance";
import { useMutation } from "@tanstack/react-query";

export function useDeleteAllowance() {
  const mutationFn = async (id: string) => {
    try {
      await removeAllowance(id);
    } catch (e) {
      console.log(e);
    }
  };

  const { mutate: deleteAllowance, isPending, isError, error, isSuccess } = useMutation({ mutationFn });

  return { deleteAllowance, isPending, isError, error, isSuccess };
}
