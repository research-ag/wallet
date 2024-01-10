import { z } from "zod";

export const SortOrderEnum = z.enum(["ASC", "DESC"]);
export type SortOrder = z.infer<typeof SortOrderEnum>;

export const ServerStateKeysEnum = z.enum(["allowances"]);
export type ServerStateKeys = z.infer<typeof ServerStateKeysEnum>;

const errorValidationSchema = z.object({
  message: z.string(),
  field: z.string(),
  code: z.string(),
});

export type TErrorValidation = z.infer<typeof errorValidationSchema>;

export const DetailsTabsEnum = z.enum(["TRANSACTIONS", "ALLOWANCES"]);
export type DetailsTabs = z.infer<typeof DetailsTabsEnum>;
