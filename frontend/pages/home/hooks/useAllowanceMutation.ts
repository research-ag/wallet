import { Allowance } from "@/@types/allowance";
import { postAllowance } from "@/services/allowance";
import { setIsCreateAllowance } from "@redux/allowances/AllowanceActions";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const fakeRequest = (message: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("mutation is done: " + message);
    }, 3000);
  });
};

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
  const [allowance, setAllowance] = useState<Allowance>(initialAllowanceState);

  const resetAllowanceState = () => {
    setAllowance(initialAllowanceState);
    setIsCreateAllowance(false);
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

  const mutationFn = async () => {
    try {
      // const response = await postAllowance(allowance);
      console.log("create", allowance);
      resetAllowanceState();
    } catch (e) {
      console.log(e);
    }
  };

  const { mutate: createAllowance, isPending, isError, error, isSuccess } = useMutation({ mutationFn });

  return {
    allowance,
    isPending,
    isError,
    error,
    isSuccess,
    createAllowance,
    resetAllowanceState,
    setFullAllowance,
    setAllowanceState,
  };
}

export function useUpdateAllowance() {
  const mutationFn = async (allowanceData: Allowance) => {
    try {
      const response = await fakeRequest("update");
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const { mutate: updateAllowance, isPending, isError, error, isSuccess } = useMutation({ mutationFn });

  return { updateAllowance, isPending, isError, error, isSuccess };
}

export function useDeleteAllowance() {
  const mutationFn = async (allowanceData: Allowance) => {
    try {
      const response = await fakeRequest("delete");
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const { mutate: deleteAllowance, isPending, isError, error, isSuccess } = useMutation({ mutationFn });

  return { deleteAllowance, isPending, isError, error, isSuccess };
}
