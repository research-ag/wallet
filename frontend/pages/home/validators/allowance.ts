import { AllowanceValidationErrorsEnum, TAllowance } from "@/@types/allowance";
import { toHoleBigInt, validateAmount } from "@/utils";
import { isHexadecimalValid } from "@/utils/checkers";
import { validatePrincipal } from "@/utils/identity";
import store from "@redux/Store";
import { removeAllowanceError, setAllowanceError } from "@redux/allowance/AllowanceReducer";
import dayjs from "dayjs";
import * as z from "zod";

export const LOCAL_STORAGE_PREFIX = `allowances-${store.getState().auth.userPrincipal.toText()}`;

export const validationMessage = {
  spender: "Invalid principal",
  expiration: "Invalid expiration date",
  dateRequired: "Expiration ate is required",
  dateNowAllowed: "Expiration Date is not allowed",
  expiredDate: "Select a Expiration Date after the present",
  lowBalance: "Sub account balance is not enough",
  invalidAmount: "Amount has not a valid format",
  duplicatedAllowance: "Duplicated allowance",
  systemLoading: "system is loading, try again in a few seconds",
};

export function validateCreateAllowance(allowance: TAllowance) {
  if (!allowance.asset.address || !allowance.asset.decimal || !allowance.asset.supportedStandards.includes("ICRC-2"))
    return store.dispatch(setAllowanceError(AllowanceValidationErrorsEnum.Values["error.invalid.asset"]));
  store.dispatch(removeAllowanceError(AllowanceValidationErrorsEnum.Values["error.invalid.asset"]));

  if (isHexadecimalValid(allowance.subAccount.sub_account_id))
    return store.dispatch(setAllowanceError(AllowanceValidationErrorsEnum.Values["error.invalid.subaccount"]));
  store.dispatch(removeAllowanceError(AllowanceValidationErrorsEnum.Values["error.invalid.subaccount"]));

  if (!validatePrincipal(allowance.spender.principal))
    return store.dispatch(setAllowanceError(AllowanceValidationErrorsEnum.Values["error.invalid.sender.principal"]));
  store.dispatch(removeAllowanceError(AllowanceValidationErrorsEnum.Values["error.invalid.sender.principal"]));

  if (allowance.spender.principal === store.getState().auth.userPrincipal.toText())
    return store.dispatch(setAllowanceError(AllowanceValidationErrorsEnum.Values["error.self.allowance"]));
  store.dispatch(removeAllowanceError(AllowanceValidationErrorsEnum.Values["error.self.allowance"]));

  const bigintFee = toHoleBigInt(allowance.subAccount.transaction_fee, Number(allowance.asset.decimal));
  const bigintAmount = toHoleBigInt(allowance.amount, Number(allowance.asset.decimal));

  if (bigintAmount <= bigintFee)
    return store.dispatch(setAllowanceError(AllowanceValidationErrorsEnum.Values["error.not.enough.balance"]));
  store.dispatch(removeAllowanceError(AllowanceValidationErrorsEnum.Values["error.not.enough.balance"]));

  const storageAllowances = localStorage.getItem(LOCAL_STORAGE_PREFIX);
  const allowances = JSON.parse(storageAllowances || "[]") as TAllowance[];
  const allowanceExists = allowances.find(
    (allowance) =>
      allowance.subAccount.sub_account_id === allowance.subAccount.sub_account_id &&
      allowance.spender.principal === allowance.spender.principal &&
      allowance.asset.tokenSymbol === allowance.asset.tokenSymbol,
  );

  if (allowanceExists)
    return store.dispatch(setAllowanceError(AllowanceValidationErrorsEnum.Values["error.allowance.duplicated"]));
  store.dispatch(removeAllowanceError(AllowanceValidationErrorsEnum.Values["error.allowance.duplicated"]));

  if (allowance?.expiration && dayjs(allowance?.expiration).isBefore(new Date().toDateString()))
    return store.dispatch(setAllowanceError(AllowanceValidationErrorsEnum.Values["error.allowance.duplicated"]));
  store.dispatch(removeAllowanceError(AllowanceValidationErrorsEnum.Values["error.allowance.duplicated"]));
}

export function validateUpdateAllowance(allowance: TAllowance) {
  const bigintFee = toHoleBigInt(allowance.subAccount.transaction_fee, Number(allowance.asset.decimal));
  const bigintAmount = toHoleBigInt(allowance.amount, Number(allowance.asset.decimal));

  if (bigintAmount <= bigintFee)
    return store.dispatch(setAllowanceError(AllowanceValidationErrorsEnum.Values["error.not.enough.balance"]));
  store.dispatch(removeAllowanceError(AllowanceValidationErrorsEnum.Values["error.not.enough.balance"]));

  if (allowance?.expiration && dayjs(allowance?.expiration).isBefore(new Date().toDateString()))
    return store.dispatch(setAllowanceError(AllowanceValidationErrorsEnum.Values["error.allowance.duplicated"]));
  store.dispatch(removeAllowanceError(AllowanceValidationErrorsEnum.Values["error.allowance.duplicated"]));
}

export const allowanceValidationSchema = z
  .object({
    id: z.string().uuid(),
    asset: z
      .object({
        decimal: z.string(),
      })
      .required(),
    subAccount: z
      .object({
        address: z.string().min(3),
        name: z.string().min(1),
        amount: z.string().min(1),
        sub_account_id: z.string().min(3),
      })
      .required(),
    spender: z
      .object({
        principal: z.string().refine(validatePrincipal, {
          message: validationMessage.spender,
          path: ["principal"],
        }),
      })
      .required(),
    amount: z.string().min(1),
    expiration: z
      .string()
      .refine((value) => !value || !isNaN(Date.parse(value)), { message: validationMessage.expiration })
      .optional(),
    noExpire: z.boolean(),
  })
  .superRefine(({ expiration, noExpire, subAccount, amount, asset }, refinementContext) => {
    if (!noExpire && !expiration) {
      refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationMessage.dateRequired,
        path: ["expiration"],
        params: { isCustom: true },
      });
      return;
    }

    if (noExpire && expiration) {
      refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationMessage.dateNowAllowed,
        path: ["expiration"],
        params: { isCustom: true },
      });
      return;
    }

    if (!noExpire && expiration) {
      if (new Date() > new Date(expiration)) {
        refinementContext.addIssue({
          code: z.ZodIssueCode.custom,
          message: validationMessage.expiredDate,
          path: ["expiration"],
          params: { isCustom: true },
        });
      }
    }

    if (subAccount?.amount && Number(subAccount?.amount) <= 0) {
      refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationMessage.lowBalance,
        path: ["amount"],
        params: { isCustom: true },
      });
      return;
    }

    if (!validateAmount(amount, Number(asset.decimal))) {
      refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationMessage.invalidAmount,
        path: ["amount"],
        params: { isCustom: true },
      });
    }
  });
