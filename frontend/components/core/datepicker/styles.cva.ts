import { cva } from "cva";

export const selectTriggerCVA = cva(
  [
    "w-full bg-[#211E49] border border-[#3C3867] rounded-md flex justify-between items-center",
    "h-12 px-4 py-2 border-2 border-[#3C3867]",
  ],
  {
    variants: {
      disabled: {
        true: ["opacity-60 pointer-events-none"],
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);

export const selectContentCVA = cva(["w-full bg-[#1B183F] border border-[#33B2EF] rounded-md"], {
  variants: {},
  defaultVariants: {},
});
