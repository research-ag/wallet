import { AllowanceValidationErrorsEnum, TAllowance } from "@/@types/allowance";
import { validatePrincipal } from "@/common/utils/definityIdentity";
import store from "@redux/Store";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import dayjs from "dayjs";
import { db } from "@/database/db";
import { isHexadecimalValid } from "@pages/home/helpers/checkers";
import { toHoleBigInt, validateAmount } from "@common/utils/amount";
import { getTransactionFeeFromLedger } from "@common/libs/icrc";

export async function getDuplicatedAllowance(allowance: TAllowance): Promise<TAllowance | undefined> {
  return (await db().getAllowance(db().generateAllowancePrimaryKey(allowance))) || undefined;
}

export async function validateCreateAllowance(allowance: TAllowance, asset: Asset) {
  if (!allowance.asset.address || !allowance.asset.decimal || !allowance.asset.supportedStandards.includes("ICRC-2"))
    throw AllowanceValidationErrorsEnum.Values["error.invalid.asset"];

  if (!isHexadecimalValid(allowance.subAccountId))
    throw AllowanceValidationErrorsEnum.Values["error.invalid.subaccount"];

  if (!allowance?.spender || !validatePrincipal(allowance.spender))
    throw AllowanceValidationErrorsEnum.Values["error.invalid.spender.principal"];

  if (allowance?.spender === store.getState().auth.userPrincipal.toText())
    throw AllowanceValidationErrorsEnum.Values["error.self.allowance"];

  const transactionFee = await getTransactionFeeFromLedger({
    assetAddress: allowance.asset.address,
    assetDecimal: allowance.asset.decimal,
  });

  const isAmountMoreThanFee =
    toHoleBigInt(allowance.amount || "0", Number(allowance.asset.decimal)) >
    toHoleBigInt(transactionFee || "0", Number(allowance.asset.decimal));

  if (
    !allowance.amount ||
    Number(allowance.amount) === 0 ||
    !validateAmount(allowance.amount, Number(allowance.asset.decimal)) ||
    !isAmountMoreThanFee
  )
    throw AllowanceValidationErrorsEnum.Values["error.invalid.amount"];

  const subAccount = asset.subAccounts.find(
    (subAccount) => subAccount.sub_account_id === allowance.subAccountId,
  ) as SubAccount;

  const bigintFee = BigInt(subAccount.transaction_fee);
  const bigintAmount = BigInt(subAccount.amount);
  if (bigintFee > bigintAmount) throw AllowanceValidationErrorsEnum.Values["error.not.enough.balance"];

  if (allowance?.expiration && dayjs(allowance?.expiration).isBefore(dayjs()))
    throw AllowanceValidationErrorsEnum.Values["error.before.present.expiration"];
}

export async function validateUpdateAllowance(allowance: TAllowance, asset: Asset) {
  const transactionFee = await getTransactionFeeFromLedger({
    assetAddress: allowance.asset.address,
    assetDecimal: allowance.asset.decimal,
  });

  const isAmountMoreThanFee =
    toHoleBigInt(allowance.amount || "0", Number(allowance.asset.decimal)) >
    toHoleBigInt(transactionFee || "0", Number(allowance.asset.decimal));

  if (!allowance.amount || !validateAmount(allowance.amount, Number(allowance.asset.decimal)) || !isAmountMoreThanFee)
    throw AllowanceValidationErrorsEnum.Values["error.invalid.amount"];

  const subAccount = asset.subAccounts.find(
    (subAccount) => subAccount.sub_account_id === allowance.subAccountId,
  ) as SubAccount;

  const bigintFee = BigInt(subAccount?.transaction_fee);
  const bigintAmount = BigInt(subAccount?.amount);
  if (bigintFee > bigintAmount) throw AllowanceValidationErrorsEnum.Values["error.not.enough.balance"];

  if (allowance?.expiration && dayjs(allowance?.expiration).isBefore(dayjs()))
    throw AllowanceValidationErrorsEnum.Values["error.before.present.expiration"];
}
