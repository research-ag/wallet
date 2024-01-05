import { Allowance } from "@/@types/allowance";
import { ValidationErrors, ServerStateKeys } from "@/@types/common";
import { queryClient } from "@/config/query";
import { allowanceSchema } from "@/helpers/schemas/allowance";
import { updateAllowanceRequest } from "@/services/allowance";
import { ICRCApprove, generateApproveAllowance } from "@pages/helpers/allowance";
import { useAppSelector } from "@redux/Store";
import { EditActionType, setEditAllowanceDrawerState } from "@redux/allowances/AllowanceActions";
import { useMutation } from "@tanstack/react-query";
import { throttle } from "lodash";
import { useCallback, useState } from "react";
import { z } from "zod";

export function useUpdateAllowance() {
  const [validationErrors, setErrors] = useState<ValidationErrors[]>([]);
  const { selectedAllowance } = useAppSelector((state) => state.allowance);
  const [allowance, setAllowance] = useState<Allowance>(selectedAllowance);

  const setAllowanceState = (allowanceData: Partial<Allowance>) => {
    setAllowance({
      ...allowance,
      ...allowanceData,
    });
  };

  const mutationFn = useCallback(async () => {
    try {
      const valid = allowanceSchema.safeParse(allowance);
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
      queryKey: [ServerStateKeys.allowances],
    });
    await queryClient.refetchQueries({
      queryKey: [ServerStateKeys.allowances],
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
