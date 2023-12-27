import { cva } from "cva";

export const selectTriggerCVA = cva(
  [
    "flex",
    "justify-between",
    "items-center",
    "p-2",
    "bg-[#211E49]",
    "border-2",
    "rounded-md",
    "mt-2 border-[#3C3867]",
    "cursor-pointer",
    "px-4",
    "h-14",
  ],
  {
    variants: {
      disabled: {
        true: ["opacity-50 pointer-events-none"],
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
    compoundVariants: [],
  },
);

export const selectContentCVA = cva(["w-2/2", "bg-[#151331] p-2", "rounded-sm border border-[#33B0EC]"], {
  variants: {
    disabled: {
      true: ["opacity-50 pointer-events-none"],
      false: "",
    },
  },
  defaultVariants: {
    disabled: false,
  },
});
