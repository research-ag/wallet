import { submitAllowanceApproval, createApproveAllowanceParams, getSubAccountBalance } from "@/pages/home/helpers/icrc";
import { useMutation } from "@tanstack/react-query";
import { throttle } from "lodash";
import { useCallback } from "react";
import dayjs from "dayjs";
import { useAppDispatch } from "@redux/Store";
import { initialAllowanceState } from "@redux/allowance/AllowanceReducer";
import { removeAllowance } from "../services/allowance";
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
      if (!allowance?.id) {
        throw new Error("Invalid allowance");
      }

      if (allowance.expiration) {
        const currentDate = dayjs();
        const expirationDate = dayjs(allowance.expiration);

        if (currentDate.isBefore(expirationDate)) {
          const params = createApproveAllowanceParams({ ...allowance, amount: "0", expiration: undefined });
          await submitAllowanceApproval(params, allowance.asset.address);
        }
      }

      const latestAllowances = await removeAllowance(allowance.id);
      setAllowancesAction(latestAllowances);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error };
    } finally {
      const refreshParams = {
        subAccount: allowance.subAccount.sub_account_id,
        assetAddress: allowance.asset.address,
      };
      const amount = await getSubAccountBalance(refreshParams);
      const balance = amount ? amount.toString() : "0";
      dispatch(updateSubAccountBalance(allowance.asset.tokenSymbol, allowance.subAccount.sub_account_id, balance));
      setSelectedAllowanceAction(initialAllowanceState);
    }
  }, []);

  const { mutate, isPending, isError, error, isSuccess } = useMutation({ mutationFn, onError });
  return { deleteAllowance: throttle(mutate, 1000), isPending, isError, error, isSuccess };
}
