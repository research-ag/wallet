import { Allowance } from "@/@types/allowance";
import { updateAllowanceRequest } from "@/services/allowance";
import { useAppSelector } from "@redux/Store";
import { EditActionType, setEditAllowanceDrawerState } from "@redux/allowances/AllowanceActions";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useUpdateAllowance() {
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
    try {
      await updateAllowanceRequest(allowance);
      setEditAllowanceDrawerState(EditActionType.closeDrawer);
    } catch (e) {
      console.log(e);
    }
  };

  const { mutate: updateAllowance, isPending, isError, error, isSuccess } = useMutation({ mutationFn });

  return {
    updateAllowance,
    isPending,
    isError,
    error,
    isSuccess,
    allowance,
    setAllowanceState,
  };
}
