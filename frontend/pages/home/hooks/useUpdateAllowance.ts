import { TAllowance } from "@/@types/allowance";
import { TErrorValidation, ServerStateKeysEnum } from "@/@types/common";
import { queryClient } from "@/config/query";
import { allowanceValidationSchema } from "@/helpers/schemas/allowance";
import { updateAllowanceRequest } from "@/services/allowance";
import { ICRCApprove, generateApproveAllowance } from "@pages/helpers/allowance";
import { useAppSelector } from "@redux/Store";
import { EditActionType, setEditAllowanceDrawerState } from "@redux/allowances/AllowanceActions";
import { useMutation } from "@tanstack/react-query";
import { throttle } from "lodash";
import { useCallback, useState } from "react";
import { z } from "zod";

export function useUpdateAllowance() {
  const [validationErrors, setErrors] = useState<TErrorValidation[]>([]);
  const { selectedAllowance } = useAppSelector((state) => state.allowance);
  const [allowance, setAllowance] = useState<TAllowance>(selectedAllowance);

  const setAllowanceState = (allowanceData: Partial<TAllowance>) => {
    setAllowance({
      ...allowance,
      ...allowanceData,
    });
  };

  const mutationFn = useCallback(async () => {
    try {
      const valid = allowanceValidationSchema.safeParse(allowance);
      if (!valid.success) return Promise.reject(valid.error);
      const params = generateApproveAllowance(allowance);
      await ICRCApprove(params, allowance.asset.address);
      await updateAllowanceRequest(allowance);
    } catch (error) {
      console.log(error);
    }
  }, [allowance]);

  const onSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: [ServerStateKeysEnum.Values.allowances],
    });
    await queryClient.refetchQueries({
      queryKey: [ServerStateKeysEnum.Values.allowances],
    });
    setEditAllowanceDrawerState(EditActionType.closeDrawer);
  };

  const onError = (error: any) => {
    if (error instanceof z.ZodError) {
      const validationErrors = error.issues.map((issue) => ({
        message: issue.message,
        field: String(issue.path[0]),
        code: issue.code,
      }));

      setErrors(validationErrors);
      return;
    }

    console.log("Error", error);
  };

  const { mutate, isPending, isError, error, isSuccess } = useMutation({ mutationFn, onError, onSuccess });

  return {
    isPending,
    isError,
    error,
    isSuccess,
    allowance,
    validationErrors,
    updateAllowance: throttle(mutate, 1000),
    setAllowanceState,
  };
}
