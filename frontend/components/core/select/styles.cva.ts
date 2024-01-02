import { cva } from "cva";

export const selectTriggerCVA = cva(
  [
    "flex",
    "justify-between",
    "items-center",
    "p-2",
    "bg-[#211E49]",
    "border rounded-md",
    "mt-2 ",
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
      border: {
        none: "border-[#3C3867]",
        error: "border-TextErrorColor",
      },
    },
    defaultVariants: {
      disabled: false,
      border: "none",
    },
    compoundVariants: [],
  },
);

export const selectContentCVA = cva(["w-[24rem] z-50 mt-2", "bg-[#151331] p-2", "rounded-md border border-[#33B0EC]"], {
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
