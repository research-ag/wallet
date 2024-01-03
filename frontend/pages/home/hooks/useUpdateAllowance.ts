import { Allowance } from "@/@types/allowance";
import { ValidationErrors, ServerStateKeys } from "@/@types/common";
import { queryClient } from "@/config/query";
import { allowanceSchema } from "@/helpers/schemas/allowance";
import { updateAllowanceRequest } from "@/services/allowance";
import { useAppSelector } from "@redux/Store";
import { EditActionType, setEditAllowanceDrawerState } from "@redux/allowances/AllowanceActions";
import { useMutation } from "@tanstack/react-query";
import { debounce } from "lodash";
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
    const valid = allowanceSchema.safeParse(allowance);
    if (valid.success) return updateAllowanceRequest(allowance);
    return Promise.reject(valid.error);
  }, [allowance, updateAllowanceRequest]);

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
      }));

      setErrors(validationErrors);
    }
  };

  const { mutate, isPending, isError, error, isSuccess } = useMutation({ mutationFn, onError, onSuccess });

  return {
    isPending,
    isError,
    error,
    isSuccess,
    allowance,
    validationErrors,
    updateAllowance: debounce(mutate, 1000),
    setAllowanceState,
  };
}
