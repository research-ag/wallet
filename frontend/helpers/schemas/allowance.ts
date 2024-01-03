import { validatePrincipal } from "@/utils/identity";
import * as z from "zod";

export const allowanceSchema = z.object({
  id: z.string().uuid(),
  asset: z.object({}).required(),
  subAccount: z
    .object({
      address: z.string(),
      name: z.string(),
      amount: z.string(),
      sub_account_id: z.string(),
    })
    .required(),
  spender: z
    .object({
      principal: z.string().refine(validatePrincipal, {
        message: "Invalid principal",
        path: ["principal"],
      }),
    })
    .required(),
  amount: z.string().min(1).max(10),
  expiration: z.string().refine((value) => !value || !isNaN(Date.parse(value)), { message: "Invalid expiration date" }),
  noExpire: z.boolean(),
});
