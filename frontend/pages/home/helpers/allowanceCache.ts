import { TAllowance } from "@/@types/allowance";
import { getAllowanceDetails } from "@/pages/home/helpers/icrc/";
import { db } from "@/database/db";
import store from "@redux/Store";
import { setReduxAllowances } from "@redux/allowance/AllowanceReducer";

export async function allowanceCacheRefresh() {
  const allowances = await db().getAllowances();
  const updatedAllowances: TAllowance[] = [];

  console.log("stored allowances: ", updatedAllowances);

  if (allowances?.length) {
    for (const allowance of allowances) {
      try {
        const spenderPrincipal = allowance?.spender;
        const spenderSubaccount = allowance?.subAccountId;
        const assetAddress = allowance?.asset.address;
        const assetDecimal = allowance?.asset.decimal;

        if (
          typeof spenderPrincipal === "string" &&
          typeof spenderSubaccount === "string" &&
          typeof assetAddress === "string" &&
          typeof assetDecimal === "string"
        ) {
          const response = await getAllowanceDetails({
            spenderPrincipal,
            spenderSubaccount,
            assetAddress,
            assetDecimal,
          });

          updatedAllowances.push({
            ...allowance,
            amount: response?.allowance ? response?.allowance : "0",
            expiration: response?.expires_at ? response?.expires_at : "",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  console.log("updated allowances: ", updatedAllowances);

  // TODO: check why update allowances if if the (expiration, amount) is only for memory
  // await db().updateAllowances(updatedAllowances);
  store.dispatch(setReduxAllowances(updatedAllowances));
}
