import { ServerStateKeysEnum } from "@/@types/common";
import { queryClient } from "@/config/query";

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
