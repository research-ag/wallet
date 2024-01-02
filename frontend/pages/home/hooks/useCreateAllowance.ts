import { Allowance } from "@/@types/allowance";
import { postAllowance } from "@/services/allowance";
import { validatePrincipal } from "@/utils/identity";
import { CreateActionType, setCreateAllowanceDrawerState } from "@redux/allowances/AllowanceActions";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { allowanceSchema } from "@/helpers/schemas/allowance";
import { z } from "zod";
import { queryClient } from "@/config/query";
import { ValidationErrors, ServerStateKeys } from "@/@types/common";
import { useAppSelector } from "@redux/Store";

const initialAllowanceState: Allowance = {
  asset: {
    logo: "",
    name: "",
    symbol: "",
    subAccounts: [],
    address: "",
    decimal: "",
    sort_index: 0,
    index: "",
    tokenName: "",
    tokenSymbol: "",
  },
  subAccount: {},
  spender: {
    assets: [],
    name: "",
    accountIdentifier: "",
    principal: "",
  },
  amount: "",
  expiration: "",
  noExpire: true,
};

export function useCreateAllowance() {
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset);
  const [validationErrors, setErrors] = useState<ValidationErrors[]>([]);
  const [isPrincipalValid, setIsPrincipalValid] = useState(true);

  const initial = useMemo(() => {
    return {
      ...initialAllowanceState,
      asset: selectedAsset,
      subAccount: selectedAccount,
    };
  }, [selectedAsset]) as Allowance;

  const [allowance, setAllowance] = useState<Allowance>(initial);
  console.log(allowance);

  const setAllowanceState = (allowanceData: Partial<Allowance>) => {
    setAllowance({
      ...allowance,
      ...allowanceData,
    });
  };

  const mutationFn = useCallback(() => {
    const fullAllowance = { ...allowance, id: uuidv4() };
    const valid = allowanceSchema.safeParse(fullAllowance);
    if (valid.success) return postAllowance(fullAllowance);
    return Promise.reject(valid.error);
  }, [allowance]);

  const onSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: [ServerStateKeys.allowances],
    });
    await queryClient.refetchQueries({
      queryKey: [ServerStateKeys.allowances],
    });
    setCreateAllowanceDrawerState(CreateActionType.closeDrawer);
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

  const {
    mutate: createAllowance,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({ onSuccess, onError, mutationFn });

  useEffect(() => {
    if (allowance?.spender?.principal) {
      const isValid = validatePrincipal(allowance?.spender?.principal);
      setIsPrincipalValid(isValid);
    }
  }, [allowance?.spender?.principal]);

  return {
    allowance,
    isPending,
    isError,
    error,
    validationErrors,
    isSuccess,
    isPrincipalValid,
    createAllowance,
    setAllowanceState,
  };
}
