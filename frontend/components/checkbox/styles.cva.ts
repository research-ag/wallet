import { cva } from "cva";

export const checkBoxCVA = cva("button", {
  variants: {
    rounding: {
      sm: ["rounded-sm"],
      md: ["rounded"],
      lg: ["rounded-lg"],
      full: ["rounded-full"],
    },
    size: {
      small: ["text-md", "p-1"],
      medium: ["text-lg", "p-3"],
      large: ["text-xl", "p-4"],
    },
    border: {
      none: ["border-0"],
      border: ["border"],
      underline: ["border-0", "border-b", "!px-0", "!rounded-none", "!pb-0"],
    },
    disabled: {
      true: ["opacity-50 pointer-events-none"],
      false: "",
    },
  },
  compoundVariants: [
    {
      rounding: "md",
      border: "border",
      class: "",
    },
  ],
  defaultVariants: {
    rounding: "md",
    size: "small",
    border: "border",
    disabled: false,
  },
});
