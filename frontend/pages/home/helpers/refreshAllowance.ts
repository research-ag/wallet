import { TAllowance } from "@/@types/allowance";
import { db } from "@/database/db";

// TODO: check if the db query affect the state amount updated
export async function refreshAllowance(allowance: TAllowance, isDeleted = false) {
  try {
    const primaryKey = db().generateAllowancePrimaryKey(allowance);

    if (isDeleted) {
      await db().deleteAllowance(primaryKey, { sync: true });
    } else {
      const alreadyExist = await db().getAllowance(primaryKey);

      if (alreadyExist) {
        await db().updateAllowance(primaryKey, allowance, { sync: true });
      } else {
        await db().addAllowance({ ...allowance, id: primaryKey }, { sync: true });
      }
    }
  } catch (error) {
    console.log(error);
  }
}
