import { Identity } from "@dfinity/agent";
import store from "@redux/Store";
import { setAllowances } from "@redux/allowance/AllowanceReducer";

export function refreshAllowanceCache(authIdentity: Identity) {
  const allowancePrefix = `allowances-${authIdentity.getPrincipal().toString()}`;
  const allowanceData = localStorage.getItem(allowancePrefix);
  const allowances = JSON.parse(allowanceData || "[]");
  store.dispatch(setAllowances(allowances));
}
