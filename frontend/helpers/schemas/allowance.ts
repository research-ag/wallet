import { validateAmount } from "@/utils";
import { validatePrincipal } from "@/utils/identity";
import * as z from "zod";
// TODO: implement validation from allowance types

export const validationMessage = {
  spender: "Invalid principal",
  expiration: "Invalid expiration date",
  dateRequired: "Expiration ate is required",
  dateNowAllowed: "Expiration Date is not allowed",
  expiredDate: "Select a Expiration Date after the present",
  lowBalance: "Sub account balance is not enough",
  invalidAmount: "Amount has not a valid format",
};

export const allowanceSchema = z
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
