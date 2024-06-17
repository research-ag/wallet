import { checkHexString } from "@common/utils/hexadecimal";
import { Principal } from "@dfinity/principal";
import { Asset } from "@redux/models/AccountModels";
import logger from "@/common/utils/logger";
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

  const amount = BigInt(currentAccount.amount);
  const fee = BigInt(asset.subAccounts[0].transaction_fee);

  return amount > fee;
};

export const isValidInputPrincipal = (principal: string): boolean => {
  try {
    if (!principal || principal === "") return true;
    Principal.fromText(principal);
    return true;
  } catch (error) {
    return false;
  }
};
