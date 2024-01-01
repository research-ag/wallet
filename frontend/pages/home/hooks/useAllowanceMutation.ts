import { Allowance } from "@/@types/allowance";
import { postAllowance, removeAllowance, updateAllowanceRequest } from "@/services/allowance";
import { validatePrincipal } from "@/utils/identity";
import { useAppSelector } from "@redux/Store";
import {
  CreateActionType,
  EditActionType,
  setCreateAllowanceDrawerState,
  setEditAllowanceDrawerState,
} from "@redux/allowances/AllowanceActions";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const initialAllowanceState: Allowance = {
  id: "",
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
  const [isPrincipalValid, setIsPrincipalValid] = useState(true);
  const [allowance, setAllowance] = useState<Allowance>(initialAllowanceState);

  const resetAllowanceState = () => {
    const asset = allowance.asset;
    setAllowance({ ...initialAllowanceState, asset });
    setCreateAllowanceDrawerState(CreateActionType.closeDrawer);
  };

  const setAllowanceState = (allowanceData: Partial<Allowance>) => {
    setAllowance({
      ...allowance,
      ...allowanceData,
    });
  };

  const setFullAllowance = (allowanceData: Allowance) => {
    setAllowance(allowanceData);
  };

  const mutationFn = useCallback(async () => {
    try {
      const fullAllowance = { ...allowance, id: uuidv4() };
      await postAllowance(fullAllowance);
      resetAllowanceState();
    } catch (e) {
      console.log(e);
    }
  }, [allowance, resetAllowanceState]);

  const { mutate: createAllowance, isPending, isError, error, isSuccess } = useMutation({ mutationFn });

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
    isSuccess,
    isPrincipalValid,
    createAllowance,
    resetAllowanceState,
    setFullAllowance,
    setAllowanceState,
  };
}

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
