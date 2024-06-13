import { checkHexString } from "@common/utils/hexadecimal";
import { Principal } from "@dfinity/principal";
import { Asset } from "@redux/models/AccountModels";
import logger from "@/common/utils/logger";
import { toHoleBigInt } from "@common/utils/amount";
import { getAllowanceDetails } from "@common/libs/icrcledger/icrcAllowance";
import { CheckAllowanceParams } from "@/@types/icrc";
// common

export const isPrincipalValid = (principal: string): boolean => {
  if (!principal || principal === "") return false;

  try {
    Principal.fromText(principal);
    return true;
  } catch (error) {
    return false;
  }
};

export const isSubAccountIdValid = (subAccountId: string): boolean => {
  return subAccountId.trim() !== "" && checkHexString(subAccountId);
};

export const isAmountGreaterThanFee = (asset: Asset, subAccountId: string): boolean => {
  if (!asset || !subAccountId) return false;

  const currentAccount = asset.subAccounts.find((subAccount) => subAccount.sub_account_id === subAccountId);

  if (!currentAccount) {
    logger.debug("TransferForm: subaccount not found");
    return false;
  }

  const amount = toHoleBigInt(currentAccount.amount, asset.decimal);
  const fee = toHoleBigInt(currentAccount.transaction_fee, asset.decimal);

  return amount > fee;
};

export const isAllowanceGreaterThanFree = async (asset: Asset, args: CheckAllowanceParams): Promise<boolean> => {
  const allowance = await getAllowanceDetails(args);
  const fee = toHoleBigInt(asset.subAccounts[0].transaction_fee, asset.decimal);
  const amount = toHoleBigInt(allowance.amount, asset.decimal);
  return amount > fee;
};
