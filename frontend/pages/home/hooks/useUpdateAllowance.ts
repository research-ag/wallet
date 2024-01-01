import { Allowance } from "@/@types/allowance";
import { Errors, ServerStateKeys } from "@/@types/common";
import { queryClient } from "@/config/query";
import { allowanceSchema } from "@/helpers/schemas/allowance";
import { updateAllowanceRequest } from "@/services/allowance";
import { useAppSelector } from "@redux/Store";
import { EditActionType, setEditAllowanceDrawerState } from "@redux/allowances/AllowanceActions";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";

export function useUpdateAllowance() {
  const [validationErrors, setErrors] = useState<Errors[]>([]);
  const { selectedAllowance } = useAppSelector((state) => state.allowance);
  const [allowance, setAllowance] = useState<Allowance>(selectedAllowance);

  useEffect(() => {
    setAllowance(selectedAllowance);
  }, [selectedAllowance]);

  const setAllowanceState = (allowanceData: Partial<Allowance>) => {
    setAllowance({
      ...allowance,
      ...allowanceData,
    });
  };

  const mutationFn = async () => {
    const valid = allowanceSchema.safeParse(allowance);
    if (valid.success) return updateAllowanceRequest(allowance);
    return Promise.reject(valid.error);
  };

  const onSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: [ServerStateKeys.allowances],
    });
    await queryClient.refetchQueries({
      queryKey: [ServerStateKeys.allowances],
    });
    setEditAllowanceDrawerState(EditActionType.closeDrawer);
  };

  const onError = async () => {
    if (error instanceof z.ZodError) {
      const validationErrors = error.issues.map((issue) => ({
        message: issue.message,
        field: String(issue.path[0]),
      }));

      setErrors(validationErrors);
    }
  };

  const {
    mutate: updateAllowance,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({ mutationFn, onError, onSuccess });

  return {
    isPending,
    isError,
    error,
    isSuccess,
    allowance,
    validationErrors,
    updateAllowance,
    setAllowanceState,
  };
}
