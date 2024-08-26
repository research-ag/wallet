import { z } from "zod";

const SelectOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  subLabel: z.string().optional(),
  icon: z.any().optional(),
  subIcon: z.any().optional(),
  labelClassname: z.string().optional(),
  sublabelClassname: z.string().optional(),
});

export type SelectOption = z.infer<typeof SelectOptionSchema>;
