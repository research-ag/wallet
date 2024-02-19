import { TAllowance } from "@/@types/allowance";
import store from "@redux/Store";
import { setAllowancesAction } from "@redux/allowance/AllowanceActions";
import { replaceAllowancesToStorage } from "../services/allowance";

export async function refreshAllowance(allowance: TAllowance, isDelete = false) {
  try {
    // TODO: no call to getAllowanceDetails if duplicated
    const allowances = store.getState().allowance.allowances;

    const spenderPrincipal = allowance.spender;
    const spenderSubaccount = allowance.subAccountId;
    // const assetAddress = allowance.asset.address;
    // const assetDecimal = allowance.asset.decimal;

    console.log("refreshing allowance: ", allowance);

    const filtered = allowances.filter(
      (currentAllowance) =>
        currentAllowance.spender !== spenderPrincipal ||
        currentAllowance.subAccountId !== spenderSubaccount ||
        currentAllowance.asset.tokenSymbol !== allowance.asset.tokenSymbol,
    );

    if (isDelete) {
      console.log("deleted allowance: ", allowance);
      setAllowancesAction(filtered);
      replaceAllowancesToStorage(filtered);
      return;
    }

    console.log("cleaned allowances: ", filtered);

    // const response = await getAllowanceDetails({
    //   spenderPrincipal,
    //   spenderSubaccount,
    //   assetAddress,
    //   assetDecimal,
    // });

    const updatedAllowances = [...filtered, allowance];
    setAllowancesAction(updatedAllowances);
    replaceAllowancesToStorage(updatedAllowances);
  } catch (error) {
    console.log(error);
  }
}
