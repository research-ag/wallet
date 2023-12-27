import { cva } from "cva";

export const checkBoxCVA = cva([""], {
  variants: {
    checkboxSize: {
      small: "h-4 w-4",
      medium: "h-5 w-5",
      large: "h-6 w-6",
    },
    disabled: {
      true: ["opacity-50 pointer-events-none"],
      false: "",
    },
  },
  defaultVariants: {
    checkboxSize: "small",
    disabled: false
  },
});
