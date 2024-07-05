import { TAllowance } from "@/@types/allowance";
import { getAllowanceDetails } from "@/common/libs/icrcledger/icrcAllowance";
import { db } from "@/database/db";
import store from "@redux/Store";
import { setReduxAllowances } from "@redux/allowance/AllowanceReducer";
import logger from "@/common/utils/logger";

export async function allowanceCacheRefresh() {
  const allowances = await db().getAllowances();
  const updatedAllowances: TAllowance[] = [];

  if (allowances?.length) {
    const promises = allowances.map(async (allowance) => {
      try {
        const spenderPrincipal = allowance?.spender;
        const spenderSubaccount = allowance?.subAccountId;
        const assetAddress = allowance?.asset.address;
        const assetDecimal = allowance?.asset.decimal;

        if (
          typeof spenderPrincipal === "string" &&
          typeof spenderSubaccount === "string" &&
          typeof assetAddress === "string" &&
          typeof assetDecimal === "string"
        ) {
          const response = await getAllowanceDetails({
            spenderPrincipal,
            allocatorSubaccount: spenderSubaccount,
            assetAddress,
            assetDecimal,
          });

          return {
            ...allowance,
            amount: response?.amount || "0",
            expiration: response?.expiration || "",
          };
        }

        return allowance;
      } catch (error) {
        logger.debug(error);
        return allowance;
      }
    });

    const updatedAllowancesData = await Promise.all(promises);

    updatedAllowances.push(...updatedAllowancesData.filter((allowance) => allowance !== null));
  }

  store.dispatch(setReduxAllowances(updatedAllowances));
}
