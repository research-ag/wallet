import { Allowance } from "@/@types/allowance";
import { postAllowance } from "@/services/allowance";
import { validatePrincipal } from "@/utils/identity";
import { CreateActionType, setCreateAllowanceDrawerState } from "@redux/allowances/AllowanceActions";
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

  const mutationFn = useCallback(async () => {
    try {
      const fullAllowance = { ...allowance, id: uuidv4() };
      console.log(fullAllowance);
      //   await postAllowance(fullAllowance);
      // resetAllowanceState();
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
    setAllowanceState,
  };
}
