import store from "@redux/Store";
import { setAllowances } from "@redux/allowance/AllowanceReducer";

export function refreshAllowanceCache(principal: string) {
  console.log("Refreshing allowance cache for " + principal);
  const allowancePrefix = `allowances-${principal}`;
  const allowanceData = localStorage.getItem(allowancePrefix);
  const allowances = JSON.parse(allowanceData || "[]");
  store.dispatch(setAllowances(allowances));
}
