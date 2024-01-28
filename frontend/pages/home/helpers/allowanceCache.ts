import { TAllowance } from "@/@types/allowance";
import store from "@redux/Store";
import { setAllowances } from "@redux/allowance/AllowanceReducer";
import { checkAllowanceExist } from "./icrc";

export async function allowanceCacheRefresh(principal: string) {
  const allowancePrefix = `allowances-${principal}`;
  const allowanceData = localStorage.getItem(allowancePrefix);
  const allowances = JSON.parse(allowanceData || "[]") as TAllowance[];
  const updatedAllowances: TAllowance[] = [];

  if (allowances?.length) {
    for (const allowance of allowances) {
      try {
        const spenderPrincipal = allowance.spender.principal;
        const spenderSubaccount = allowance.subAccount.sub_account_id;
        const assetAddress = allowance.asset.address;
        const assetDecimal = allowance.asset.decimal;

        const response = await checkAllowanceExist({
          spenderPrincipal,
          spenderSubaccount,
          assetAddress,
          assetDecimal,
        });

        updatedAllowances.push({
          ...allowance,
          amount: response?.allowance || allowance.amount,
          expiration: response?.expires_at || allowance.expiration,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  store.dispatch(setAllowances(updatedAllowances));
}
