import { AllowanceValidationErrorsEnum, TAllowance } from "@/@types/allowance";
import { validateAmount } from "@/utils";
import { isHexadecimalValid } from "@/utils/checkers";
import { validatePrincipal } from "@/utils/identity";
import store from "@redux/Store";
import dayjs from "dayjs";

export const LOCAL_STORAGE_PREFIX = `allowances-${store.getState().auth.userPrincipal.toText()}`;

export function validateCreateAllowance(allowance: TAllowance) {
  if (!allowance.asset.address || !allowance.asset.decimal || !allowance.asset.supportedStandards.includes("ICRC-2"))
    throw AllowanceValidationErrorsEnum.Values["error.invalid.asset"];

  if (!isHexadecimalValid(allowance.subAccount.sub_account_id))
    throw AllowanceValidationErrorsEnum.Values["error.invalid.subaccount"];

  if (!allowance?.spender?.principal || !validatePrincipal(allowance.spender.principal))
    throw AllowanceValidationErrorsEnum.Values["error.invalid.sender.principal"];

  if (allowance?.spender?.principal === store.getState().auth.userPrincipal.toText())
    throw AllowanceValidationErrorsEnum.Values["error.self.allowance"];

  const storageAllowances = localStorage.getItem(LOCAL_STORAGE_PREFIX);
  const allowances = JSON.parse(storageAllowances || "[]") as TAllowance[];
  const allowanceExists = allowances.find(
    (currentAllowance) =>
      currentAllowance.subAccount.sub_account_id === allowance.subAccount.sub_account_id &&
      currentAllowance.spender.principal === allowance?.spender?.principal &&
      currentAllowance.asset.tokenSymbol === allowance.asset.tokenSymbol,
  );
  if (allowanceExists) throw AllowanceValidationErrorsEnum.Values["error.allowance.duplicated"];

  if (!allowance.amount || !validateAmount(allowance.amount, Number(allowance.asset.decimal)))
    throw AllowanceValidationErrorsEnum.Values["error.invalid.amount"];

  const bigintFee = BigInt(allowance.subAccount.transaction_fee);
  const bigintAmount = BigInt(allowance.subAccount.amount);
  if (bigintAmount <= bigintFee) throw AllowanceValidationErrorsEnum.Values["error.not.enough.balance"];

  if (allowance?.expiration && dayjs(allowance?.expiration).isBefore(dayjs()))
    throw AllowanceValidationErrorsEnum.Values["error.before.present.expiration"];
}

export function validateUpdateAllowance(allowance: TAllowance) {
  if (!allowance.amount || !validateAmount(allowance.amount, Number(allowance.asset.decimal)))
    throw AllowanceValidationErrorsEnum.Values["error.invalid.amount"];

  const bigintFee = BigInt(allowance.subAccount.transaction_fee);
  const bigintAmount = BigInt(allowance.subAccount.amount);
  if (bigintAmount <= bigintFee) throw AllowanceValidationErrorsEnum.Values["error.not.enough.balance"];

  if (allowance?.expiration && dayjs(allowance?.expiration).isBefore(dayjs()))
    throw AllowanceValidationErrorsEnum.Values["error.before.present.expiration"];
}
