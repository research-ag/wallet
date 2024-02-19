import { AllowanceValidationErrorsEnum, TAllowance } from "@/@types/allowance";
import { validateAmount } from "@/utils";
import { isHexadecimalValid } from "@/utils/checkers";
import { validatePrincipal } from "@/utils/identity";
import store from "@redux/Store";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import dayjs from "dayjs";
import { LOCAL_STORAGE_PREFIX } from "../services/allowance";

export function getDuplicatedAllowance(allowance: TAllowance): TAllowance | undefined {
  const storageAllowances = localStorage.getItem(LOCAL_STORAGE_PREFIX);
  const allowances = JSON.parse(storageAllowances || "[]") as TAllowance[];
  return allowances.find(
    (currentAllowance) =>
      currentAllowance.subAccountId === allowance.subAccountId &&
      currentAllowance.spender === allowance?.spender &&
      currentAllowance.asset.tokenSymbol === allowance.asset.tokenSymbol,
  );
}

export function validateCreateAllowance(allowance: TAllowance, asset: Asset) {
  // TODO: validate that the amount can not be 0
  if (!allowance.asset.address || !allowance.asset.decimal || !allowance.asset.supportedStandards.includes("ICRC-2"))
    throw AllowanceValidationErrorsEnum.Values["error.invalid.asset"];

  if (!isHexadecimalValid(allowance.subAccountId))
    throw AllowanceValidationErrorsEnum.Values["error.invalid.subaccount"];

  if (!allowance?.spender || !validatePrincipal(allowance.spender))
    throw AllowanceValidationErrorsEnum.Values["error.invalid.spender.principal"];

  if (allowance?.spender === store.getState().auth.userPrincipal.toText())
    throw AllowanceValidationErrorsEnum.Values["error.self.allowance"];

  // INFO: removed because duplicated allowance will not be needed
  // const allowanceExists = getDuplicatedAllowance(allowance);
  // if (allowanceExists) throw AllowanceValidationErrorsEnum.Values["error.allowance.duplicated"];

  if (!allowance.amount || !validateAmount(allowance.amount, Number(allowance.asset.decimal)))
    throw AllowanceValidationErrorsEnum.Values["error.invalid.amount"];

  const subAccount = asset.subAccounts.find(
    (subAccount) => subAccount.sub_account_id === allowance.subAccountId,
  ) as SubAccount;

  const bigintFee = BigInt(subAccount.transaction_fee);
  const bigintAmount = BigInt(subAccount.amount);
  if (bigintAmount <= bigintFee) throw AllowanceValidationErrorsEnum.Values["error.not.enough.balance"];

  if (allowance?.expiration && dayjs(allowance?.expiration).isBefore(dayjs()))
    throw AllowanceValidationErrorsEnum.Values["error.before.present.expiration"];
}

export function validateUpdateAllowance(allowance: TAllowance, asset: Asset) {
  if (!allowance.amount || !validateAmount(allowance.amount, Number(allowance.asset.decimal)))
    throw AllowanceValidationErrorsEnum.Values["error.invalid.amount"];

  const subAccount = asset.subAccounts.find(
    (subAccount) => subAccount.sub_account_id === allowance.subAccountId,
  ) as SubAccount;

  const bigintFee = BigInt(subAccount?.transaction_fee);
  const bigintAmount = BigInt(subAccount?.amount);
  if (bigintAmount <= bigintFee) throw AllowanceValidationErrorsEnum.Values["error.not.enough.balance"];

  if (allowance?.expiration && dayjs(allowance?.expiration).isBefore(dayjs()))
    throw AllowanceValidationErrorsEnum.Values["error.before.present.expiration"];
}
