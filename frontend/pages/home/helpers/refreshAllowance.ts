import { TAllowance } from "@/@types/allowance";
import { db } from "@/database/db";

export async function refreshAllowance(allowance: TAllowance, isDeleted = false) {
  try {
    const { spender: principalSpender } = allowance;

    if (isDeleted) {
      await db().deleteAllowance(principalSpender);
    } else {
      const alreadyExist = await db().getAllowance(principalSpender);

      if (alreadyExist) {
        await db().updateAllowance(principalSpender, allowance);
      } else {
        await db().addAllowance(allowance);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
