import { submitAllowanceApproval, createApproveAllowanceParams, getSubAccountBalance } from "@/pages/home/helpers/icrc";
import { useMutation } from "@tanstack/react-query";
import { throttle } from "lodash";
import { useCallback } from "react";
import dayjs from "dayjs";
import { useAppDispatch } from "@redux/Store";
import { initialAllowanceState } from "@redux/allowance/AllowanceReducer";
import { deleteAllowanceFromStorage } from "../services/allowance";
import { updateSubAccountBalance } from "@redux/assets/AssetReducer";
import { TAllowance } from "@/@types/allowance";
import { setAllowancesAction, setSelectedAllowanceAction } from "@redux/allowance/AllowanceActions";

export default function useDeleteAllowance() {
  const dispatch = useAppDispatch();

  const onError = (error: any) => {
    console.log("Error", error);
  };

  const mutationFn = useCallback(async (allowance: TAllowance) => {
    try {
      // TODO: if the expiration is undefined no updated in ledger (can be no expiration)
      // TODO: if the balance is 0, the amount will fail (add wait and show error)
      if (allowance?.expiration && dayjs().isBefore(dayjs(allowance.expiration))) {
        console.log("updating in the ledger");
        const params = createApproveAllowanceParams({ ...allowance, amount: "0", expiration: undefined });
        console.log({ allowance, params });
        await submitAllowanceApproval(params, allowance.asset.address);
      }

      const updatedAllowances = deleteAllowanceFromStorage(allowance);
      setAllowancesAction(updatedAllowances);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error };
    } finally {
      const refreshParams = {
        subAccount: allowance.subAccountId,
        assetAddress: allowance.asset.address,
      };
      const amount = await getSubAccountBalance(refreshParams);
      const balance = amount ? amount.toString() : "0";
      dispatch(updateSubAccountBalance(allowance.asset.tokenSymbol, allowance.subAccountId, balance));
      setSelectedAllowanceAction(initialAllowanceState);
    }
  }, []);

  const { mutate, isPending, isError, error, isSuccess } = useMutation({ mutationFn, onError });
  return { deleteAllowance: throttle(mutate, 1000), isPending, isError, error, isSuccess };
}
