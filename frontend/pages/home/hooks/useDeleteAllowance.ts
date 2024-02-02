import { TAllowance } from "@/@types/allowance";
import { submitAllowanceApproval, createApproveAllowanceParams } from "@/pages/home/helpers/icrc";
import { useMutation } from "@tanstack/react-query";
import { throttle } from "lodash";
import { useCallback } from "react";
import dayjs from "dayjs";
import { useAppDispatch } from "@redux/Store";
import { setAllowances } from "@redux/allowance/AllowanceReducer";
import { removeAllowance } from "../services/allowance";

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

      if (allowance.expiration || allowance.noExpire) {
        const currentDate = dayjs();
        const expirationDate = dayjs(allowance.expiration);

        if (currentDate.isBefore(expirationDate) || allowance.noExpire) {
          const params = createApproveAllowanceParams({ ...allowance, amount: "0", expiration: undefined });
          await submitAllowanceApproval(params, allowance.asset.address);
        }
      }

      const latestAllowances = await removeAllowance(allowance.id);
      dispatch(setAllowances(latestAllowances));
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error };
    }
  }, []);

  const { mutate, isPending, isError, error, isSuccess } = useMutation({ mutationFn, onError });

  return { deleteAllowance: throttle(mutate, 1000), isPending, isError, error, isSuccess };
}
