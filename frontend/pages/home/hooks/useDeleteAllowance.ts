import { TAllowance } from "@/@types/allowance";
import { ServerStateKeysEnum } from "@/@types/common";
import { queryClient } from "@/config/query";
import { removeAllowance } from "@/services/allowance";
import { ICRCApprove, generateApproveAllowance } from "@pages/helpers/allowance";
import { useMutation } from "@tanstack/react-query";
import { throttle } from "lodash";
import { useCallback } from "react";

export function useDeleteAllowance() {
  const onSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: [ServerStateKeysEnum.Values.allowances],
    });
    await queryClient.refetchQueries({
      queryKey: [ServerStateKeysEnum.Values.allowances],
    });
  };

  const onError = (error: any) => {
    console.log("Error", error);
  };

  const mutationFn = useCallback(async (allowance: TAllowance) => {
    try {
      if (!allowance?.id) return new Error("Invalid allowance");
      const params = generateApproveAllowance({ ...allowance, amount: "0", expiration: undefined });
      await ICRCApprove(params, allowance.asset.address);
      await removeAllowance(allowance?.id);
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }, []);

  const { mutate, isPending, isError, error, isSuccess } = useMutation({ mutationFn, onSuccess, onError });

  return { deleteAllowance: throttle(mutate, 1000), isPending, isError, error, isSuccess };
}
