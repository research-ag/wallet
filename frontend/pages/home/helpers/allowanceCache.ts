import { TAllowance } from "@/@types/allowance";
import { getAllowanceDetails } from "@/pages/home/helpers/icrc";
import { setAllowancesAction } from "@redux/allowance/AllowanceActions";

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
      } catch (error) {
        console.log(error);
      }
    }
  }
  setAllowancesAction(updatedAllowances);
}
