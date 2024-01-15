import { ServerStateKeysEnum } from "@/@types/common";
import { queryClient } from "@/config/query";
import { Identity } from "@dfinity/agent";
import store from "@redux/Store";
import { setAllowances } from "@redux/allowance/AllowanceReducer";

export async function invalidateAllowancesCache(): Promise<void> {
  try {
    await queryClient.invalidateQueries({
      queryKey: [ServerStateKeysEnum.Values.allowances],
    });
  } catch (e) {
    console.log(e);
  }
}

export async function reloadAllowancesCache(): Promise<void> {
  try {
    await queryClient.refetchQueries({
      queryKey: [ServerStateKeysEnum.Values.allowances],
    });
  } catch (e) {
    console.log(e);
  }
}

export async function allowanceFullReload(): Promise<void> {
  await invalidateAllowancesCache();
  await reloadAllowancesCache();
}

export function refreshAllowanceCache(authIdentity: Identity) {
  const allowancePrefix = `allowances-${authIdentity.getPrincipal().toString()}`;
  const allowanceData = localStorage.getItem(allowancePrefix);
  const allowances = JSON.parse(allowanceData || "[]");
  store.dispatch(setAllowances(allowances));
}
