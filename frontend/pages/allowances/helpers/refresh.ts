import { TAllowance } from "@/@types/allowance";
import { db } from "@/database/db";
import logger from "@/common/utils/logger";

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
    logger.debug(error);
  }
}
