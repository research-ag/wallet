import { TAllowance } from "@/@types/allowance";
import { db } from "@/database/db";

export async function refreshAllowance(allowance: TAllowance, isDeleted = false) {
  try {
    const { spender: principalSpender } = allowance;

    if (isDeleted) {
      await db().deleteAllowance(principalSpender);
    } else {
      const isNew = await db().getAllowance(principalSpender);

      if (isNew) {
        await db().addAllowance(allowance);
      } else {
        await db().updateAllowance(principalSpender, allowance);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
