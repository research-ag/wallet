import { TAllowance } from "@/@types/allowance";
import store from "@redux/Store";
import { setAllowancesAction } from "@redux/allowance/AllowanceActions";
import { replaceAllowancesToStorage } from "../services/allowance";

export async function refreshAllowance(allowance: TAllowance, isDelete = false) {
  try {
    const allowances = store.getState().allowance.allowances;

    const spenderPrincipal = allowance.spender;
    const spenderSubaccount = allowance.subAccountId;

    const filtered = allowances.filter(
      (currentAllowance) =>
        currentAllowance.spender !== spenderPrincipal ||
        currentAllowance.subAccountId !== spenderSubaccount ||
        currentAllowance.asset.tokenSymbol !== allowance.asset.tokenSymbol,
    );

    if (isDelete) {
      setAllowancesAction(filtered);
      replaceAllowancesToStorage(filtered);
      return;
    }

    const updatedAllowances = [...filtered, allowance];
    setAllowancesAction(updatedAllowances);
    replaceAllowancesToStorage(updatedAllowances);
  } catch (error) {
    console.log(error);
  }
}
